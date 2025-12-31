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
 * For downloading: Forces the "fl_attachment" flag and removes any 
 * resizing/cropping parameters so the user gets the original 4K file.
 */
export const getOriginalDownloadUrl = (url: string) => {
  if (!url || !url.includes("cloudinary")) return url;
  
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;

  const baseUrl = parts[0];
  const filePart = parts[1];
  
  // Regex to remove existing transformations (like w_500) before the version number (v123...)
  const cleanFilePart = filePart.replace(/^(?:[^/]+\/)*v/, "v"); 

  return `${baseUrl}/upload/fl_attachment/${cleanFilePart}`;
};