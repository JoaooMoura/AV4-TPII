import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Importamos o NavLink
import { Menu, Home, Users, Bed, Bell } from 'lucide-react'
import styles from "../styles/pages/sidebar.module.css"

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
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            {/* botão de menu flutuante */}
            <button className={styles["btn-boxMenu"]} onClick={() => setIsOpen(!isOpen)}>
                <Menu size={24} />
            </button>

            {/* topo do sidebar*/}
            <div className={styles['sidebar-header']}>
                {isOpen ? (
                    <img src="/assets/logo/Logo.svg" alt="Atlantis Resort" width={140} />
                ) : (
                    <img src="/assets/logo/miniLogo.svg" alt="Atlantis Mini" width={40} />
                )}
            </div>
            
            {/* linha que separa*/}  
            <hr className={styles["Divisor"]}/>
            
            {/* menu da navegação*/}
            <nav className={styles["menu-nav"]}>
                <ul className={styles["menu-list"]}>
                    {menuItems.map(({ id, title, icon: Icon, path }) => (
                        // O NavLink agora abraça e gerencia a classe ativa
                        <NavLink 
                            key={id} 
                            to={path} 
                            className={({ isActive }) => 
                                `${styles["menu-item"]} ${isActive ? styles.active : ''}`
                            }
                        >
                            <Icon size={24} />
                            {isOpen && <span className={styles["menu-text"]}>{title}</span>}
                        </NavLink>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}