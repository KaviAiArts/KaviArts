import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash, Edit, RefreshCcw, LogOut } from "lucide-react";
import AdminUploadModal from "@/components/AdminUploadModal";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const Admin = () => {
  const [authorized, setAuthorized] = useState(
    localStorage.getItem("admin-auth") === "true"
  );
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  /* FETCH FILES */
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

  /* LOGIN */
  const login = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin-auth", "true");
      setAuthorized(true);
    } else {
      alert("Wrong password");
    }
  };

  /* SAVE */
  const saveItem = async (data: any) => {
    if (editItem) {
      await supabase.from("files").update(data).eq("id", editItem.id);
    }
    setModalOpen(false);
    setEditItem(null);
    fetchFiles();
  };

  /* DELETE CONFIRM */
  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };

  /* LOGIN SCREEN */
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
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <Button className="w-full" onClick={login}>
            Login
          </Button>
        </Card>
      </div>
    );
  }

  /* DASHBOARD */
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchFiles}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("admin-auth");
              setAuthorized(false);
              setPassword("");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
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
