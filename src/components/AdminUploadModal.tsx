import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      setThumbnailPreview(null);
      setSaving(false);
    }
  }, [open, initialData, pendingUpload]);

  if (!open) return null;

  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    tags.trim() !== "";

  const handleLocalSave = async () => {
    if (!isFormValid || saving) return;

    setSaving(true);

    await onSave({
      file_name:
        title.trim() || pendingUpload?.original_filename || "Untitled",
      description: description.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      thumbnailFile,
    });

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl rounded-2xl border border-white/10">

        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Item" : "Add Details"}
        </h2>

        {/* ORIGINAL FILE PREVIEW */}
        {pendingUpload && (
          <div className="mb-4 rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center min-h-[150px] border border-white/10">
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

        <div className="space-y-4">

          {/* TITLE */}
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="admin-login-input"
          />

          {/* TAGS */}
          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="admin-login-input"
          />

          {/* DESCRIPTION (UPDATED STYLING) */}
          <textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[130px] rounded-xl bg-[rgba(15,23,42,0.9)] border border-white/40 text-white px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,255,255,0.7)]"
          />

          {/* THUMBNAIL SECTION */}
          {pendingUpload?.resource_type !== "audio" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Thumbnail (optional)
              </p>

              <Input
                type="file"
                accept="image/*"
                className="admin-login-input"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    setThumbnailFile(file);
                    setThumbnailPreview(URL.createObjectURL(file));
                  }
                }}
              />

              {thumbnailPreview && (
                <div className="rounded-xl overflow-hidden border border-white/10 mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="max-h-40 object-contain w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between mt-6">

          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full border border-white/30 hover:border-red-400 hover:shadow-[0_0_10px_rgba(255,77,77,0.8)] transition-all"
          >
            Cancel
          </Button>

          <Button
            onClick={handleLocalSave}
            disabled={!isFormValid || saving}
            className="neon-btn btn-download min-w-[110px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>

        </div>
      </Card>
    </div>
  );
};

export default AdminUploadModal;