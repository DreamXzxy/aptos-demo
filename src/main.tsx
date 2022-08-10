import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import { WalletProvider } from "./hooks/useWallet";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

declare global {
  interface Window { aptos: any; }
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <WalletProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="invoices" element={<Invoices />} />
      </Routes>
    </BrowserRouter>
  </WalletProvider>
);
