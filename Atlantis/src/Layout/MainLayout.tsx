import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/sidebar'

export default function MainLayout() {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, overflow: 'auto' }}>
                <Outlet />
            </main>
        </div>
    )
}