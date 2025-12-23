import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const AdminUploadModal = ({ open, initialData, pendingUpload, onSave, onClose }: any) => {
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <Card className="p-6 space-y-4">
        {pendingUpload?.format === "mp3" ? (
          <audio controls src={pendingUpload.secure_url} />
        ) : pendingUpload?.resource_type === "video" ? (
          <video controls src={pendingUpload.secure_url} />
        ) : (
          <img src={pendingUpload?.secure_url} />
        )}

        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!title.trim()}
            onClick={() =>
              onSave({
                file_name: title.trim(),
                description: description.trim(),
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminUploadModal;
