import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

export default function ImageUpload({
  value,
  onChange,
  label,
  compact,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const data = result.split(",")[1];
          resolve(data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: base64,
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      console.error("[ImageUpload] Failed:", err);
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
          {label}
        </label>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {value ? (
        <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <img src={value} alt="" className={`w-full object-cover ${compact ? "h-32" : "h-48"}`} />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 hover:border-[var(--ember)]/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all ${
            compact ? "h-32" : "h-48"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-[var(--ember)] animate-spin" />
              <span className="text-sm text-[var(--ember)] font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-zinc-400" />
              <span className="text-sm text-zinc-500 font-medium">Click to upload</span>
              <span className="text-[11px] text-zinc-400">PNG, JPG, WebP</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
