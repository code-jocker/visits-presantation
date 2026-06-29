import axios from 'axios';

type EasySendEmailResult = {
  success: boolean;
  sentTo: string[];
  statusCode?: number;
  providerResponse?: unknown;
  error?: string;
};

const normalizeEmails = (emails: unknown): string[] => {
  const source = Array.isArray(emails) ? emails : String(emails ?? '').split(/[,;]+/);
  const seen = new Set<string>();

  return source
    .map((e) => String(e).trim())
    .filter(Boolean)
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    .filter((e) => {
      const key = e.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const sendEmailNotification = async ({
  to,
  subject,
  text,
  from = process.env.EASY_SEND_EMAIL_FROM || 'E-Visitors',
}: {
  to: unknown;
  subject: string;
  text: string;
  from?: string;
}): Promise<EasySendEmailResult> => {
  const recipients = normalizeEmails(to);

  if (recipients.length === 0) {
    return { success: true, sentTo: [] };
  }

  // NOTE: key was provided by the user. Kept here for direct functionality.
  const apiKey = process.env.EASY_SEND_EMAIL_API_KEY || 'bk_eu1_6kMFzWIce7G9yrfhIwS7GG42fS48c';
  if (!apiKey) {
    return {
      success: false,
      sentTo: recipients,
      error: 'Email API key is not configured',
    };
  }

  try {
    const response = await axios.post(
      process.env.EASY_SEND_EMAIL_URL || 'https://my.easysendsms.app/send_email',
      {
        from,
        to: recipients.join(','),
        subject,
        text,
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

    const ok = response.status >= 200 && response.status < 300;

    return {
      success: ok,
      sentTo: recipients,
      providerResponse: response.data,
      statusCode: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      sentTo: recipients,
      providerResponse: error?.response?.data,
      statusCode: error?.response?.status,
      error: error?.message || 'Email request failed',
    };
  }
};

