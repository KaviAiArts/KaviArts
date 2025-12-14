import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash, Music, Play } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS;
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES;
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS;

const Admin = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [uploadType, setUploadType] =
    useState<"wallpaper" | "ringtone" | "video">("wallpaper");

  const fetchFiles = async () => {
    const { data } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });
    setFiles(data || []);
  };

  useEffect(() => {
    if (auth) fetchFiles();
  }, [auth]);

  const openUpload = (preset: string, type: any) => {
    setUploadType(type);

    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
      },
      async (_: any, result: any) => {
        if (result?.event === "success") {
          await supabase.from("files").insert({
            file_name: result.info.original_filename,
            file_url: result.info.secure_url,
            file_type: type, // 🔥 FORCE CORRECT TYPE
          });
          fetchFiles();
        }
      }
    );
    widget.open();
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 w-80">
          <input
            type="password"
            className="w-full p-2 rounded bg-muted"
            placeholder="Admin password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <Button className="w-full mt-4" onClick={() => pass === ADMIN_PASSWORD && setAuth(true)}>
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex gap-2 mb-4">
        <Button onClick={() => openUpload(PRESET_WALLPAPERS, "wallpaper")}>
          Upload Wallpaper
        </Button>
        <Button onClick={() => openUpload(PRESET_RINGTONES, "ringtone")}>
          Upload Ringtone
        </Button>
        <Button onClick={() => openUpload(PRESET_VIDEOS, "video")}>
          Upload Video
        </Button>
        <Button variant="outline" onClick={fetchFiles}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {files.map((f) => (
          <Card key={f.id} className="p-4 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-muted rounded">
                {f.file_type === "ringtone" ? (
                  <Music />
                ) : f.file_type === "video" ? (
                  <Play />
                ) : (
                  <img src={f.file_url} className="w-full h-full object-cover rounded" />
                )}
              </div>
              <div>
                <div className="font-semibold">{f.file_name}</div>
                <div className="text-xs text-muted-foreground">{f.file_type}</div>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => supabase.from("files").delete().eq("id", f.id)}
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
