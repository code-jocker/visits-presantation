import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let whatsappClient: Client | null = null;
let isReady = false;
let qrCode: string | null = null;

export const closeWhatsApp = async (): Promise<void> => {
  if (whatsappClient) {
    try {
      await whatsappClient.destroy();
    } catch {
      // ignore destroy errors
    }
    whatsappClient = null;
  }
  isReady = false;
  qrCode = null;
};

export const initWhatsApp = async (): Promise<void> => {
  await closeWhatsApp();

  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  whatsappClient.on('qr', (qr) => {
    qrCode = qr;
    console.log('=== WhatsApp QR Code ===');
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code with WhatsApp on your phone to link.');
    console.log('========================');
  });

  whatsappClient.on('ready', () => {
    isReady = true;
    qrCode = null;
    console.log('WhatsApp client is ready!');
  });

  whatsappClient.on('auth_failure', (msg) => {
    console.error('WhatsApp authentication failed:', msg);
  });

  whatsappClient.on('disconnected', (reason) => {
    console.log('WhatsApp client disconnected:', reason);
    isReady = false;
  });

  await whatsappClient.initialize();
};

export const getWhatsAppClient = () => whatsappClient;

export const isWhatsAppReady = () => isReady;

export const getWhatsAppQR = () => qrCode;

export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  if (!whatsappClient || !isReady) {
    return {
      success: false,
      error: 'WhatsApp client not ready. Scan QR code first.',
    };
  }

  try {
    const chatId = `${phoneNumber.replace(/[^0-9]/g, '')}@c.us`;
    await whatsappClient.sendMessage(chatId, message);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to send WhatsApp message',
    };
  }
};

export const buildVisitorWelcomeMessage = (visitor: {
  fullName?: string;
  studentName?: string;
  className?: string;
  department?: string;
  hostName?: string;
  purpose?: string;
  badgeId?: string;
}) => {
  const name = visitor.fullName || 'Visitor';
  const studentInfo = visitor.studentName
    ? `\nStudent: ${visitor.studentName}${visitor.className ? ` (${visitor.className})` : ''}`
    : '';
  const dept = visitor.department ? `\nDepartment: ${visitor.department}` : '';
  const host = visitor.hostName ? `\nHost: ${visitor.hostName}` : '';
  const purpose = visitor.purpose ? `\nPurpose: ${visitor.purpose}` : '';
  const badge = visitor.badgeId ? `\nBadge ID: ${visitor.badgeId}` : '';

  return `👋 Welcome to E-Visitors, ${name}!${studentInfo}${dept}${host}${purpose}${badge}\n\nYour visit has been registered. Thank you!`;
};
