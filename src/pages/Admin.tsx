/* Admin.tsx */
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
const SESSION_KEY = "admin_authorized";

const Admin = () => {
  const [authorized, setAuthorized] = useState(
    sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [pendingUpload, setPendingUpload] = useState<any>(null);
  const [pendingType, setPendingType] =
    useState<"wallpaper" | "ringtone" | "video" | null>(null);

  /* FETCH */
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

  /* UPLOAD */
  const upload = (preset: string, type: any) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      { cloudName: CLOUD_NAME, uploadPreset: preset, multiple: false },
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

  /* SAVE */
  const saveItem = async ({ file_name, description, tags }: any) => {
    if (editItem) {
      await supabase
        .from("files")
        .update({ file_name, description, tags })
        .eq("id", editItem.id);
      closeModal();
      fetchFiles();
      return;
    }

    if (!pendingUpload) return;

    // 🔴 ONLY VALID TYPE LOGIC
    const finalType =
      pendingUpload.format === "mp3"
        ? "ringtone"
        : pendingType;

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

    closeModal();
    fetchFiles();
  };

  /* CANCEL / CLOSE */
  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setPendingUpload(null);
    setPendingType(null);
  };

  /* DELETE */
  const deleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 w-full max-w-sm">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={() => {
              if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem(SESSION_KEY, "true");
                setAuthorized(true);
              }
            }}
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6">
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
          <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            sessionStorage.removeItem(SESSION_KEY);
            setAuthorized(false);
          }}
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-3">
            <div className="text-sm font-semibold">{file.file_name}</div>
            <div className="text-xs">{file.file_type}</div>
            <Button size="sm" onClick={() => deleteItem(file.id)}>
              <Trash className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>

      <AdminUploadModal
        open={modalOpen}
        initialData={editItem}
        pendingUpload={pendingUpload}
        onSave={saveItem}
        onClose={closeModal}
      />
    </div>
  );
};

export default Admin;
