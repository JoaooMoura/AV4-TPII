import React, { useState } from "react";
import { Menu, Home, Users, Bed, Bell } from 'lucide-react'
import css from "../styles/pages/sidebar.module.css"

interface MenuItem {
    id: number,
    title: string,
    icon: React.ReactNode
}

export function Sidebar() {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    const menuItems: MenuItem[] = [
        { id: 1, title: 'Início', icon: <Home size={24} /> },
        { id: 2, title: 'Hóspedes', icon: <Users size={24} /> },
        { id: 3, title: 'Acomodações', icon: <Bed size={24} /> },
        { id: 4, title: 'Hospedagem', icon: <Bell size={24} /> }
    ]

    return (
        <aside className={`${css.sidebar} ${isOpen ? css.open : css.closed}`}>
            <button className={css["btn-boxMenu"]} onClick={() => setIsOpen(!isOpen)}>
                <Menu size={24} />
            </button>
            {/* topo do sidebar*/}
            <div className={`${css['sidebar-header']} ${isOpen ? css.open : css.closed}`}>
                {isOpen ? (
                    <img src="/assets/logo/Logo.svg" alt="Atlantis Resort" width={140} />
                ) : (
                    <img src="/assets/logo/miniLogo.svg" alt="Atlantis Mini" width={40} />
                )}


            </div>

            {/* linha que separa*/}
            <hr className={css["Divisor"]} />

            {/* menu da navegação*/}
            <nav className={css["menu-nav"]}>
                <ul className={css["menu-list"]}>

                    {/* cada item do menu*/}
                    {menuItems.map((item) => (
                        <li key={item.id} className={css["menu-item"]}>
                            {item.icon}
                            {isOpen && <span className={css["menu-text"]}>{item.title}</span>}
                        </li>
                    ))}

                </ul>
                
            </nav>
        </aside>
    )
}