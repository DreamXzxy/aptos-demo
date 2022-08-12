import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import { WalletProvider } from "./hooks/useWallet";
import Message from "./routes/Message";
import Wallet from "./routes/wallet";

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
        <Route path="message" element={<Message />} />
        <Route path="wallet" element={<Wallet />} />
      </Routes>
    </BrowserRouter>
  </WalletProvider>
);
