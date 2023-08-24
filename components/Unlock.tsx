import { useEffect, useState } from "react";
import { useAssetStore, useWalletStore } from "../utils/store";
import { ActionBottom } from "./ActionBottom";
import { Nft } from "./Nft";
import { unlockNft } from "../utils/cardano"
import initLucid from "../utils/initializeLucid"

const Unlock = () => {
  const [state, setState] = useState<'Init' | 'Loading' | 'Success' | 'Done'>('Init')

  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  
  const { walletName } = useWalletStore()

  const handleSetError = (err: string) => {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }
  
  function toHex(str: string) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

  const successMsg = `Unlock successful!
  Transaction ${txHash} was submitted to the blockchain.
  `


  const unlock = async (policyId: string, name: string) => {
    // await testAll()
    if (state === 'Init') {
      setError(null)
      setState('Loading')

      const lucid = await initLucid(await window.cardano[walletName || 'nami'].enable())

      try {
        const tx = await unlockNft(lucid, policyId, toHex(name))
        setTxHash(tx)
        setState('Success')
      } catch (e) {
        console.log(e)
        handleSetError(`Failed unlocking`)
      }
    } else {
      setState('Init')
    }
  }

  const unit = useAssetStore(s => s.unit)
  

  const image = useAssetStore(s => s.image)
  const policyId = () => unit?.slice(0, 56)
  const assetName = () => unit ? Buffer.from(unit.slice(56), 'hex').toString('ascii') : null
  const policyString = policyId() || "PolicyNotFound"
  const assetString = assetName() || "NameNotFound"

  const callEndpoint = async () => {
    await unlock(policyString, assetString)
  }

  return <>
      <div className="flex w-full items-center px-6 justify-center">
        <div>
          <div className="flex flex-col justify-between bg-white rounded-lg drop-shadow-sm mb-6 py-5 px-4">
            <div className="ml-11 mt-8 font-medium text-lg">Unlock</div>

            <div className="flex flex-col md:flex-row-reverse">

              <Nft unit={unit} image={image} assetName={assetName()} policyId={policyId()} />

              <div className="w-96 flex my-8 flex-col">
               
                {error ? <p className="m-auto font-medium text-red-500 px-8">
                  {error}
                </p> : <></>
                }
              </div>
            </div>
            <div>
              <ActionBottom state={state} enabled={state !== "Success"} action={callEndpoint} cta="UNLOCK" successMsg={successMsg}/>
            </div>
          </div>
        </div>
      </div>
  </>
};

export default Unlock

