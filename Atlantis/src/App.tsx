import { Helmet } from "react-helmet";
import Router from "./routers/Router";
import "./styles/global.css"
import { Sidebar } from "./components/sidebar";

function App() {
  return (
    <div>
      <Helmet>
        <title>Título da Página</title>
        <meta name="description" content="Minha descrição personalizada." />
      </Helmet>
      <Router />
    </div>
  );
}

export default App;
