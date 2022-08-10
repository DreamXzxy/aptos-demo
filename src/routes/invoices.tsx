import { useEffect } from "react";
import { useAptos } from "../hooks/aptos";

export default function Invoices() {
  const aptos = useAptos()

  useEffect(() => {
    aptos.updateAccount().catch(console.error)
  }, [aptos])
  console.log(aptos, "aptos");

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Invoices</h2>
        {aptos.isConnected
          ? <>
            <div className="w-full py-2 flex bg-momo">
              <div className={"p-2"}>
                <p className={"hidden md:block my-auto font-medium"}>aptos 钱包地址: {aptos.account?.address}</p>
              </div>
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-300 duration-300 rounded-md my-auto ml-auto mr-4"
                onClick={aptos.disconnect}
              >
                解除连接
              </button>
            </div>
            </>
          : <div className="w-full min-h-screen mx-auto text-center">
              <div className="my-3 md:my-12">
                <button
                  className={"px-4 py-2 bg-indigo-500 text-white rounded-md"}
                  onClick={aptos.connect}
                >
                  连接 aptos 钱包
                </button>
              </div>
            </div>
        }
    </main>
  );
}
