import React from "react";

interface AvatarUploadProps {
  avatarUrl?: string | null;                  // текущий URL или null
  onSelect: (file: File) => void;            // отдаём наружу только файл
  label: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarUrl,
  onSelect,
  label,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(avatarUrl ?? null);

  React.useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  React.useEffect(() => {
    if (avatarUrl && !avatarUrl.startsWith("blob:")) {
      setPreview(avatarUrl);
    }
  }, [avatarUrl]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    onSelect(file);
  };

  return (
    <div className="flex gap-3 items-center">
      <img
        src={preview ?? "/img/icon.png"}
        className="w-20 h-20 rounded-full object-cover bg-black/40"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-3 py-1 bg-background/70 hover:bg-background rounded"
      >
        {label}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
};
