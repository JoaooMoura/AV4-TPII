import { Helmet } from "react-helmet";
import Router from "./routers/Router";
import { AtlantisProvider } from "./context/AtlantisContext";
import "./styles/global.css";

function App() {
  return (
    <AtlantisProvider>
      <Helmet>
        <title>Atlantis Resort</title>
        <meta name="description" content="Protótipo SPA do sistema Atlantis." />
      </Helmet>
      <Router />
    </AtlantisProvider>
  );
}

export default App;
