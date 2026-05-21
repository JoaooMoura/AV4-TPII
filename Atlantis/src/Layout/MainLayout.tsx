import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/sidebar'
import css from '../styles/pages/MainLayout.module.css'

export default function MainLayout() {
    return (
        <div className={css.wrapper}>
            <Sidebar />
            <main className={css.main}>
                <Outlet />
            </main>
        </div>
    )
}