import React, { useState } from "react";
import { NavLink } from "react-router-dom"; 
import { Home, Users, Bed, Bell } from 'lucide-react'
import css from "../styles/pages/sidebar.module.css"

interface MenuItem {
    id: number,
    title: string,
    icon: React.ComponentType<{ size: number }>,
    path: string
}

export function Sidebar() {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    const menuItems: MenuItem[] = [
        { id: 1, title: 'Início', icon: Home, path: '/' },
        { id: 2, title: 'Hóspedes', icon: Users, path: '/hospedes' },
        { id: 3, title: 'Acomodações', icon: Bed, path: '/acomodacoes' },
        { id: 4, title: 'Hospedagem', icon: Bell, path: '/hospedagem' }
    ]

    return (
        <aside className={`${css.sidebar} ${isOpen ? css.open : css.closed}`}>

            <div className={css['sidebar-header']}>
                {isOpen ? (
                    <button className={css['logo-btn']}  onClick={() => setIsOpen(!isOpen)}>
                        <img src="/assets/logo/Logo.svg" alt="Atlantis Resort" width={140} />
                    </button>
                ) : (

                    <button className={css['logo-btn']}  onClick={() => setIsOpen(!isOpen)}>
                        <img src="/assets/logo/miniLogo.svg" alt="Atlantis Mini" width={40} />
                    </button>
                )}

            </div>

            <hr className={css["Divisor"]} />

            <nav className={css["menu-nav"]}>
                <ul className={css["menu-list"]}>
                    {menuItems.map(({ id, title, icon: Icon, path }) => (
                        <NavLink
                            key={id}
                            to={path}
                            className={({ isActive }) =>
                                `${css["menu-item"]} ${isActive ? css.active : ''}`
                            }
                        >
                            <Icon size={24} />
                            {isOpen && <span className={css["menu-text"]}>{title}</span>}
                        </NavLink>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}