import React from "react";

interface Props {
  avatarUrl: string;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  progress?: number;
  loading?: boolean;
}

export const AvatarUpload: React.FC<Props> = ({
  avatarUrl,
  onSelect,
  label,
  progress,
  loading,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-3 items-center">
      <div className="relative w-20 h-20">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />

        {loading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-xs text-white">
            {progress}%
          </div>
        )}
      </div>

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
        onChange={onSelect} // ✅ теперь тип совпадает
        className="hidden"
      />
    </div>
  );
};
