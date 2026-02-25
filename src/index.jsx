import "@fontsource/inter";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/playfair-display/700.css";
import { createRoot } from "react-dom/client";
import { MainView } from "./components/main-view/main-view";
import "./index.scss";

const App = () => {
  return <MainView />;
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<App />);