import { useState } from "react";
import { useAssetStore } from "../utils/store";
import { ActionBottom } from "./ActionBottom";
import FracadaAction from "./FracadaAction";
import { Nft } from "./Nft";

const Unlock = () => {
  const [state, setState] = useState<'Init' | 'Loading' | 'Success'>('Init')

  const [error, setError] = useState<string | null>(null)

  const handleSetError = (err: string) => {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }

  const unlock = () => {
    if (state === 'Init') {
      setError(null)
      setState('Loading')

      //if success
      //setState('Success')

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

  return <>
    <FracadaAction key="unlock" action="Unlock" children={<>
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
              <ActionBottom state={state} enabled={true} action={unlock} cta="UNLOCK" successMsg="Unlock successful!"/>
            </div>
          </div>
        </div>
      </div>
    </>} />
  </>
};

export default Unlock

