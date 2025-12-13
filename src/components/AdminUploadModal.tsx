import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Props = {
  open: boolean;
  fileUrl: string;
  fileType: "wallpaper" | "ringtone" | "video";
  onSave: (data: {
    file_name: string;
    description: string;
    tags: string[];
  }) => void;
  onClose: () => void;
};

const AdminUploadModal = ({ open, fileUrl, fileType, onSave, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Details</h2>

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          className="mt-3"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Input
          className="mt-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                file_name: title,
                description,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
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
