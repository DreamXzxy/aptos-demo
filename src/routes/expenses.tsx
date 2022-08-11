import { AptosClient, Types } from "aptos";
import React from "react";
import { useContext, useEffect } from "react";
import { useAptos } from "../hooks/aptos";
import { toHex } from "../lib/aptos/message";
import { AptosContext } from "../lib/contexts/AptosContext";
import { AptosActionType } from "../lib/contexts/AptosContextAction";

// Create an AptosClient to interact with devnet.
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');

export default function Expenses() {
  const aptos = useAptos()
  const {dispatch} = useContext(AptosContext)

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

  const address = aptos.account?.address;
  const isEditable = !address;

  // Check for the module; show publish instructions if not present.
  const [modules, setModules] = React.useState<Types.MoveModuleBytecode[]>([]);
  React.useEffect(() => {
    if (!address) return;
      client.getAccountModules(address).then(setModules);
  }, [address]);

  console.log(modules, "modules");
  const hasModule = modules.some((m) => m.abi?.name === 'Message');
  const publishInstructions = (
    <pre>
      Run this command to publish the module:
      <br />
      aptos move publish --package-dir /path/to/hello_blockchain/
      --named-addresses HelloBlockchain={address}
    </pre>
  );

  // Call set_message with the textarea value on submit.
  const ref = React.createRef<HTMLTextAreaElement>();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!ref.current) return;

    const message = ref.current.value;
    const transaction = {
      type: "script_function_payload",
      function: `${address}::Message::set_message`,
      arguments: [toHex(message)],
      type_arguments: [],
    };

    try {
      setIsSaving(true);
      const result = await window.aptos.signAndSubmitTransaction(transaction);
      console.log(result, "result");
    } finally {
      setIsSaving(false);
    }
  };

  // Get the message from account resources.
  const [resources, setResources] = React.useState<Types.MoveResource[]>([]);
  React.useEffect(() => {
    if (!address) return;
    client.getAccountResources(address).then(setResources);
  }, [address, resources]);
  const resourceType = `${address}::Message::MessageHolder`;
  const accountType = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
  const resource = resources.find((r) => r.type.toString() === resourceType);
  const account = resources.find((r) => r.type.toString() === accountType);
  const data = resource?.data as {message: string} | undefined;
  const accountData = account?.data as {coin: {value: string}} | undefined;
  const message = data?.message;
  const value = accountData?.coin.value;

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>读取合约数据</h2>
      {hasModule ? (
        <form>
          <textarea ref={ref} defaultValue={message}/>
          {isEditable && (<input disabled={isSaving} type="submit" />)}
          {isEditable && (<a href={address!}>Get public URL</a>)}
        </form>
      ) : publishInstructions}
      <h2>当前账户余额为</h2>
      <div>
        {value}
      </div>
      <button
        onClick={handleSubmit}>
        写入数据
      </button>
      <button
          className={"px-4 py-2 bg-red-500 text-white rounded-md ml-2 mr-2"}
          onClick={aptos.disconnect}
          >
          解除连接
      </button>
    </main>
  );
}
