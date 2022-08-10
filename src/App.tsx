import { useReducer } from "react";
import { Link } from "react-router-dom";
import { AptosContext, aptosReducer } from "./lib/contexts/AptosContext";

export default function App() {
  const [state, dispatch] = useReducer(aptosReducer, {
    isConnected: false,
    account: null,
    machikadoAccount: null,
  })

  return (

    <div>
      <h1>Bookkeeper</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <AptosContext.Provider value={{state, dispatch}}>
          <Link to="/invoices">Invoices</Link> |{" "}
          <Link to="/expenses">Expenses</Link>
        </AptosContext.Provider>
      </nav>
    </div>
  );
}
