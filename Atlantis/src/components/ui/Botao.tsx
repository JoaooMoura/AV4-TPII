import React, {ButtonHTMLAttributes, ReactNode} from "react";
import css from "../../styles/components/Botao.module.css"

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode
    variant?: "primario" | "secundario" | "danger" | "ghost"
}

export function Botao({children, variant = "primario", className="", ...props}: BotaoProps){

    return(
        <button className={`${css.btnBase} ${css[variant]} ${className}`}{...props}>
            {children}
        </button>
    )

}