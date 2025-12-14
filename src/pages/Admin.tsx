import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";
import AdminUploadModal from "@/components/AdminUploadModal";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS;
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES;
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS;

const Admin = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] =
    useState<"wallpaper" | "ringtone" | "video">("wallpaper");

  const fetchFiles = async () => {
    const { data } = await supabase.from("files").select("*");
    setFiles(data || []);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const upload = (preset: string, type: any) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      { cloudName: CLOUD_NAME, uploadPreset: preset },
      (_: any, result: any) => {
        if (result?.event === "success") {
          setFileUrl(result.info.secure_url);
          setFileType(type);
          setOpen(true);
        }
      }
    );
    widget.open();
  };

  const handleSave = async (data: any) => {
    await supabase.from("files").insert({
      ...data,
      file_url: fileUrl,
      file_type: fileType,
    });
    setOpen(false);
    fetchFiles();
  };

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
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4 flex justify-between">
            <div>{file.file_name}</div>
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

      <AdminUploadModal
        open={open}
        fileUrl={fileUrl}
        fileType={fileType}
        onSave={handleSave}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Admin;
