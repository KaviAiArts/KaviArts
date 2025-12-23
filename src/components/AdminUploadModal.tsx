// AdminUploadModal.tsx
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
  };
  pendingUpload?: any;
  onSave: (data: {
    file_name: string;
    description: string;
    tags: string[];
  }) => void;
  onClose: () => void;
};

const AdminUploadModal = ({
  open,
  initialData,
  pendingUpload,
  onSave,
  onClose,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.file_name || "");
      setDescription(initialData.description || "");
      setTags(initialData.tags?.join(", ") || "");
    } else {
      setTitle("");
      setDescription("");
      setTags("");
    }
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {initialData ? "Edit Item" : "Add Details"}
        </h2>

        {/* PREVIEW */}
        {pendingUpload && (
          <div className="w-full rounded overflow-hidden bg-secondary flex justify-center">
            {pendingUpload.resource_type === "image" && (
              <img src={pendingUpload.secure_url} className="max-h-60 object-contain" />
            )}
            {pendingUpload.format === "mp3" && (
              <audio controls src={pendingUpload.secure_url} />
            )}
            {pendingUpload.resource_type === "video" && pendingUpload.format !== "mp3" && (
              <video src={pendingUpload.secure_url} controls className="max-h-60" />
            )}
          </div>
        )}

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={onClose}>
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
