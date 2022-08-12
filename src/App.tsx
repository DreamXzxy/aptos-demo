import React from 'react';
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>Aptos dapp</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <div>
          <Link to="/wallet">Wallet</Link>
        </div>
        <div>
          <Link to="/message">Message</Link>
        </div>
      </nav>
    </div>
  );
}
