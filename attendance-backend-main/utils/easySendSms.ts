import axios from 'axios';
import { normalizeVisitorMobile } from './visitorNormalization';

type EasySendSmsResult = {
  success: boolean;
  sentTo: string[];
  providerResponse?: unknown;
  statusCode?: number;
  error?: string;
};

const normalizePhoneNumbers = (numbers: unknown): string[] => {
  const source = Array.isArray(numbers) ? numbers : String(numbers ?? '').split(/[,;]+/).map(item => item.trim()).filter(Boolean);
  const seen = new Set<string>();

  return source.reduce<string[]>((result, item) => {
    const normalized = normalizeVisitorMobile(typeof item === 'string' ? item : String(item));
    if (!normalized || seen.has(normalized)) return result;

    seen.add(normalized);
    return [...result, normalized];
  }, []);
};

export const buildVisitorSmsMessage = (visitor: {
  fullName?: string;
  department?: string;
  hostName?: string;
  purpose?: string;
}) => {
  const name = visitor.fullName?.trim() || 'there';
  const details = [
    visitor.department ? `Department: ${visitor.department}.` : null,
    visitor.hostName ? `Host: ${visitor.hostName}.` : null,
    visitor.purpose ? `Purpose: ${visitor.purpose}.` : null,
  ].filter(Boolean);

  return `Hello ${name}, your visit has been recorded.${details.length ? ` ${details.join(' ')}` : ''} Thank you for visiting.`;
};

export const sendEasySendSms = async ({
  numbers,
  message,
  sender = process.env.EASY_SEND_SMS_SENDER || 'E-Visitors',
  type = '0',
}: {
  numbers: unknown;
  message: string;
  sender?: string;
  type?: '0' | '1';
}): Promise<EasySendSmsResult> => {
  const normalizedNumbers = normalizePhoneNumbers(numbers);

  if (normalizedNumbers.length === 0) {
    return { success: true, sentTo: [] };
  }

  const apiKey = process.env.EASY_SEND_SMS_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      sentTo: [],
      error: 'EasySendSMS API key is not configured',
    };
  }

  try {
    const response = await axios.post(
      process.env.EASY_SEND_SMS_URL || 'https://my.easysendsms.app/send_sms',
      {
        from: sender,
        to: normalizedNumbers.join(','),
        text: message,
        type,
      },
      {
        headers: {
          apikey: apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 15000,
      }
    );

    return {
      success: response.status >= 200 && response.status < 300,
      sentTo: normalizedNumbers,
      providerResponse: response.data,
      statusCode: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      sentTo: normalizedNumbers,
      providerResponse: error?.response?.data,
      statusCode: error?.response?.status,
      error: error?.message || 'EasySendSMS request failed',
    };
  }
};
