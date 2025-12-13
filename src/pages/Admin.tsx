// src/pages/Admin.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash, Edit, Check, X, Music, Play } from "lucide-react";

type FileRow = {
  id: number;
  file_name: string;
  file_type: "wallpaper" | "ringtone" | "video";
  file_url: string;
  category?: string | null;
  tags?: string[] | null;
  created_at?: string;
};

// ENV
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS;
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES;
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS;

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");

  const [activeTab, setActiveTab] =
    useState<"all" | "wallpaper" | "ringtone" | "video">("all");

  /* ---------------- AUTH ---------------- */
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <Input
            type="password"
            placeholder="Admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button
            className="mt-4 w-full"
            onClick={() => {
              if (passwordInput === ADMIN_PASSWORD) setIsAuthorized(true);
              else alert("Wrong password");
            }}
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  /* ---------------- FETCH ---------------- */
  const fetchFiles = async () => {
    setLoading(true);

    let query = supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });

    if (activeTab !== "all") {
      query = query.eq("file_type", activeTab);
    }

    const { data } = await query;
    setFiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [activeTab]);

  /* ---------------- CLOUDINARY UPLOAD ---------------- */
  const openCloudinaryWidget = (preset: string, type: FileRow["file_type"]) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
      },
      async (_: any, result: any) => {
        if (result?.event === "success") {
          await supabase.from("files").update({
            file_type: type,
          }).eq("id", result.info?.id);

          setTimeout(fetchFiles, 1000);
        }
      }
    );

    widget.open();
  };

  /* ---------------- EDIT ---------------- */
  const startEdit = (row: FileRow) => {
    setEditingId(row.id);
    setEditTitle(row.file_name);
    setEditTags((row.tags || []).join(", "));
  };

  const saveEdit = async (id: number) => {
    await supabase
      .from("files")
      .update({
        file_name: editTitle,
        tags: editTags.split(",").map(t => t.trim()).filter(Boolean),
      })
      .eq("id", id);

    setEditingId(null);
    fetchFiles();
  };

  const deleteRow = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };

  const renderPreview = (row: FileRow) => {
    if (row.file_type === "ringtone") {
      return (
        <div className="w-24 h-36 flex items-center justify-center bg-muted rounded">
          <Music className="w-10 h-10 text-primary" />
        </div>
      );
    }

    if (row.file_type === "video") {
      return (
        <div className="relative w-24 h-36 rounded overflow-hidden">
          <video src={row.file_url} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      );
    }

    return (
      <img
        src={row.file_url}
        className="w-24 h-36 object-cover rounded"
      />
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-2">
          <Button onClick={() => openCloudinaryWidget(PRESET_WALLPAPERS, "wallpaper")}>
            Upload Wallpaper
          </Button>
          <Button onClick={() => openCloudinaryWidget(PRESET_RINGTONES, "ringtone")}>
            Upload Ringtone
          </Button>
          <Button onClick={() => openCloudinaryWidget(PRESET_VIDEOS, "video")}>
            Upload Video
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        {["all", "wallpaper", "ringtone", "video"].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.toUpperCase()}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {files.map(row => (
            <Card key={row.id} className="p-4 flex justify-between">
              <div className="flex gap-4">
                {renderPreview(row)}
                <div>
                  <div className="font-semibold">{row.file_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {row.file_type}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {editingId === row.id ? (
                  <>
                    <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <Input value={editTags} onChange={e => setEditTags(e.target.value)} />
                    <Button onClick={() => saveEdit(row.id)}><Check /></Button>
                    <Button onClick={() => setEditingId(null)}><X /></Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => startEdit(row)}><Edit /></Button>
                    <Button variant="destructive" onClick={() => deleteRow(row.id)}><Trash /></Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
