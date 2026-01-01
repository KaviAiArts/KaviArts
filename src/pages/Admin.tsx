import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash, Edit, RefreshCcw, LogOut, Loader2, UploadCloud } from "lucide-react";
import AdminUploadModal from "@/components/AdminUploadModal";
import { toast } from "sonner"; // Assuming you use Sonner, or use alert()

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET_WALLPAPERS = import.meta.env.VITE_CLOUDINARY_PRESET_WALLPAPERS;
const PRESET_RINGTONES = import.meta.env.VITE_CLOUDINARY_PRESET_RINGTONES;
const PRESET_VIDEOS = import.meta.env.VITE_CLOUDINARY_PRESET_VIDEOS;

const Admin = () => {
  // 1. Auth State (Supabase)
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 2. Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // 3. Data State
  const [files, setFiles] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [pendingUpload, setPendingUpload] = useState<any>(null);
  const [pendingType, setPendingType] = useState<"wallpaper" | "ringtone" | "video" | null>(null);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ---------------- FETCH DATA ---------------- */
  const fetchFiles = async () => {
    const { data } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });
    setFiles(data || []);
  };

  useEffect(() => {
    if (session) fetchFiles();
  }, [session]);

  /* ---------------- LOGIN ACTIONS ---------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        alert("Login failed: " + error.message);
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => await supabase.auth.signOut();

  /* ---------------- UPLOAD (NEW ITEM) ---------------- */
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

  /* ---------------- REPLACE FILE (NEW LOGIC) ---------------- */
  const replaceFile = (item: any) => {
    // Select correct preset
    let preset = PRESET_WALLPAPERS;
    if (item.file_type === "ringtone") preset = PRESET_RINGTONES;
    if (item.file_type === "video") preset = PRESET_VIDEOS;

    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: preset,
        multiple: false,
        resourceType: "auto",
      },
      async (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const info = result.info;
          try {
            // Update Supabase immediately
            const { error: dbError } = await supabase
              .from("files")
              .update({
                file_url: info.secure_url,
                public_id: info.public_id,
                width: info.width ?? null,
                height: info.height ?? null,
                format: info.format ?? null,
                duration: info.duration ?? null,
              })
              .eq("id", item.id);

            if (dbError) throw dbError;
            alert("File replaced successfully!");
            fetchFiles();
          } catch (err: any) {
            console.error(err);
            alert("Error replacing file: " + err.message);
          }
        }
      }
    );
    widget.open();
  };

  /* ---------------- SAVE (YOUR ORIGINAL LOGIC RESTORED) ---------------- */
  const saveItem = async ({ file_name, description, tags }: any) => {
    try {
      // CASE 1: Editing an existing item text
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

      // Your Logic: Determine correct type (Fixing Ringtone/Video issue)
      const isAudio =
        pendingType === "ringtone" ||
        pendingUpload.format === "mp3" ||
        pendingUpload.is_audio === true ||
        pendingUpload.audio_codec;

      const finalType = isAudio ? "ringtone" : pendingType;

      // Your Logic: Smart Save (Check Webhook)
      const { data: existing } = await supabase
        .from("files")
        .select("id")
        .eq("public_id", pendingUpload.public_id)
        .maybeSingle();

      if (existing) {
        // UPDATE existing record
        const { error } = await supabase
          .from("files")
          .update({
            file_name,
            description,
            tags,
            file_type: finalType,
            category: finalType,
            width: pendingUpload.width ?? null,
            height: pendingUpload.height ?? null,
            format: pendingUpload.format ?? null,
            duration: pendingUpload.duration ?? null,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // INSERT new record
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

  /* ---------------- CANCEL / DELETE ---------------- */
  const handleCancelUpload = async () => {
    if (pendingUpload?.public_id) {
      await supabase.from("files").delete().eq("public_id", pendingUpload.public_id);
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

  const deleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };

  /* ---------------- UI RENDER ---------------- */
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 w-full max-w-sm shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button className="w-full" type="submit" disabled={loginLoading}>
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // DASHBOARD SCREEN
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
                title="Edit Text"
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              {/* ⭐ NEW: Replace File Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => replaceFile(file)}
                title="Replace File"
              >
                <UploadCloud className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteItem(file.id)}
                title="Delete"
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
        onCancel={handleCancelUpload}
      />
    </div>
  );
};

export default Admin;