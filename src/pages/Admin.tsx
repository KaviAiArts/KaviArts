// src/pages/Admin.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash, Edit, Check, X, Music, Play } from "lucide-react";

type FileRow = {
  id: number;
  file_name: string;
  file_type: "wallpaper" | "ringtone" | "video";
  file_url: string;
  tags?: string[] | null;
  category?: string | null;
  created_at?: string;
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const Admin = () => {
  // 🔒 AUTH
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // 📦 DATA
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(false);

  // ✏️ EDIT
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");

  // ✅ HOOKS MUST ALWAYS RUN
  useEffect(() => {
    if (isAuthorized) fetchFiles();
  }, [isAuthorized]);

  // ------------------------
  // FETCH FILES
  // ------------------------
  const fetchFiles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setFiles([]);
    } else {
      setFiles(data || []);
    }

    setLoading(false);
  };

  // ------------------------
  // EDIT
  // ------------------------
  const startEdit = (row: FileRow) => {
    setEditingId(row.id);
    setEditTitle(row.file_name);
    setEditTags((row.tags || []).join(","));
  };

  const saveEdit = async (id: number) => {
    await supabase
      .from("files")
      .update({
        file_name: editTitle,
        tags: editTags.split(",").map(t => t.trim()),
      })
      .eq("id", id);

    setEditingId(null);
    fetchFiles();
  };

  const deleteRow = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("files").delete().eq("id", id);
    fetchFiles();
  };

  // ------------------------
  // LOGIN UI
  // ------------------------
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

  // ------------------------
  // ADMIN DASHBOARD
  // ------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {files.map((row) => (
            <Card key={row.id} className="p-4 flex justify-between">
              <div className="flex gap-4">
                <div className="w-24 h-36 bg-muted rounded flex items-center justify-center">
                  {row.file_type === "ringtone" && <Music />}
                  {row.file_type === "video" && <Play />}
                  {row.file_type === "wallpaper" && (
                    <img src={row.file_url} className="w-full h-full object-cover rounded" />
                  )}
                </div>

                <div>
                  <div className="font-semibold">{row.file_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Type: {row.file_type}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {editingId === row.id ? (
                  <>
                    <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <Input value={editTags} onChange={e => setEditTags(e.target.value)} />
                    <Button onClick={() => saveEdit(row.id)}><Check /></Button>
                    <Button onClick={() => setEditingId(null)}><X /></Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => startEdit(row)}><Edit /></Button>
                    <Button variant="destructive" onClick={() => deleteRow(row.id)}><Trash /></Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
