import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS;
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES;
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS;

const Admin = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  const fetchFiles = async () => {
    const { data } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });
    setFiles(data || []);
  };

  useEffect(() => {
    if (authorized) fetchFiles();
  }, [authorized]);

  const upload = (preset: string, fileType: "wallpaper" | "ringtone" | "video") => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false
      },
      async (_: any, result: any) => {
        if (result?.event === "success") {
          const info = result.info;

          await supabase.from("files").insert({
            file_name: info.original_filename,
            file_url: info.secure_url,
            public_id: info.public_id,
            file_type: fileType // ✅ FORCE TYPE
          });

          fetchFiles();
        }
      }
    );
    widget.open();
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 w-full max-w-sm">
          <input
            type="password"
            className="w-full mb-4 p-2 rounded"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={() =>
              password === ADMIN_PASSWORD
                ? setAuthorized(true)
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
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex gap-3 mb-6">
        <Button onClick={() => upload(PRESET_WALLPAPERS, "wallpaper")}>
          Upload Wallpaper
        </Button>
        <Button onClick={() => upload(PRESET_RINGTONES, "ringtone")}>
          Upload Ringtone
        </Button>
        <Button onClick={() => upload(PRESET_VIDEOS, "video")}>
          Upload Video
        </Button>
        <Button variant="outline" onClick={fetchFiles}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4 flex justify-between">
            <div>
              <div className="font-semibold">{file.file_name}</div>
              <div className="text-xs text-muted-foreground">
                {file.file_type}
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() =>
                supabase.from("files").delete().eq("id", file.id).then(fetchFiles)
              }
            >
              <Trash />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;
