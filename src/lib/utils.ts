import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- NEW CLOUDINARY HELPERS ---

/**
 * For viewing: Adds q_auto,f_auto,w_{width} to make images fast.
 * Default width 800px is good for most screens.
 */
export const getOptimizedDisplayUrl = (url: string, width = 800) => {
  if (!url || !url.includes("cloudinary")) return url;
  // If it's already a video, don't mess with it here, or handle separately if needed
  if (url.includes("/video/upload/")) return url;
  
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
};

/**
 * For downloading: Forces the "fl_attachment" flag and lets you rename the file.
 * We sanitize the name to ensure the URL doesn't break.
 */
export const getOriginalDownloadUrl = (url: string, customName?: string) => {
  if (!url || !url.includes("cloudinary")) return url;
  
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;

  const baseUrl = parts[0];
  const filePart = parts[1];
  
  // Regex to remove existing transformations (like w_500) before the version number (v123...)
  const cleanFilePart = filePart.replace(/^(?:[^/]+\/)*v/, "v"); 

  // ✅ FIX: If customName exists, tell Cloudinary to rename the download
  let attachmentFlag = "fl_attachment";
  if (customName) {
    // Replace spaces with underscores and remove special chars
    const safeName = customName.replace(/[^a-zA-Z0-9-_]/g, "_");
    attachmentFlag = `fl_attachment:${safeName}`;
  }

  return `${baseUrl}/upload/${attachmentFlag}/${cleanFilePart}`;
};