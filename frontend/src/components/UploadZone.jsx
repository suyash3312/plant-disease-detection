import { useState, useRef, useCallback } from "react";
import { Upload, Leaf, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API } from "@/App";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadZone({ onResult }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleFiles = useCallback(async (files) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!/^image\/(jpeg|png|webp|jpg)$/i.test(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }
    const dataUrl = await fileToBase64(file);
    setPreview(dataUrl);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const runDetection = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const r = await axios.post(`${API}/detect`, { image_base64: preview });
      onResult(r.data);
      toast.success("Diagnosis ready");
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.detail || "Detection failed. Try another photo.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-3xl bg-white border border-botanical-forest/10 shadow-[0_8px_30px_rgba(30,63,32,0.05)] p-6 sm:p-10" data-testid="upload-card">
      {!preview ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center text-center p-12 md:p-16 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
            dragOver ? "border-botanical-forest bg-botanical-sage/40" : "border-botanical-forest/20 hover:border-botanical-forest/40 hover:bg-botanical-bg2"
          }`}
          data-testid="upload-area"
        >
          <div className="w-16 h-16 rounded-full bg-botanical-sage/60 flex items-center justify-center text-botanical-forest mb-6">
            <Leaf className="w-7 h-7" />
          </div>
          <p className="font-serif text-2xl text-botanical-ink">Drag & drop a leaf photo</p>
          <p className="text-sm text-botanical-muted mt-2">or click to browse — JPG, PNG, WebP up to 8 MB</p>
          <div className="mt-8 inline-flex items-center gap-2 text-sm text-botanical-forest font-semibold">
            <Upload className="w-4 h-4" /> Select file
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            data-testid="upload-file-input"
          />
        </label>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden border border-botanical-forest/10 aspect-square"
            data-testid="upload-preview"
          >
            <img src={preview} alt="leaf preview" className="w-full h-full object-cover" />
            <button
              onClick={clear}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-botanical-forest hover:bg-white"
              data-testid="clear-preview-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-botanical-moss font-semibold">Ready to diagnose</p>
            <h3 className="font-serif text-3xl mt-2 text-botanical-ink">One click and Verdaleaf gets to work.</h3>
            <p className="text-sm text-botanical-muted mt-3 leading-relaxed">
              Our vision model reads the leaf, compares it against known disease patterns, and returns a full report.
            </p>
            <Button
              onClick={runDetection}
              disabled={loading}
              className="mt-8 rounded-full bg-botanical-forest text-white hover:bg-botanical-ink h-12 px-8 active:scale-95 transition-all disabled:opacity-70"
              data-testid="run-detection-btn"
            >
              {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing…</>) : (<>Diagnose leaf</>)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
