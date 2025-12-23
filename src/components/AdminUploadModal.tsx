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

        {pendingUpload && (
          <div className="w-full bg-secondary rounded p-2">
            {pendingUpload.format === "mp3" ? (
              <audio controls src={pendingUpload.secure_url} />
            ) : pendingUpload.resource_type === "video" ? (
              <video controls src={pendingUpload.secure_url} />
            ) : (
              <img src={pendingUpload.secure_url} className="max-h-60 mx-auto" />
            )}
          </div>
        )}

        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={!title.trim()}
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
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminUploadModal;
