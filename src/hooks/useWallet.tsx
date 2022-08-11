import React, { ReactNode, useReducer } from "react";
import { AptosContext, aptosReducer } from "../lib/contexts/AptosContext";

export function WalletProvider({ children}: {children: ReactNode}){
   const [state, dispatch] = useReducer (aptosReducer, {
    isConnected: false,
    account: null,
    machikadoAccount: null,
   })

  return (
    <AptosContext.Provider value={{ state, dispatch }}>
      {children}
    </AptosContext.Provider>
  )
}
