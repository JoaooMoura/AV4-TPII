import { useState } from "react";
import css from "../../styles/pages/paysandu.module.css";

export function Paysandu() {
  const [mostrarVideo, setMostrarVideo] = useState(true);

  return (
    <main className={css.page}>
      
            <video
              className={css.video}
              src="/paysandu/paysandu.mp4"
              autoPlay
              controls
              muted
            >
            </video>

    </main>
  );
}