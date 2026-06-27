import { ServiceResponse } from '../utils/serviceResponse';
import { asyncCatch } from '../middlewares/errorHandler';
import { Op } from 'sequelize';
import { Body, Controller, Get, Post, Path, Route, Security, Tags } from 'tsoa';
import fs from 'fs';
import path from 'path';
import Visitor from '../models/visitor';

export interface AutoReportResponse {
    generated: boolean;
    reason?: string;
    downloadUrl?: string;
    reportCount?: number;
    visitorCount?: number;
    threshold?: number;
}

@Route('api/reports')
@Tags('Reports')
export class ReportController extends Controller {
    private readonly reportsDir = path.join(process.cwd(), 'tmp', 'reports');
    private readonly threshold = 20;
    private readonly maxAgeMs = 24 * 60 * 60 * 1000;

    private ensureReportsDir(): void {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    private cleanupOldReports(): number {
        this.ensureReportsDir();
        let deleted = 0;
        const now = Date.now();
        try {
            const files = fs.readdirSync(this.reportsDir);
            for (const file of files) {
                const filePath = path.join(this.reportsDir, file);
                try {
                    const stat = fs.statSync(filePath);
                    if (now - stat.mtimeMs > this.maxAgeMs) {
                        fs.unlinkSync(filePath);
                        deleted++;
                    }
                } catch {
                    // skip
                }
            }
        } catch {
            // skip
        }
        return deleted;
    }

    @Security('jwt', ['report:create'])
    @Post('/auto')
    @asyncCatch
    public async autoGenerateReport(
        @Body() body?: { department?: string }
    ): Promise<ServiceResponse<AutoReportResponse>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }

        this.cleanupOldReports();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const whereClause: any = {
            entryTime: { [Op.gte]: today },
        };
        if (body?.department) {
            whereClause.department = body.department;
        }

        const visitorCount = await Visitor.count({ where: whereClause });

        if (visitorCount < this.threshold) {
            return ServiceResponse.success(
                'Report not generated',
                {
                    generated: false,
                    reason: `Only ${visitorCount} visitor(s) checked in today. Threshold is ${this.threshold}.`,
                    visitorCount,
                    threshold: this.threshold,
                    reportCount: 0,
                }
            );
        }

        const visitors = await Visitor.findAll({
            where: whereClause,
            order: [['entryTime', 'ASC']],
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `visitor-report-${timestamp}.html`;
        const filePath = path.join(this.reportsDir, filename);

        const html = this.buildReportHtml({
            title: 'Visitor Check-In Report',
            generatedAt: new Date().toLocaleString(),
            visitors: visitors.map(v => v.toJSON()),
            visitorCount,
        });

        fs.writeFileSync(filePath, html, 'utf-8');

        return ServiceResponse.success(
            'Report generated successfully',
            {
                generated: true,
                downloadUrl: `/api/reports/download/${filename}`,
                visitorCount,
                threshold: this.threshold,
                reportCount: visitors.length,
            }
        );
    }

    @Security('jwt', ['report:list'])
    @Get('/list')
    @asyncCatch
    public async listReports(): Promise<ServiceResponse<{ files: { name: string; size: number; createdAt: string }[] }>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }

        this.cleanupOldReports();
        this.ensureReportsDir();

        const files = fs.readdirSync(this.reportsDir)
            .filter((f) => f.endsWith('.html'))
            .map((name) => {
                const filePath = path.join(this.reportsDir, name);
                const stat = fs.statSync(filePath);
                return {
                    name,
                    size: stat.size,
                    createdAt: stat.mtime.toISOString(),
                };
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return ServiceResponse.success('Reports listed successfully', { files });
    }

    @Security('jwt', ['report:read'])
    @Get('/download/:filename')
    @asyncCatch
    public async downloadReport(@Path() filename: string): Promise<any> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }

        this.ensureReportsDir();
        const safeName = path.basename(filename);
        const filePath = path.join(this.reportsDir, safeName);

        if (!fs.existsSync(filePath)) {
            return ServiceResponse.failure('Report not found', null, 404);
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        return content;
    }

    private buildReportHtml({
        title,
        generatedAt,
        visitors,
        visitorCount,
    }: {
        title: string;
        generatedAt: string;
        visitors: any[];
        visitorCount: number;
    }): string {
        const rows = visitors
            .map(
                (v) => `
            <tr>
              <td>${this.escapeHtml(v.fullName || '-')}</td>
              <td>${this.escapeHtml(v.mobile || '-')}</td>
              <td>${this.escapeHtml(v.visitorCompany || '-')}</td>
              <td>${this.escapeHtml(v.department || '-')}</td>
              <td>${this.escapeHtml(v.idProofType || '-')}</td>
              <td>${this.escapeHtml(v.idNumber || '-')}</td>
              <td>${this.escapeHtml(v.status || '-')}</td>
              <td>${this.escapeHtml(v.badgeId || '-')}</td>
              <td>${this.escapeHtml(v.entryTime ? new Date(v.entryTime).toLocaleString() : '-')}</td>
            </tr>
        `
            )
            .join('');

        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${this.escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
    h1 { color: #1A3263; font-size: 24px; margin: 0 0 8px; }
    .meta { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #1A3263; color: #fff; padding: 10px; text-align: left; }
    td { border: 1px solid #D1D5DB; padding: 8px; vertical-align: top; word-break: break-word; }
    tr:nth-child(even) { background: #F9FAFB; }
    @media print {
      @page { margin: 12mm; }
      body { margin: 0; }
      th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tr:nth-child(even) { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <h1>${this.escapeHtml(title)}</h1>
  <div class="meta">Generated on ${this.escapeHtml(generatedAt)} � Total records: ${visitorCount}</div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Mobile</th>
        <th>Company</th>
        <th>Department</th>
        <th>ID Type</th>
        <th>ID Number</th>
        <th>Status</th>
        <th>Badge</th>
        <th>Entry Time</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
    }

    private escapeHtml(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
