import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import NotFound from "../pages/NotFound.page";
import MainLayout from "../Layout/MainLayout";
import { Inicio } from "../pages/inicio/Index";
import { TelaHospedes } from "../pages/hospedes/Index";

function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Inicio/>}/> 
                    <Route path="inicio" element={<Inicio />} />
                    <Route path="hospedes" element={<TelaHospedes />} /> 
                    <Route path="acomodacoes" element={<Inicio />} />
                    <Route path="hospedagem" element={<Inicio />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;