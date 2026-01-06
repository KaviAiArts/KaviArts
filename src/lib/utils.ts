import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CLOUDINARY HELPERS ---

export const getOptimizedDisplayUrl = (url: string, width = 800) => {
  if (!url || !url.includes("cloudinary")) return url;
  if (url.includes("/video/upload/")) return url;
  
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
};

export const getOriginalDownloadUrl = (url: string, customName?: string) => {
  if (!url || !url.includes("cloudinary")) return url;
  
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;

  const baseUrl = parts[0];
  const filePart = parts[1];
  
  // Clean existing transformations
  const cleanFilePart = filePart.replace(/^(?:[^/]+\/)*v/, "v"); 

  let attachmentFlag = "fl_attachment";
  
  if (customName) {
    // 1. Get the extension
    const urlParts = url.split("?")[0].split(".");
    const extension = urlParts.length > 1 ? urlParts.pop() : "";

    // 2. Clean base name (remove extension if user added it)
    let baseName = customName;
    if (extension && customName.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
       baseName = customName.slice(0, -(extension.length + 1));
    }

    // 3. Strict Sanitization (No special chars to prevent 400 Errors)
    const safeName = baseName.replace(/[^a-zA-Z0-9]/g, "-");
    
    const finalFilename = extension ? `${safeName}.${extension}` : safeName;
    attachmentFlag = `fl_attachment:${finalFilename}`;
  }

  return `${baseUrl}/upload/${attachmentFlag}/${cleanFilePart}`;
};