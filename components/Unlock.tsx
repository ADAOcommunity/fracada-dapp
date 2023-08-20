import { useState } from "react";
import { useAssetStore } from "../utils/store";
import { ActionBottom } from "./ActionBottom";
import { Nft } from "./Nft";
import { unlockNft } from "../utils/cardano"
import initLucid from "../utils/initializeLucid"
import { testAll } from "../utils/test";

const Unlock = () => {
  const [state, setState] = useState<'Init' | 'Loading' | 'Success'>('Init')

  const [error, setError] = useState<string | null>(null)

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

  const unlock = async (policyId: string, name: string) => {
    // await testAll()
    if (state === 'Init') {
      setError(null)
      setState('Loading')

      // TODO - pass in walletApi
      const lucid = await initLucid(await window.cardano['nami'].enable())

      //if success
      try {
        await unlockNft(lucid, policyId, toHex(name))
        setState('Success')
      } catch (e) {
        console.log(e)
      }

      setTimeout(() => {
        setState('Init')

        //else
        //error message is shown in ui
        //can be multiline text
        handleSetError(`Failed unlocking`)

      }, 3000)

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
              <ActionBottom state={state} enabled={true} action={callEndpoint} cta="UNLOCK" successMsg="Unlock successful!"/>
            </div>
          </div>
        </div>
      </div>
  </>
};

export default Unlock

