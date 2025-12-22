import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Props = {
  open: boolean;
  initialData?: {
    file_name: string;
    description?: string;
    tags?: string[];
    file_url?: string;
    file_type?: "wallpaper" | "ringtone" | "video";
  };
  onSave: (data: {
    file_name: string;
    description: string;
    tags: string[];
  }) => void;
  onClose: () => void;
};

const AdminUploadModal = ({ open, initialData, onSave, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (initialData) {
      // EDIT MODE
      setTitle(initialData.file_name || "");
      setDescription(initialData.description || "");
      setTags(initialData.tags?.join(", ") || "");
    } else {
      // NEW UPLOAD → ALWAYS BLANK
      setTitle("");
      setDescription("");
      setTags("");
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {initialData?.file_name ? "Edit Item" : "Add Details"}
        </h2>

        {/* 🔍 PREVIEW (NEW UPLOAD ONLY) */}
        {initialData?.file_url && (
          <div className="rounded-md border bg-muted/30 p-3 flex justify-center">
            {initialData.file_type === "wallpaper" && (
              <img
                src={initialData.file_url}
                alt="Preview"
                className="max-h-48 object-contain rounded"
              />
            )}

            {initialData.file_type === "ringtone" && (
              <audio controls className="w-full">
                <source src={initialData.file_url} />
              </audio>
            )}

            {initialData.file_type === "video" && (
              <video
                controls
                className="max-h-48 rounded"
                src={initialData.file_url}
              />
            )}
          </div>
        )}

        {/* METADATA */}
        <Input
          placeholder="Title (50–60 characters recommended)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Input
          placeholder="Description (150–160 characters recommended)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            onClick={() => {
              // 🔒 Cancel = discard everything visually
              setTitle("");
              setDescription("");
              setTags("");
              onClose();
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() =>
              onSave({
                file_name: title.trim(),
                description: description.trim(),
                tags: tags
                  .split(",")
                  .map((t) => t.trim().toLowerCase())
                  .filter(Boolean),
              })
            }
            disabled={!title.trim()}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminUploadModal;
