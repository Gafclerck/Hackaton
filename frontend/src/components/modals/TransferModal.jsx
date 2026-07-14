import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function TransferModal({ dossier, open, onClose, onConfirm }) {
  const [motif, setMotif] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    if (open) { setMotif(""); setFocused(false); }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-card w-full max-w-[480px] rounded-2xl border border-border shadow-2xl overflow-hidden pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-4.5 pb-3.5 border-b border-border">
            <h2 className="text-[15px] font-bold text-foreground m-0">Demander un transfert</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary transition-colors">
              <FiX size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">
              Indiquez le motif du transfert pour le dossier <strong className="text-foreground">{dossier.reference}</strong>. La demande sera soumise à validation.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-foreground">
                Motif <span className="text-destructive">*</span>
              </label>
              <textarea
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Ex. : Client basé à Saint-Louis, suivi plus efficace localement"
                rows={3}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full px-3 py-2.5 rounded text-[13px] bg-card text-foreground outline-none resize-y min-h-[80px] transition-all ${
                  focused ? "border-[1.5px] border-ring ring-2 ring-primary/10" : "border-[1.5px] border-border"
                }`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-3 border-t border-border">
            <button
              onClick={onClose}
              className="h-10 px-4 border border-border rounded text-[13px] text-muted-foreground bg-transparent cursor-pointer hover:border-foreground hover:text-foreground transition-all"
            >
              Annuler
            </button>
            <button
              onClick={() => motif.trim() && onConfirm(motif)}
              disabled={!motif.trim()}
              className={`h-10 px-5 rounded text-[13px] font-semibold border-none transition-all ${
                motif.trim()
                  ? "bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Soumettre la demande
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
