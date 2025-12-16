import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash, Edit, RefreshCcw, LogOut, Upload } from "lucide-react";
import AdminUploadModal from "@/components/AdminUploadModal";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS;
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES;
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS;

const Admin = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [pendingUpload, setPendingUpload] = useState<any>(null);
  const [pendingType, setPendingType] =
    useState<"wallpaper" | "ringtone" | "video" | null>(null);

  /* ---------------- FETCH ---------------- */

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

  /* ---------------- CLOUDINARY ---------------- */

  const upload = (preset: string, type: any) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
      },
      (_: any, result: any) => {
        if (result?.event === "success") {
          setPendingUpload(result.info);
          setPendingType(type);
          setEditItem(null);
          setModalOpen(true);
        }
      }
    );

    widget.open();
  };

  /* ---------------- CSV UPLOAD ---------------- */

  const handleCSVUpload = async (file: File) => {
    const text = await file.text();
    const rows = text.split("\n").slice(1);

    for (const row of rows) {
      if (!row.trim()) continue;
      const [file_name, tags, description, category] = row.split(",");

      await supabase.from("files").insert({
        file_name: file_name?.trim(),
        tags: tags
          ?.split("|")
          .map((t) => t.trim().toLowerCase()),
        description: description?.trim(),
        category: category?.trim(),
        file_type: category?.trim(),
        downloads: 0,
      });
    }

    fetchFiles();
    alert("CSV upload completed");
  };

  /* ---------------- SAVE ---------------- */

  const saveItem = async ({ file_name, description, tags }: any) => {
    if (editItem) {
      await supabase
        .from("files")
        .update({ file_name, description, tags })
        .eq("id", editItem.id);

      setModalOpen(false);
      setEditItem(null);
      fetchFiles();
      return;
    }

    if (!pendingUpload || !pendingType) return;

    const isMp3 = pendingUpload.format === "mp3";
    const finalType = isMp3 ? "ringtone" : pendingType;

    await supabase.from("files").insert({
      file_name,
      description,
      tags,
      file_url: pendingUpload.secure_url,
      public_id: pendingUpload.public_id,
      file_type: finalType,
      category: finalType,
      downloads: 0,
      width: pendingUpload.width ?? null,
      height: pendingUpload.height ?? null,
      format: pendingUpload.format ?? null,
      duration: pendingUpload.duration ?? null,
    });

    setModalOpen(false);
    setPendingUpload(null);
    setPendingType(null);
    fetchFiles();
  };

  /* ---------------- AUTH ---------------- */

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            className="w-full mb-4 p-2 rounded bg-secondary"
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

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => upload(PRESET_WALLPAPERS, "wallpaper")}>
          Upload Wallpaper
        </Button>
        <Button onClick={() => upload(PRESET_RINGTONES, "ringtone")}>
          Upload Ringtone
        </Button>
        <Button onClick={() => upload(PRESET_VIDEOS, "video")}>
          Upload Video
        </Button>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={(e) =>
              e.target.files && handleCSVUpload(e.target.files[0])
            }
          />
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
        </label>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-3 space-y-2">
            <div className="font-semibold text-sm truncate">
              {file.file_name}
            </div>
            <div className="text-xs text-muted-foreground">
              {file.file_type} • {file.downloads || 0}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditItem(file);
                  setModalOpen(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  await supabase.from("files").delete().eq("id", file.id);
                  fetchFiles();
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AdminUploadModal
        open={modalOpen}
        initialData={editItem}
        onSave={saveItem}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
      />
    </div>
  );
};

export default Admin;
