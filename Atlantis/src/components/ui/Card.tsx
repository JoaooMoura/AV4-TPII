import React, {ReactNode} from "react";
import css from "../../styles/components/Card.module.css"

interface CardProps{
    children: ReactNode
    className?: string
} 

export function Card({ children, className = ""} : CardProps){
    return(
        <div className={`${css.cardBase} ${className}`}>
            {children}
        </div>
    )
}