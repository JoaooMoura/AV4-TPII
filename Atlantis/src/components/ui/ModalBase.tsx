import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import css from "../../styles/components/ModalBase.module.css";

interface ModalBaseProps {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  rodape?: ReactNode;
  largura?: "sm" | "md" | "lg";
}

export function ModalBase({
  aberto,
  onFechar,
  titulo,
  subtitulo,
  children,
  rodape,
  largura = "md",
}: ModalBaseProps) {

  useEffect(() => {
    if (!aberto) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [aberto, onFechar]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className={css.overlay} onClick={onFechar}>
      <div className={`${css.modal} ${css[largura]}`} onClick={(e) => e.stopPropagation()}>

        <div className={css.header}>
          <div>
            <h2 className={css.titulo}>{titulo}</h2>
            {subtitulo && <p className={css.subtitulo}>{subtitulo}</p>}
          </div>
          <button className={css.fechar} onClick={onFechar} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className={css.corpo}>{children}</div>

        {rodape && <div className={css.rodape}>{rodape}</div>}
      </div>
    </div>
  );
}
