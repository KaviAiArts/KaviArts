import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CLOUDINARY HELPERS ---

/**
 * For viewing: Adds q_auto,f_auto,w_{width} to make images fast.
 */
export const getOptimizedDisplayUrl = (url: string, width = 800) => {
  if (!url || !url.includes("cloudinary")) return url;
  if (url.includes("/video/upload/")) return url; 
  
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
};

/**
 * For downloading: Forces "fl_attachment" and PRESERVES the correct file extension.
 */
export const getOriginalDownloadUrl = (url: string, customName?: string) => {
  if (!url || !url.includes("cloudinary")) return url;
  
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;

  const baseUrl = parts[0];
  const filePart = parts[1];
  
  // Clean existing transformations (remove w_500, etc.)
  const cleanFilePart = filePart.replace(/^(?:[^/]+\/)*v/, "v"); 

  let attachmentFlag = "fl_attachment";
  
  if (customName) {
    // 1. Extract the REAL extension from the URL (e.g. "jpg", "mp3")
    const urlParts = url.split("?")[0].split(".");
    const extension = urlParts.length > 1 ? urlParts.pop() : "";

    // 2. Remove extension from customName if user typed it (avoids "image.jpg.jpg")
    let baseName = customName;
    if (extension && customName.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
       baseName = customName.slice(0, -(extension.length + 1));
    }

    // 3. Sanitize the name (Replace bad chars with _, keep letters/numbers)
    const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
    
    // 4. Construct final filename with extension
    const finalFilename = extension ? `${safeName}.${extension}` : safeName;

    attachmentFlag = `fl_attachment:${finalFilename}`;
  }

  return `${baseUrl}/upload/${attachmentFlag}/${cleanFilePart}`;
};