import { AptosClient, Types } from "aptos";
import React, { useMemo } from "react";
import { useContext, useEffect } from "react";
import { useAptos } from "../hooks/aptos";
import { toHex } from "../lib/aptos/message";
import { AptosContext } from "../lib/contexts/AptosContext";
import { AptosActionType } from "../lib/contexts/AptosContextAction";

// Create an AptosClient to interact with devnet.
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');

export default function Message() {
  const aptos = useAptos()
  const {dispatch} = useContext(AptosContext)

  useEffect(() => {
    if (typeof window.aptos === "undefined") {
      return;
    }
    (async () => {
      dispatch({
        type: AptosActionType.UpdateIsConnected,
        value: await window.aptos?.isConnected() ?? false
      })
      if (await window.aptos?.isConnected()) {
        const account = await window.aptos.account()
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

  // Call set_message with the textarea value on submit.
  const ref = React.createRef<HTMLTextAreaElement>();
  const [isSaving, setIsSaving] = React.useState(false);

  const hasModule = modules.some((m) => m.abi?.name === 'Message');

  const messageTextarea = (
    <>
      <pre>
        You can write message to aptos blockchain.
      </pre>
      <form>
        <textarea ref={ref}/>
        {isEditable && (<input disabled={isSaving && hasModule} type="submit" />)}
        {isEditable && (<a href={address}>Get public URL</a>)}
      </form>
    </>
  );
  const publishInstructions = (
    <pre>
      Run this command to publish the module:
      <br />
      aptos move publish --package-dir /path/to/hello_blockchain/
      --named-addresses HelloBlockchain={address}
    </pre>
  );

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
  const resourceType = `${address}::Message::MessageHolder`;
  const accountType = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";

  React.useEffect(() => {
    if (!address) return;
    client.getAccountResources(address).then(setResources);
  }, [address]);

  function useResources() {
    return useMemo(() => {
      return {
        resource: resources.find((r) => r.type.toString() === resourceType),
        account: resources.find((r) => r.type.toString() === accountType)
      }
    }, [resources, address])
  }

  const resource = useResources();

  function useResource() {
    const resourceData = resource.resource?.data as {message: string} | undefined
    const accountData = resource.account?.data as {coin: {value: string}} | undefined;
    const message = resourceData?.message;
    const value = accountData?.coin.value;
    return useMemo(() => {
      return {
        message,
        value
      }
    }, [resources, address])
  }

  const message = useResource().message;
  const value = useResource().value;

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>读取合约数据</h2>
      <div>
        message: {message}
      </div>
      <div>
        account balance: {value}
      </div>
      {hasModule ? (
        messageTextarea
      ) : publishInstructions}
      <button
        onClick={handleSubmit}>
        写入数据
      </button>
      <h2>当前账户余额为</h2>
      <div>
        {value}
      </div>
      <button
        className={"px-4 py-2 bg-red-500 text-white rounded-md ml-2 mr-2"}
        onClick={aptos.disconnect}
      >
        解除连接
      </button>
    </main>
  );
}
