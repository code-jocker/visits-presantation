import { ServiceResponse } from '../utils/serviceResponse';
import { asyncCatch } from '../middlewares/errorHandler';
import { Op } from 'sequelize';
import { Body, Controller, Get, Post, Path, Route, Security, Tags } from 'tsoa';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import Visitor from '../models/visitor';
import db from '../models';

export interface AutoReportResponse {
    generated: boolean;
    reason?: string;
    downloadUrl?: string;
    reportCount?: number;
    visitorCount?: number;
    threshold?: number;
    visitorsDeleted?: number;
    format?: 'excel' | 'excel_v2' | 'csv' | 'word' | 'pdf' | 'html';
    reportId?: string;
}

export interface AutoDeleteResponse {
    success: boolean;
    deletedCount: number;
    deletedFiles: string[];
    retentionDays: number;
}

@Route('api/reports')
@Tags('Reports')
export class ReportController extends Controller {
    private readonly reportsDir = path.join(process.cwd(), 'tmp', 'reports');
    private readonly threshold = 20;
    private readonly defaultRetentionDays = 1;
    private readonly retentionFeatureKey = 'report_retention_days';

    private getFormatLabel(format: string): string {
        switch (format) {
            case 'excel': return 'Excel';
            case 'csv': return 'CSV';
            case 'word': return 'Word';
            case 'pdf': return 'PDF';
            default: return 'HTML';
        }
    }

    private buildExcelContent(visitors: any[], visitorCount: number): Buffer {
        const data = visitors.map(v => ({
            Date: v.entryTime ? new Date(v.entryTime).toLocaleDateString() : '-',
            Time: v.entryTime ? new Date(v.entryTime).toLocaleTimeString() : '-',
            'Visitor Name': v.fullName || '-',
            'Contact Info': v.mobile || '-',
            Email: v.email || '-',
            Company: v.visitorCompany || '-',
            Department: v.department || '-',
            Host: v.hostName || '-',
            'Purpose of Visit': v.purpose || '-',
            'ID Type': v.idProofType || '-',
            'ID Number': v.idNumber || '-',
            Status: v.status || '-',
            Badge: v.badgeId || '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Attendance');

        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }

    private buildExcelContentV2(visitors: any[], visitorCount: number): Buffer {
        // Improved column order (explicitly matches the requested v2 layout)

        const data = visitors.map(v => ({
            Date: v.entryTime ? new Date(v.entryTime).toLocaleDateString() : '-',
            Time: v.entryTime ? new Date(v.entryTime).toLocaleTimeString() : '-',
            'Visitor Name': v.fullName || '-',
            Phone: v.mobile || '-',
            Email: v.email || '-',
            Company: v.visitorCompany || '-',
            Department: v.department || '-',
            Host: v.hostName || '-',
            'Purpose of Visit': v.purpose || '-',
            'ID Type': v.idProofType || '-',
            'ID Number': v.idNumber || '-',
            Status: v.status || '-',
            Badge: v.badgeId || '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Attendance (v2)');

        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }


    private buildCsvContent(visitors: any[], visitorCount: number): string {
        const headers = ['Date', 'Time', 'Visitor Name', 'Contact Info', 'Email', 'Company', 'Department', 'Host', 'Purpose of Visit', 'ID Type', 'ID Number', 'Status', 'Badge'];
        const rows = visitors.map(v => [
            v.entryTime ? new Date(v.entryTime).toLocaleDateString() : '-',
            v.entryTime ? new Date(v.entryTime).toLocaleTimeString() : '-',
            v.fullName || '-',
            v.mobile || '-',
            v.email || '-',
            v.visitorCompany || '-',
            v.department || '-',
            v.hostName || '-',
            v.purpose || '-',
            v.idProofType || '-',
            v.idNumber || '-',
            v.status || '-',
            v.badgeId || '-'
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }

    private ensureReportsDir(): void {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    private async getRetentionDays(): Promise<number> {
        try {
            const features = await db.SystemFeature.findAll({ where: { featureKey: this.retentionFeatureKey } });
            if (features && features.length > 0) {
                const desc = (features[0] as any).getDataValue('description');
                const parsed = parseInt(desc || '', 10);
                if (!Number.isNaN(parsed) && parsed > 0) return parsed;
            }
        } catch {
            // ignore
        }
        return this.defaultRetentionDays;
    }

    private async cleanupOldReports(): Promise<number> {
        this.ensureReportsDir();
        let deleted = 0;
        const now = Date.now();
        const retentionDays = await this.getRetentionDays();
        const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;
        try {
            const files = fs.readdirSync(this.reportsDir);
            for (const file of files) {
                const filePath = path.join(this.reportsDir, file);
                try {
                    const stat = fs.statSync(filePath);
                    if (now - stat.mtimeMs > maxAgeMs) {
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
        @Body() body?: { department?: string; format?: 'excel' | 'excel_v2' | 'csv' | 'word' | 'pdf' | 'html'; force?: boolean }
    ): Promise<ServiceResponse<AutoReportResponse>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }

        return this.generateAutoReport(body);
    }

    @Security('jwt', ['report:create'])
    @Post('/generate')
    @asyncCatch
    public async generateReport(
        @Body() body?: { format?: 'excel' | 'excel_v2' | 'csv' | 'word' | 'pdf' | 'html'; department?: string }
    ): Promise<ServiceResponse<AutoReportResponse>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }

        return this.buildAndSaveReport(body);
    }

    private async buildAndSaveReport(
        body?: { format?: 'excel' | 'excel_v2' | 'csv' | 'word' | 'pdf' | 'html'; department?: string }
    ): Promise<ServiceResponse<AutoReportResponse>> {
        await this.cleanupOldReports();

        const format = body?.format || 'html';
        const whereClause: any = {};
        if (body?.department) {
            whereClause.department = body.department;
        }

        const visitors = await Visitor.findAll({
            where: whereClause,
            order: [['entryTime', 'ASC']],
        });

        const visitorCount = visitors.length;

        if (visitorCount === 0) {
            return ServiceResponse.success(
                'No visitors found to generate report',
                {
                    generated: false,
                    reason: 'No visitor records available.',
                    visitorCount: 0,
                    threshold: 0,
                    reportCount: 0,
                }
            );
        }

        let reportNumber = 1;
        try {
            const files = fs.readdirSync(this.reportsDir);
            const reportNumbers = files
                .map(f => {
                    const match = f.match(/visitor-report-(\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                })
                .filter(n => n > 0);
            if (reportNumbers.length > 0) {
                reportNumber = Math.max(...reportNumbers) + 1;
            }
        } catch {
            // Directory doesn't exist yet
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        let filename: string;

        switch (format) {
            case 'excel':
                filename = `visitor-report-${reportNumber}.xlsx`;
                const excelContent = this.buildExcelContent(visitors.map(v => v.toJSON()), visitorCount);
                fs.writeFileSync(path.join(this.reportsDir, filename), excelContent);
                break;
            case 'excel_v2':
                filename = `visitor-report-${reportNumber}.xlsx`;
                const excelV2Content = this.buildExcelContentV2(visitors.map(v => v.toJSON()), visitorCount);
                fs.writeFileSync(path.join(this.reportsDir, filename), excelV2Content);
                break;
            case 'csv':
                filename = `visitor-report-${reportNumber}.csv`;
                const csvContent = this.buildCsvContent(visitors.map(v => v.toJSON()), visitorCount);
                fs.writeFileSync(path.join(this.reportsDir, filename), csvContent, 'utf-8');
                break;
            case 'word':
                filename = `visitor-report-${reportNumber}.doc`;
                const wordHtml = this.buildReportHtml({
                    title: 'Visitor Attendance Report',
                    generatedAt: new Date().toLocaleString(),
                    visitors: visitors.map(v => v.toJSON()),
                    visitorCount,
                });
                fs.writeFileSync(path.join(this.reportsDir, filename), wordHtml, 'utf-8');
                break;
            case 'pdf':
                filename = `visitor-report-${reportNumber}.pdf`;
                const pdfHtml = this.buildReportHtml({
                    title: 'Visitor Attendance Report',
                    generatedAt: new Date().toLocaleString(),
                    visitors: visitors.map(v => v.toJSON()),
                    visitorCount,
                });
                fs.writeFileSync(path.join(this.reportsDir, filename), pdfHtml, 'utf-8');
                break;
            default:
                filename = `visitor-report-${reportNumber}.html`;
                const defaultHtml = this.buildReportHtml({
                    title: 'Visitor Attendance Report',
                    generatedAt: new Date().toLocaleString(),
                    visitors: visitors.map(v => v.toJSON()),
                    visitorCount,
                });
                fs.writeFileSync(path.join(this.reportsDir, filename), defaultHtml, 'utf-8');
                break;
        }

        const firstVisitorId = visitors[0]?.id;
        const lastVisitorId = visitors[visitors.length - 1]?.id;

        const report = await db.Report.create({
            filename,
            format,
            visitorCount,
            firstVisitorId,
            lastVisitorId,
            visitorsDeleted: 0,
            department: body?.department,
            downloadUrl: `/api/reports/download/${filename}`,
        });

        const adminUsers = await db.User.findAll({ where: { status: 'active' } });
        for (const admin of adminUsers) {
            await db.Notification.create({
                recipientId: admin.id,
                recipientType: 'user',
                title: 'Visitor Report Generated',
                message: `Manual report (${this.getFormatLabel(format)}) generated with ${visitorCount} visitors. File: ${filename}`,
                type: 'report_generated',
            });
        }

        return ServiceResponse.success(
            'Report generated successfully',
            {
                generated: true,
                downloadUrl: `/api/reports/download/${filename}`,
                visitorCount,
                threshold: 0,
                reportCount: visitorCount,
                visitorsDeleted: 0,
                format,
                reportId: report.id || undefined,
            }
        );
    }

    public async generateAutoReport(
        body?: { department?: string; format?: 'excel' | 'excel_v2' | 'csv' | 'word' | 'pdf' | 'html'; force?: boolean }
    ): Promise<ServiceResponse<AutoReportResponse>> {
        await this.cleanupOldReports();

        const format = body?.format || 'html';
        const force = body?.force === true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const whereClause: any = {
            entryTime: { [Op.gte]: today },
        };
        if (body?.department) {
            whereClause.department = body.department;
        }

        const visitorCount = await Visitor.count({ where: whereClause });

        if (!force && visitorCount < this.threshold) {
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

        // Get last report number for continuation numbering
        let reportNumber = 1;
        try {
            const files = fs.readdirSync(this.reportsDir);
            const reportNumbers = files
                .map(f => {
                    const match = f.match(/visitor-report-(\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                })
                .filter(n => n > 0);
            if (reportNumbers.length > 0) {
                reportNumber = Math.max(...reportNumbers) + 1;
            }
        } catch {
            // Directory doesn't exist yet
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        let filename: string;

        switch (format) {
            case 'excel':
                filename = `visitor-report-${reportNumber}.xlsx`;
                const excelContent = this.buildExcelContent(visitors.map(v => v.toJSON()), visitorCount);
                fs.writeFileSync(path.join(this.reportsDir, filename), excelContent);
                break;
            case 'excel_v2':
                filename = `visitor-report-${reportNumber}.xlsx`;
                const excelV2Content = this.buildExcelContentV2(visitors.map(v => v.toJSON()), visitorCount);
                fs.writeFileSync(path.join(this.reportsDir, filename), excelV2Content);
                break;
            case 'csv':
                filename = `visitor-report-${reportNumber}.csv`;
                const csvContent = this.buildCsvContent(visitors.map(v => v.toJSON()), visitorCount);
                fs.writeFileSync(path.join(this.reportsDir, filename), csvContent, 'utf-8');
                break;
            case 'word':
                filename = `visitor-report-${reportNumber}.doc`;
                const html = this.buildReportHtml({
                    title: 'Visitor Check-In Report',
                    generatedAt: new Date().toLocaleString(),
                    visitors: visitors.map(v => v.toJSON()),
                    visitorCount,
                });
                fs.writeFileSync(path.join(this.reportsDir, filename), html, 'utf-8');
                break;
            case 'pdf':
                filename = `visitor-report-${reportNumber}.pdf`;
                const pdfHtml = this.buildReportHtml({
                    title: 'Visitor Check-In Report',
                    generatedAt: new Date().toLocaleString(),
                    visitors: visitors.map(v => v.toJSON()),
                    visitorCount,
                });
                fs.writeFileSync(path.join(this.reportsDir, filename), pdfHtml, 'utf-8');
                break;
            default:
                filename = `visitor-report-${reportNumber}.html`;
                const defaultHtml = this.buildReportHtml({
                    title: 'Visitor Check-In Report',
                    generatedAt: new Date().toLocaleString(),
                    visitors: visitors.map(v => v.toJSON()),
                    visitorCount,
                });
                fs.writeFileSync(path.join(this.reportsDir, filename), defaultHtml, 'utf-8');
                break;
        }

        // Auto-delete visitors after report generation (soft delete with grace period)
        const firstVisitorId = visitors[0]?.id;
        const lastVisitorId = visitors[visitors.length - 1]?.id;
        
        const deletedCount = await Visitor.update(
            { deletedAt: new Date() },
            { 
                where: whereClause,
            }
        );

        // Store report in database
        const report = await db.Report.create({
            filename,
            format,
            visitorCount,
            firstVisitorId,
            lastVisitorId,
            visitorsDeleted: visitors.length,
            department: body?.department,
            downloadUrl: `/api/reports/download/${filename}`,
        });

        // Create notification for report generation
        const adminUsers = await db.User.findAll({ where: { status: 'active' } });
        for (const admin of adminUsers) {
            await db.Notification.create({
                recipientId: admin.id,
                recipientType: 'user',
                title: 'Visitor Report Generated',
                message: `Auto-report (${this.getFormatLabel(format)}) generated with ${visitorCount} visitors. File: ${filename}`,
                type: 'report_generated',
            });
        }

        return ServiceResponse.success(
            'Report generated and visitors marked for deletion',
            {
                generated: true,
                downloadUrl: `/api/reports/download/${filename}`,
                visitorCount,
                threshold: this.threshold,
                reportCount: visitors.length,
                visitorsDeleted: visitors.length,
                format,
                reportId: report.id || undefined,
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

        await this.cleanupOldReports();
        this.ensureReportsDir();

        const files = fs.readdirSync(this.reportsDir)
            .filter((f) => f.endsWith('.html') || f.endsWith('.xlsx') || f.endsWith('.csv') || f.endsWith('.pdf') || f.endsWith('.doc'))
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

    @Security('jwt', ['report:delete'])
    @Post('/auto-delete')
    @asyncCatch
    public async autoDeleteReports(
        @Body() body: { retentionDays?: number }
    ): Promise<ServiceResponse<AutoDeleteResponse>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }

        const retentionDays = body.retentionDays || 30;
        const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

        this.ensureReportsDir();
        let deleted = 0;
        const deletedFiles: string[] = [];
        const now = Date.now();

        try {
            const files = fs.readdirSync(this.reportsDir);
            for (const file of files) {
                const filePath = path.join(this.reportsDir, file);
                try {
                    const stat = fs.statSync(filePath);
                    if (now - stat.mtimeMs > retentionMs) {
                        fs.unlinkSync(filePath);
                        deleted++;
                        deletedFiles.push(file);
                    }
                } catch {
                    // skip
                }
            }
        } catch {
            // skip
        }

        // Also delete from database
        const cutoffDate = new Date(now - retentionMs);
        await db.Report.destroy({
            where: {
                generatedAt: { [Op.lt]: cutoffDate }
            }
        });

        // Create notification
        await db.Notification.create({
            recipientId: user.id,
            recipientType: 'user',
            title: 'Reports Auto-Deleted',
            message: `${deleted} report(s) older than ${retentionDays} days have been deleted.`,
            type: 'general',
        });

        return ServiceResponse.success(
            'Reports deleted successfully',
            {
                success: true,
                deletedCount: deleted,
                deletedFiles,
                retentionDays,
            }
        );
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
  <div class="meta">Generated on ${this.escapeHtml(generatedAt)} • Total records: ${visitorCount}</div>
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