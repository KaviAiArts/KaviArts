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

const AdminUploadModal = ({ open, initialData, pendingUpload, onSave, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // 5. Reset data cleanly for every new upload
  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.file_name || "");
        setDescription(initialData.description || "");
        setTags(initialData.tags?.join(", ") || "");
      } else {
        // Clear for new upload
        setTitle("");
        setDescription("");
        setTags("");
      }
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleLocalSave = () => {
    onSave({
      file_name: title.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Item" : "Add Details"}
        </h2>

        {/* 3. Preview Section */}
        {pendingUpload && (
          <div className="mb-4 rounded-lg overflow-hidden bg-secondary/50 flex items-center justify-center min-h-[150px] border">
            {pendingUpload.resource_type === "image" ? (
              <img 
                src={pendingUpload.secure_url} 
                alt="Preview" 
                className="max-h-48 object-contain"
              />
            ) : pendingUpload.resource_type === "video" && !pendingUpload.is_audio ? (
              <video 
                src={pendingUpload.secure_url} 
                controls 
                className="max-h-48"
              />
            ) : (
              <div className="p-4 text-center">
                <p className="text-2xl mb-2">🎵</p>
                <p className="text-sm font-medium">Audio Uploaded</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {pendingUpload.original_filename}.{pendingUpload.format}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // 2. Allow saving with Enter key
            onKeyDown={(e) => e.key === "Enter" && handleLocalSave()}
          />

          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLocalSave()}
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLocalSave()}
          />
        </div>

        <div className="flex justify-between mt-6">
          {/* 4. Cancel button strictly calls onClose without saving */}
          <Button 
            variant="ghost" 
            onClick={(e) => {
                e.preventDefault(); // Prevent accidental submits
                onClose();
            }}
          >
            Cancel
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