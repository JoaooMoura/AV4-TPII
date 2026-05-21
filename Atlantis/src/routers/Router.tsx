import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import NotFound from "../pages/NotFound.page";
import { Sidebar } from "../components/sidebar";

function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<Sidebar />} />
                <Route path="*" element={<NotFound />} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router