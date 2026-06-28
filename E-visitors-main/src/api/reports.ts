import { client } from './clients';

export type ReportFormat = 'excel' | 'excel_v2' | 'word' | 'pdf' | 'html' | 'csv';

export interface AutoReportResponse {
    generated: boolean;
    reason?: string;
    downloadUrl?: string;
    reportCount?: number;
    visitorCount?: number;
    threshold?: number;
    visitorsDeleted?: number;
    format?: ReportFormat;
    reportId?: number;
}

export interface AutoDeleteResponse {
    success: boolean;
    deletedCount: number;
    deletedFiles: string[];
    retentionDays: number;
}

export const reportsApi = {
    autoGenerate: async (body?: { department?: string; format?: ReportFormat; force?: boolean }): Promise<{
        success: boolean;
        message: string;
        result: AutoReportResponse;
    }> => {
        const { data } = await client.post('/reports/auto', body);
        return data;
    },

    list: async (): Promise<{
        success: boolean;
        message: string;
        result: { files: { name: string; size: number; createdAt: string }[] };
    }> => {
        const { data } = await client.get('/reports/list');
        return data;
    },

    download: async (filename: string): Promise<string> => {
        const { data } = await client.get(`/reports/download/${filename}`);
        return data;
    },

    autoDelete: async (retentionDays: number): Promise<{
        success: boolean;
        message: string;
        result: AutoDeleteResponse;
    }> => {
        const { data } = await client.post('/reports/auto-delete', { retentionDays });
        return data;
    },

    getRetention: async (): Promise<{
        success: boolean;
        message: string;
        result: { retentionDays: number };
    }> => {
        const { data } = await client.get('/reports/retention');
        return data;
    },

    setRetention: async (retentionDays: number): Promise<{
        success: boolean;
        message: string;
        result: { retentionDays: number };
    }> => {
        const { data } = await client.post('/reports/retention', { retentionDays });
        return data;
    },
};