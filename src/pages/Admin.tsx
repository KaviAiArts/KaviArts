// Admin.tsx
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
  // 1. Use localStorage so refresh doesn't logout
  const [authorized, setAuthorized] = useState(
    localStorage.getItem(SESSION_KEY) === "true"
  );
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

  /* ---------------- UPLOAD ---------------- */

  const upload = (preset: string, type: any) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
        resourceType: "auto",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Upload Info:", result.info);
          setPendingUpload(result.info);
          setPendingType(type);
          setEditItem(null);
          setModalOpen(true);
        }
      }
    );

    widget.open();
  };

  /* ---------------- SAVE ---------------- */

  const saveItem = async ({ file_name, description, tags }: any) => {
    try {
      // CASE 1: Editing an existing item (from the list)
      if (editItem) {
        const { error } = await supabase
          .from("files")
          .update({ file_name, description, tags })
          .eq("id", editItem.id);

        if (error) throw error;
        closeAndReset();
        fetchFiles();
        return;
      }

      // CASE 2: Saving a new upload
      if (!pendingUpload) {
        alert("No upload found to save.");
        return;
      }

      // Determine correct type (Fixing the Ringtone/Video issue)
      const isAudio =
        pendingType === "ringtone" ||
        pendingUpload.format === "mp3" ||
        pendingUpload.is_audio === true ||
        pendingUpload.audio_codec;

      const finalType = isAudio ? "ringtone" : pendingType;

      // Smart Save: Check if Webhook already inserted the row using public_id
      const { data: existing } = await supabase
        .from("files")
        .select("id")
        .eq("public_id", pendingUpload.public_id)
        .maybeSingle();

      if (existing) {
        // UPDATE existing record (fixes wrong type from webhook)
        const { error } = await supabase
          .from("files")
          .update({
            file_name,
            description,
            tags,
            file_type: finalType, // Force correct type
            category: finalType,
            // Update other fields just in case
            width: pendingUpload.width ?? null,
            height: pendingUpload.height ?? null,
            format: pendingUpload.format ?? null,
            duration: pendingUpload.duration ?? null,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // INSERT new record (if webhook hasn't run yet)
        const { error } = await supabase.from("files").insert({
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

        if (error) throw error;
      }

      closeAndReset();
      fetchFiles();
    } catch (err: any) {
      console.error("Save Error:", err);
      alert("Error saving: " + err.message);
    }
  };

  /* ---------------- CANCEL / CLOSE ---------------- */

  const handleCancelUpload = async () => {
    // If we have a pending upload, delete the auto-injected DB record
    if (pendingUpload?.public_id) {
      console.log("Canceling and cleaning up:", pendingUpload.public_id);
      await supabase.from("files").delete().eq("public_id", pendingUpload.public_id);
      // We also refresh to make sure it disappears from UI
      fetchFiles();
    }
    closeAndReset();
  };

  const closeAndReset = () => {
    setModalOpen(false);
    setTimeout(() => {
      setEditItem(null);
      setPendingUpload(null);
      setPendingType(null);
    }, 200);
  };

  /* ---------------- DELETE ---------------- */

  const deleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };

  /* ---------------- AUTH ---------------- */

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, "true");
      setAuthorized(true);
    } else {
      alert("Wrong password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setAuthorized(false);
    setPassword("");
  };

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
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </Card>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchFiles}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

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

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-3 space-y-2">
            <div className="font-semibold text-sm truncate">
              {file.file_name}
            </div>
            <div className="text-xs text-muted-foreground">
              {file.file_type} • {file.downloads || 0}
            </div>
            <div className="flex gap-2">
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
                onClick={() => deleteItem(file.id)}
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
        pendingUpload={pendingUpload}
        onSave={saveItem}
        onCancel={handleCancelUpload} // Hooked up the robust cancel logic
      />
    </div>
  );
};

export default Admin;