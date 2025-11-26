import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash, Edit, Check, X } from "lucide-react";

/**
 * Admin page (password protected via simple passcode popup)
 *
 * Requirements:
 *  - Cloudinary widget script added to index.html
 *  - VITE_CLOUDINARY_* and VITE_ADMIN_PASSWORD env vars set
 *  - Supabase client already configured in lib/supabaseClient
 *
 * Where to paste: src/pages/Admin.tsx
 */

type FileRow = {
  id: number;
  file_name: string;
  file_type: string;
  file_url: string;
  public_id?: string;
  category?: string | null;
  tags?: string[] | null;
  downloads?: number;
  likes?: number;
  views?: number;
  created_at?: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  duration?: string | null;
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Agnes@1903";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dbrhsfdle";
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS || "kaviarts_wallpapers";
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES || "kaviarts_ringtones";
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS || "kaviarts_videos";

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState("");

  useEffect(() => {
    if (isAuthorized) {
      fetchFiles();
    }
  }, [isAuthorized]);

  const checkPassword = () => {
    if (!ADMIN_PASSWORD) {
      alert("Admin password is not configured (VITE_ADMIN_PASSWORD). Set env var and redeploy.");
      return;
    }
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password");
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Fetch files error:", error);
      setFiles([]);
    } else {
      setFiles((data as any) || []);
    }
    setLoading(false);
  };

  // Open Cloudinary widget with the given preset and folder
  const openCloudinaryWidget = (preset: string, folder: string) => {
    if (!window || !(window as any).cloudinary) {
      alert("Cloudinary widget script not loaded. Add widget script to index.html");
      return;
    }
    const cloudName = CLOUD_NAME;
    if (!cloudName) {
      alert("VITE_CLOUDINARY_CLOUD_NAME is not set");
      return;
    }

    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset: preset,
        sources: ["local", "url", "drive", "google_drive"],
        multiple: false,
        folder, // this instructs Cloudinary to place file in folder
        showCompletedButton: true,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "mp3", "wav", "m4a"],
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Widget error:", error);
        }
        // When upload is done, refetch DB to show new item
        if (result && result.event === "success") {
          // At this point, Cloudinary will eventually webhook to Supabase and create the DB row
          // but we still refetch to show the new content as soon as it appears in DB
          setTimeout(() => fetchFiles(), 800);
        }
      }
    );

    widget.open();
  };

  const startEdit = (row: FileRow) => {
    setEditingId(row.id);
    setEditTitle(row.file_name);
    setEditCategory(row.category || "");
    setEditTags((row.tags || []).join(","));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditCategory("");
    setEditTags("");
  };

  const saveEdit = async (id: number) => {
    const tagsArray = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("files")
      .update({
        file_name: editTitle,
        category: editCategory,
        tags: tagsArray,
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update: " + error.message);
      console.error(error);
    } else {
      cancelEdit();
      fetchFiles();
    }
  };

  const deleteRow = async (id: number, public_id?: string) => {
    if (!confirm("Delete this entry from database? (This will not delete the actual Cloudinary asset)")) return;

    const { error } = await supabase.from("files").delete().eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      // Optionally call edge function to delete Cloudinary asset (not included here)
      fetchFiles();
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <div className="mb-3">
            <Input
              placeholder="Enter admin password"
              value={passwordInput}
              onChange={(e: any) => setPasswordInput(e.target.value)}
              type="password"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={checkPassword}>Enter</Button>
            <Button variant="ghost" onClick={() => (setPasswordInput(""), setIsAuthorized(false))}>
              Cancel
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This admin route is protected by a simple password. For stronger security use Supabase Auth.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => openCloudinaryWidget(PRESET_WALLPAPERS, "wallpapers")}>Upload Wallpaper</Button>
          <Button onClick={() => openCloudinaryWidget(PRESET_RINGTONES, "ringtones")}>Upload Ringtone</Button>
          <Button onClick={() => openCloudinaryWidget(PRESET_VIDEOS, "videos")}>Upload Video</Button>
          <Button variant="ghost" onClick={() => { setIsAuthorized(false); setPasswordInput(""); }}>
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Button onClick={fetchFiles}>Refresh List</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {files.length === 0 ? (
            <p className="text-muted-foreground">No files found. Upload using the buttons above.</p>
          ) : (
            files.map((row) => (
              <Card key={row.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-28 h-44 overflow-hidden rounded-md bg-muted">
                    {row.file_type === "ringtone" ? (
                      <div className="flex items-center justify-center h-full">🎵</div>
                    ) : (
                      <img src={row.file_url} alt={row.file_name} className="object-cover w-full h-full" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-semibold">{row.file_name}</div>
                    <div className="text-xs text-muted-foreground">Type: {row.file_type} • Category: {row.category || "—"}</div>
                    <div className="text-xs text-muted-foreground">Format: {row.format || "—"} • Size: {row.width || "—"}x{row.height || "—"}</div>
                    <div className="text-xs text-muted-foreground">Likes: {row.likes || 0} • Views: {row.views || 0} • Downloads: {row.downloads || 0}</div>
                    <div className="text-xs text-muted-foreground">Tags: {(row.tags || []).join(", ")}</div>
                    <div className="text-xs text-muted-foreground">Added: {row.created_at ? new Date(row.created_at).toLocaleString() : "—"}</div>
                  </div>
                </div>

                <div className="mt-3 md:mt-0 flex items-center gap-2">
                  {editingId === row.id ? (
                    <>
                      <div className="flex flex-col gap-1 mr-2">
                        <Input value={editTitle} onChange={(e: any) => setEditTitle(e.target.value)} />
                        <Input value={editCategory} onChange={(e: any) => setEditCategory(e.target.value)} placeholder="category" />
                        <Input value={editTags} onChange={(e: any) => setEditTags(e.target.value)} placeholder="comma,separated,tags" />
                      </div>
                      <Button variant="ghost" onClick={() => saveEdit(row.id as number)}><Check /></Button>
                      <Button variant="ghost" onClick={cancelEdit}><X /></Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => startEdit(row)}><Edit /></Button>
                      <Button variant="destructive" onClick={() => deleteRow(row.id as number, row.public_id)}><Trash /></Button>
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
