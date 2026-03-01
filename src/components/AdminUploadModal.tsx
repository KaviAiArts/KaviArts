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
    thumbnailFile?: File | null;
  }) => void;
  onCancel: () => void;
};

const AdminUploadModal = ({
  open,
  initialData,
  pendingUpload,
  onSave,
  onCancel,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.file_name || "");
        setDescription(initialData.description || "");
        setTags(initialData.tags?.join(", ") || "");
      } else {
        setTitle(pendingUpload?.original_filename || "");
        setDescription("");
        setTags("");
      }

      setThumbnailFile(null);
    }
  }, [open, initialData, pendingUpload]);

  if (!open) return null;

  const handleLocalSave = () => {
    onSave({
      file_name:
        title.trim() || pendingUpload?.original_filename || "Untitled",
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      thumbnailFile,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Item" : "Add Details"}
        </h2>

        {/* Preview */}
        {pendingUpload && (
          <div className="mb-4 rounded-lg overflow-hidden bg-secondary/50 flex items-center justify-center min-h-[150px] border">
            {pendingUpload.resource_type === "image" ? (
              <img
                src={pendingUpload.secure_url}
                alt="Preview"
                className="max-h-48 object-contain"
              />
            ) : pendingUpload.resource_type === "video" ? (
              <video
                src={pendingUpload.secure_url}
                controls
                className="max-h-48"
              />
            ) : (
              <div className="p-4 text-center">
                <p className="text-4xl mb-2">🎵</p>
                <p className="text-sm font-medium">Audio File</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
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

          <textarea
className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Thumbnail Upload (not for audio) */}
          {pendingUpload?.resource_type !== "audio" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Thumbnail (optional)
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setThumbnailFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={onCancel}>
            Cancel Upload
          </Button>
          <Button onClick={handleLocalSave}>
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminUploadModal;