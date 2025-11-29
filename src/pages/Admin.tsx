// src/pages/Admin.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash, Edit, Check, X } from "lucide-react";

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


// ENV VARIABLES
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
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState("");


  // -------------------------
  //  FETCH FILE LIST
  // -------------------------
  useEffect(() => {
    if (isAuthorized) fetchFiles();
  }, [isAuthorized]);

  const fetchFiles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Fetch error:", error);
      setFiles([]);
    } else {
      setFiles(data || []);
    }

    setLoading(false);
  };


  // -------------------------
  //  PASSWORD CHECK
  // -------------------------
  const checkPassword = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password!");
    }
  };


  // -------------------------
  //  CLOUDINARY UPLOAD WIDGET (FIXED)
  // -------------------------
  const openCloudinaryWidget = (preset: string) => {
    if (!(window as any).cloudinary) {
      alert("Cloudinary widget script missing in index.html!");
      return;
    }

    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,

        // ONLY THESE OPTIONS — NO FOLDER
        sources: ["local", "url", "camera"],
        multiple: false,
        showCompletedButton: true
      },
      (error: any, result: any) => {
        if (error) console.error("Upload error:", error);

        if (result?.event === "success") {
          setTimeout(fetchFiles, 1000);
        }
      }
    );

    widget.open();
  };


  // -------------------------
  //  EDIT ROW
  // -------------------------
  const startEdit = (row: FileRow) => {
    setEditingId(row.id);
    setEditTitle(row.file_name);
    setEditCategory(row.category || "");
    setEditTags((row.tags || []).join(","));
  };

  const saveEdit = async (id: number) => {
    const tagsArray = editTags.split(",").map(t => t.trim()).filter(Boolean);

    const { error } = await supabase
      .from("files")
      .update({
        file_name: editTitle,
        category: editCategory,
        tags: tagsArray
      })
      .eq("id", id);

    if (error) alert(error.message);

    setEditingId(null);
    fetchFiles();
  };


  // -------------------------
  //  DELETE ROW
  // -------------------------
  const deleteRow = async (id: number) => {
    if (!confirm("Delete this item from database?")) return;

    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };


  // -------------------------
  //  LOGIN SCREEN
  // -------------------------
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

          <Input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
          />

          <div className="flex gap-2 mt-4">
            <Button onClick={checkPassword}>Enter</Button>
          </div>
        </Card>
      </div>
    );
  }


  // -------------------------
  //  MAIN ADMIN UI
  // -------------------------
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-2">
          <Button onClick={() => openCloudinaryWidget(PRESET_WALLPAPERS)}>
            Upload Wallpaper
          </Button>

          <Button onClick={() => openCloudinaryWidget(PRESET_RINGTONES)}>
            Upload Ringtone
          </Button>

          <Button onClick={() => openCloudinaryWidget(PRESET_VIDEOS)}>
            Upload Video
          </Button>

          <Button variant="ghost" onClick={() => setIsAuthorized(false)}>
            Logout
          </Button>
        </div>
      </div>


      <Button className="mb-4" onClick={fetchFiles}>
        Refresh List
      </Button>

      {/* FILE LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No files yet. Upload above.</p>
      ) : (
        <div className="grid gap-4">
          {files.map(row => (
            <Card key={row.id} className="p-4 flex flex-col md:flex-row md:justify-between">
              
              <div className="flex gap-4">
                <div className="w-28 h-44 overflow-hidden bg-muted rounded-md">
                  {row.file_type === "ringtone" ? (
                    <div className="flex justify-center items-center h-full text-4xl">🎵</div>
                  ) : (
                    <img src={row.file_url} className="w-full h-full object-cover" />
                  )}
                </div>

                <div>
                  <div className="font-semibold">{row.file_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Type: {row.file_type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tags: {(row.tags || []).join(", ")}
                  </div>
                </div>
              </div>


              {/* EDIT / DELETE */}
              <div className="flex gap-2 mt-3 md:mt-0">
                {editingId === row.id ? (
                  <>
                    <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <Input value={editCategory} onChange={e => setEditCategory(e.target.value)} />
                    <Input value={editTags} onChange={e => setEditTags(e.target.value)} />

                    <Button variant="ghost" onClick={() => saveEdit(row.id)}>
                      <Check />
                    </Button>

                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      <X />
                    </Button>
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
