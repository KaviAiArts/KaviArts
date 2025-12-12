import Fuse from "fuse.js";
import { supabase } from "@/lib/supabaseClient";

let cachedFiles: any[] | null = null;

async function loadFiles() {
  if (cachedFiles) return cachedFiles;

  const { data, error } = await supabase
    .from("files")
    .select("id, file_name, category, tags");

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
    threshold: 0.45,
    keys: [
      { name: "file_name", weight: 0.6 },
      { name: "tags", weight: 0.25 },
      { name: "category", weight: 0.15 },
    ],
  });

  const results = fuse.search(query);
  return results.slice(0, 20).map((r) => r.item);
}
