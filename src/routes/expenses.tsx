import { useContext, useEffect } from "react";
import { useAptos } from "../hooks/aptos";
import { AptosContext } from "../lib/contexts/AptosContext";
import { AptosActionType } from "../lib/contexts/AptosContextAction";

export default function Expenses() {
  const aptos = useAptos()
  const {dispatch} = useContext(AptosContext)
  console.log(aptos, "aptos");

  useEffect(() => {
    if (typeof window.aptos === "undefined") {
        return
    }
    (async () => {
        dispatch({
          type: AptosActionType.UpdateIsConnected,
          value: await window.aptos?.isConnected() ?? false
        })
        if (await window.aptos?.isConnected()) {
          const account = await window.aptos!.account()
          dispatch({
              type: AptosActionType.UpdateAccount,
              account: account
          })
        }
    })()
  }, [])

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Expenses</h2>
      <button
          className={"px-4 py-2 bg-red-500 text-white rounded-md ml-2 mr-2"}
          onClick={aptos.disconnect}
          >
          解除连接
      </button>
    </main>
  );
}
