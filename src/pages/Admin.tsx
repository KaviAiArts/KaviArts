import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash, Edit, LogOut, Loader2, UploadCloud } from "lucide-react";
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
  const [search, setSearch] = useState("");
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

const handleLogout = async () => {
  await supabase.auth.signOut({ scope: "local" });

  // Clear all local state
  setSession(null);
  setEmail("");
  setPassword("");
  setFiles([]);
  setSearch("");
  setEditItem(null);
  setPendingUpload(null);
  setPendingType(null);

  // Optional but recommended
  window.location.reload();
};

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
  file_name,
  description,
  tags,
  file_type: finalType,
  category: finalType,
  is_published: true, // 👈 ADD
  width: pendingUpload.width ?? null,
  height: pendingUpload.height ?? null,
  format: pendingUpload.format ?? null,
  duration: pendingUpload.duration ?? null,
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
<Card className="admin-login-card p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>

<form
  onSubmit={handleLogin}
  autoComplete="off"
  className="space-y-4"
>

<Input
  type="email"
  name="admin-email"
  autoComplete="new-email"
  placeholder="Admin Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="admin-login-input"
/>

<Input
  type="password"
  name="admin-password"
  autoComplete="new-password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  className="admin-login-input"
/>

<Button
  type="submit"
  disabled={loginLoading}
  className="w-full admin-login-btn"
>
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  
// DASHBOARD SCREEN
return (
  <div className="admin-panel p-4 md:p-6 space-y-8">

    {/* ================= HEADER ================= */}
    <div className="space-y-4">

      {/* Top Row */}
      <div className="flex items-center justify-between md:grid md:grid-cols-3">

        {/* Admin Title */}
        <h1 className="text-xl md:text-2xl font-bold text-left">
          Admin
        </h1>

        {/* Desktop Search (centered only md+) */}
       <div className="hidden md:flex justify-center">
  <Input
    placeholder="Search by title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="max-w-md"
  />
</div>

        {/* Logout */}
        <div className="flex justify-end">
          <Button
  variant="outline"
  className="admin-logout-btn"
  onClick={handleLogout}
>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden">
  <Input
    placeholder="Search by title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
</div>

    {/* ================= UPLOAD SECTION ================= */}
 <div className="grid grid-cols-3 gap-4">

  <Button
    className="w-full admin-wallpaper-btn"
    onClick={() => upload(PRESET_WALLPAPERS, "wallpaper")}
  >
    Wallpaper
  </Button>

  <Button
    className="w-full admin-ringtone-btn"
    onClick={() => upload(PRESET_RINGTONES, "ringtone")}
  >
    Ringtone
  </Button>

  <Button
    className="w-full admin-video-btn"
    onClick={() => upload(PRESET_VIDEOS, "video")}
  >
    Video
  </Button>

</div>

   {/* ================= FILE GROUPING / SEARCH ================= */}
{search.trim() === "" ? (

  <FolderSection
    files={files}
    setEditItem={setEditItem}
    setModalOpen={setModalOpen}
    replaceFile={replaceFile}
    deleteItem={deleteItem}
  />

) : (

  <SearchResults
    files={files}
    search={search}
    clearSearch={() => setSearch("")}
    setEditItem={setEditItem}
    setModalOpen={setModalOpen}
    replaceFile={replaceFile}
    deleteItem={deleteItem}
  />

)}

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


const FolderSection = ({
  files,
  setEditItem,
  setModalOpen,
  replaceFile,
  deleteItem,
}: any) => {

  const [openFolders, setOpenFolders] = useState<{[key: string]: boolean}>({});
  const [activeMonthCategory, setActiveMonthCategory] = useState<{[month: string]: string}>({});

  // GROUP → month → category
  const grouped = files.reduce((acc: any, file: any) => {

    const category = file.category || file.file_type;
    const date = new Date(file.created_at);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });

    if (!acc[month]) acc[month] = {};
    if (!acc[month][category]) acc[month][category] = [];

    acc[month][category].push(file);
    return acc;

  }, {});

  const months = Object.keys(grouped);
  const categories = ["wallpaper", "ringtone", "video"];

  const toggleFolder = (category: string, month: string) => {

    const key = `${month}_${category}`;
    const isOpen = openFolders[key];

    if (isOpen) {
      // Close
      const updated = { ...openFolders };
      delete updated[key];
      setOpenFolders(updated);

      setActiveMonthCategory((prev) => {
        const copy = { ...prev };
        delete copy[month];
        return copy;
      });

      return;
    }

    // Prevent same month across categories
    if (
      activeMonthCategory[month] &&
      activeMonthCategory[month] !== category
    ) {
      return;
    }

    setOpenFolders({
      ...openFolders,
      [key]: true,
    });

    setActiveMonthCategory({
      ...activeMonthCategory,
      [month]: category,
    });
  };

  return (
    <div className="space-y-6">

      {months.map((month) => (

        <div key={month}>

          {/* ===== Month Row (Always 3 Columns) ===== */}
          <div className="grid grid-cols-3 gap-4">

            {categories.map((category) => {

              const hasData = grouped[month][category];
              const key = `${month}_${category}`;
              const isActive = openFolders[key];

              return (
                <div key={category}>
                  {hasData ? (
                    <div
                      onClick={() => toggleFolder(category, month)}
className={`admin-folder cursor-pointer p-3 rounded-lg font-semibold flex justify-between transition
                        ${isActive
                          ? "bg-primary text-white"
                          : "bg-muted hover:bg-muted/80"}
                      `}
                    >
                      <span>{month}</span>
                      <span>{isActive ? "−" : "+"}</span>
                    </div>
                  ) : (
                    <div className="p-3 opacity-0 select-none">empty</div>
                  )}
                </div>
              );
            })}

          </div>

          {/* ===== Expanded Sections (Multiple Allowed) ===== */}
          {categories.map((category) => {

            const key = `${month}_${category}`;
            const isActive = openFolders[key];

            if (!isActive) return null;

            return (
              <div key={key} className="mt-4">

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

                  {grouped[month][category].map((file: any) => (
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
                          variant="outline"
                          onClick={() => replaceFile(file)}
                        >
                          <UploadCloud className="w-4 h-4" />
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

              </div>
            );
          })}

        </div>
      ))}

    </div>
  );
};

const SearchResults = ({
  files,
  search,
  clearSearch,
  setEditItem,
  setModalOpen,
  replaceFile,
  deleteItem,
}: any) => {

  const filtered = files.filter((file: any) =>
    file.file_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div className="text-lg font-semibold">
          Found {filtered.length} result{filtered.length !== 1 && "s"} for "{search}"
        </div>

        <Button
  variant="outline"
  className="admin-logout-btn"
  onClick={clearSearch}
>
  Clear
</Button>

      </div>

      {/* Results */}
      {filtered.length === 0 ? (

        <div className="text-muted-foreground">
          No files found.
        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

          {filtered.map((file: any) => (
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
                  variant="outline"
                  onClick={() => replaceFile(file)}
                >
                  <UploadCloud className="w-4 h-4" />
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

      )}

    </div>
  );
};
export default Admin;