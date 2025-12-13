import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash, Edit, Check, X, Music, Play, Image } from "lucide-react";

type FileRow = {
  id: number;
  file_name: string;
  file_type: "wallpaper" | "ringtone" | "video";
  file_url: string;
  tags?: string[] | null;
  description?: string | null;
  created_at?: string;
};

const ITEMS_PER_PAGE = 16;

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [activeTab, setActiveTab] =
    useState<"wallpaper" | "ringtone" | "video">("wallpaper");

  const [files, setFiles] = useState<FileRow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  /* ---------------- AUTH ---------------- */
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <Input
            type="password"
            placeholder="Admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button
            className="mt-4 w-full"
            onClick={() => {
              if (passwordInput === ADMIN_PASSWORD) setIsAuthorized(true);
              else alert("Wrong password");
            }}
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  /* ---------------- FETCH ---------------- */
  const fetchFiles = async () => {
    setLoading(true);

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data } = await supabase
      .from("files")
      .select("*")
      .eq("file_type", activeTab) // 🔒 STRICT FILTER
      .order("created_at", { ascending: false })
      .range(from, to);

    setFiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [activeTab, page]);

  /* ---------------- EDIT ---------------- */
  const startEdit = (row: FileRow) => {
    setEditingId(row.id);
    setEditTitle(row.file_name);
    setEditTags((row.tags || []).join(", "));
    setEditDescription(row.description || "");
  };

  const saveEdit = async (id: number) => {
    await supabase
      .from("files")
      .update({
        file_name: editTitle,
        tags: editTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        description: editDescription,
      })
      .eq("id", id);

    setEditingId(null);
    fetchFiles();
  };

  const deleteRow = async (id: number) => {
    if (!confirm("Delete item?")) return;
    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };

  const renderPreview = (row: FileRow) => {
    if (row.file_type === "ringtone") {
      return (
        <div className="w-24 h-36 bg-muted flex items-center justify-center rounded">
          <Music className="w-10 h-10 text-primary" />
        </div>
      );
    }

    if (row.file_type === "video") {
      return (
        <div className="relative w-24 h-36 rounded overflow-hidden">
          <video
            src={row.file_url}
            className="w-full h-full object-cover"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      );
    }

    return (
      <img
        src={row.file_url}
        className="w-24 h-36 object-cover rounded"
      />
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {(["wallpaper", "ringtone", "video"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}s
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {files.map((row) => (
            <Card key={row.id} className="p-4 flex justify-between gap-4">
              <div className="flex gap-4">
                {renderPreview(row)}
                <div>
                  <div className="font-semibold">{row.file_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {row.file_type.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {editingId === row.id ? (
                  <>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <Input
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                    />
                    <Input
                      value={editDescription}
                      onChange={(e) =>
                        setEditDescription(e.target.value)
                      }
                    />
                    <Button onClick={() => saveEdit(row.id)}>
                      <Check />
                    </Button>
                    <Button onClick={() => setEditingId(null)}>
                      <X />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => startEdit(row)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteRow(row.id)}
                    >
                      <Trash />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-6">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default Admin;
