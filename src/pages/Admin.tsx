import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash, Edit, RefreshCcw, LogOut } from "lucide-react";
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
  const [pendingFile, setPendingFile] = useState<any>(null);
  const [pendingType, setPendingType] = useState<
    "wallpaper" | "ringtone" | "video" | null
  >(null);

  /* ---------------- FETCH FILES ---------------- */

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

  /* ---------------- UPLOAD ---------------- */

  const upload = (
    preset: string,
    type: "wallpaper" | "ringtone" | "video"
  ) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
      },
      (_: any, result: any) => {
        if (result?.event === "success") {
          setPendingFile(result.info);
          setPendingType(type);
          setModalOpen(true);
        }
      }
    );

    widget.open();
  };

  /* ---------------- SAVE METADATA ---------------- */

  const saveDetails = async ({
    file_name,
    description,
    tags,
  }: {
    file_name: string;
    description: string;
    tags: string[];
  }) => {
    if (!pendingFile || !pendingType) return;

    await supabase.from("files").insert({
      file_name,
      description,
      tags,
      file_url: pendingFile.secure_url,
      public_id: pendingFile.public_id,
      file_type: pendingType,
      category: pendingType,
      downloads: 0,
      width: pendingFile.width ?? null,
      height: pendingFile.height ?? null,
      format: pendingFile.format ?? null,
      duration: pendingFile.duration ?? null,
    });

    setModalOpen(false);
    setPendingFile(null);
    setPendingType(null);
    fetchFiles();
  };

  /* ---------------- DELETE ---------------- */

  const deleteFile = async (id: number) => {
    await supabase.from("files").delete().eq("id", id);
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
      {/* HEADER */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchFiles}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setAuthorized(false);
              setPassword("");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* UPLOAD BUTTONS */}
      <div className="flex gap-3 mb-8">
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

      {/* FILE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4 space-y-2">
            <div className="font-semibold truncate">{file.file_name}</div>
            <div className="text-xs text-muted-foreground">
              {file.file_type} • {file.downloads || 0} downloads
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteFile(file.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      <AdminUploadModal
        open={modalOpen}
        fileUrl={pendingFile?.secure_url}
        fileType={pendingType as any}
        onSave={saveDetails}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Admin;
