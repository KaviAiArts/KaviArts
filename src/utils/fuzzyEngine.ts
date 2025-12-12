// src/utils/fuzzyEngine.ts
import Fuse from "fuse.js";
import { supabase } from "@/lib/supabaseClient";

// Cache results to avoid refetching entire table repeatedly
let cachedFiles: any[] | null = null;

async function loadFiles() {
  if (cachedFiles) return cachedFiles;

  // IMPORTANT: request all fields so ContentGrid gets file_url and other metadata
  const { data, error } = await supabase
    .from("files")
    .select("*"); // ← return full rows, not just id/name/category/tags

  if (error) {
    console.error("Fuzzy fetch error:", error);
    return [];
  }

  cachedFiles = data || [];
  return cachedFiles;
}

export default async function fuzzySearch(query: string) {
  if (!query.trim()) return [];

  const files = await loadFiles();

  const fuse = new Fuse(files, {
    includeScore: true,
    threshold: 0.45, // works well for typo tolerance
    keys: [
      { name: "file_name", weight: 0.6 },
      { name: "tags", weight: 0.25 },
      { name: "category", weight: 0.15 },
    ],
  });

  const results = fuse.search(query);

  // return full items (r.item has all fields because loadFiles selected "*")
  return results.slice(0, 20).map((r) => r.item);
}
