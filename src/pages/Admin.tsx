import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash, Edit, Music, Play } from "lucide-react";
import AdminUploadModal from "@/components/AdminUploadModal";

type FileRow = {
  id: number;
  file_name: string;
  file_type: "wallpaper" | "ringtone" | "video";
  file_url: string;
  tags?: string[];
  description?: string;
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS;
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES;
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS;

const Admin = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedType, setUploadedType] =
    useState<"wallpaper" | "ringtone" | "video">("wallpaper");

  const fetchFiles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });
    setFiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authorized) fetchFiles();
  }, [authorized]);

  const openUpload = (preset: string, type: "wallpaper" | "ringtone" | "video") => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
      },
      (_: any, result: any) => {
        if (result?.event === "success") {
          setUploadedUrl(result.info.secure_url);
          setUploadedType(type);
          setModalOpen(true);
        }
      }
    );
    widget.open();
  };

  const saveMetadata = async (data: any) => {
    await supabase.from("files").insert({
      file_url: uploadedUrl,
      file_type: uploadedType,
      ...data,
    });
    setModalOpen(false);
    fetchFiles();
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 w-80">
          <input
            type="password"
            className="w-full p-2 rounded bg-muted"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full mt-4"
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

      <div className="flex gap-2 mb-6">
        <Button onClick={() => openUpload(PRESET_WALLPAPERS, "wallpaper")}>
          Upload Wallpaper
        </Button>
        <Button onClick={() => openUpload(PRESET_RINGTONES, "ringtone")}>
          Upload Ringtone
        </Button>
        <Button onClick={() => openUpload(PRESET_VIDEOS, "video")}>
          Upload Video
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {files.map((f) => (
            <Card key={f.id} className="p-4 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-28 bg-muted flex items-center justify-center rounded">
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
                  <div className="text-xs text-muted-foreground">
                    {f.file_type}
                  </div>
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
      )}

      <AdminUploadModal
        open={modalOpen}
        fileUrl={uploadedUrl}
        fileType={uploadedType}
        onSave={saveMetadata}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Admin;
