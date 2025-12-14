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
  tags?: string[] | null;
  description?: string | null;
};

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

  const resolveFileType = (info: any) => {
    if (["mp3", "wav", "m4a"].includes(info.format)) return "ringtone";
    if (info.resource_type === "video") return "video";
    return "wallpaper";
  };

  const fetchFiles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setFiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthorized) fetchFiles();
  }, [isAuthorized]);

  const openCloudinaryWidget = (preset: string) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
        sources: ["local"],
      },
      async (_: any, result: any) => {
        if (result?.event === "success") {
          const info = result.info;

          await supabase.from("files").insert({
            file_name: info.original_filename,
            file_url: info.secure_url,
            file_type: resolveFileType(info),
            tags: [],
          });

          fetchFiles();
        }
      }
    );

    widget.open();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <Input
            type="password"
            placeholder="Admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button
            className="mt-4 w-full"
            onClick={() =>
              passwordInput === ADMIN_PASSWORD
                ? setIsAuthorized(true)
                : alert("Wrong password")
            }
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button onClick={() => openCloudinaryWidget(PRESET_WALLPAPERS)}>
          Upload Wallpaper
        </Button>
        <Button onClick={() => openCloudinaryWidget(PRESET_RINGTONES)}>
          Upload Ringtone
        </Button>
        <Button onClick={() => openCloudinaryWidget(PRESET_VIDEOS)}>
          Upload Video
        </Button>
        <Button variant="outline" onClick={fetchFiles}>
          Refresh
        </Button>
        <Button variant="ghost" onClick={() => setIsAuthorized(false)}>
          Logout
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {files.map((row) => (
            <Card key={row.id} className="p-4 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 bg-muted rounded flex items-center justify-center overflow-hidden">
                  {row.file_type === "ringtone" && <Music className="w-10 h-10" />}
                  {row.file_type === "video" && <Play className="w-10 h-10" />}
                  {row.file_type === "wallpaper" && (
                    <img src={row.file_url} className="w-full h-full object-cover" />
                  )}
                </div>

                <div>
                  <div className="font-semibold">{row.file_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Type: {row.file_type}
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={async () => {
                  if (confirm("Delete this item?")) {
                    await supabase.from("files").delete().eq("id", row.id);
                    fetchFiles();
                  }
                }}
              >
                <Trash />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
