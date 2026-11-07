export const appUrl = import.meta.env.VITE_APP_URL;
export const appAPI = import.meta.env.VITE_API_URL;
export const cloudinaryName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const missing: string[] = [];
if (!appAPI) missing.push('VITE_API_URL');
if (!appUrl) missing.push('VITE_APP_URL');

if (missing.length > 0) {
  throw new Error(`Missing required frontend environment variables: ${missing.join(', ')}. Check your .env file.`);
}