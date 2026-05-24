import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import NotFound from "../pages/NotFound.page";
import MainLayout from "../Layout/MainLayout";
import { Inicio } from "../pages/inicio/Index";
import { TelaHospedes } from "../pages/hospedes/Index";
import { TelaAcomodacoes } from "../pages/acomodacao/Index";
import { TelaHospedagem } from "../pages/hospedagem/Index";
import { Paysandu } from "../pages/inicio/Paysandu";

function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Inicio/>}/> 
                    <Route path="inicio" element={<Inicio />} />
                    <Route path="hospedes" element={<TelaHospedes />} /> 
                    <Route path="acomodacoes" element={<TelaAcomodacoes/>} />
                    <Route path="hospedagem" element={<TelaHospedagem />} />
                    <Route path="paysandu" element={<Paysandu />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;