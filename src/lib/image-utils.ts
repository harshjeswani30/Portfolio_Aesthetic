/**
 * Converts a Google Drive sharing URL to a direct image URL that can be used in <img> tags
 * 
 * Examples:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID (already direct)
 * 
 * Returns: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function convertDriveUrlToDirectImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }

  const trimmedUrl = url.trim();

  // If it's already a direct Google Drive image URL, return as is
  if (trimmedUrl.includes('drive.google.com/uc?') && trimmedUrl.includes('export=view')) {
    return trimmedUrl;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch1 = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch1) {
    fileId = fileIdMatch1[1];
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const openIdMatch = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openIdMatch) {
      fileId = openIdMatch[1];
    }
  }

  // Format 3: https://drive.google.com/uc?id=FILE_ID (already in direct format, but missing export=view)
  if (!fileId) {
    const ucIdMatch = trimmedUrl.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
    if (ucIdMatch) {
      fileId = ucIdMatch[1];
    }
  }

  // If we found a file ID, convert to direct image URL
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // If no file ID found, return original URL (might be a regular image URL)
  return trimmedUrl;
}

/**
 * Checks if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('drive.google.com');
}


