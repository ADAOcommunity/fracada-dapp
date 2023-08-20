import { useState } from "react";
import { useAssetStore } from "../utils/store";
import { ActionBottom } from "./ActionBottom";
import { Nft } from "./Nft";
import { lockNft } from "../utils/cardano"
import initLucid from "../utils/initializeLucid"
import { testAll } from "../utils/test";

const Fractionalize = () => {
  const [state, setState] = useState<'Init' | 'Loading' | 'Success'>('Init')
  const [fractions, setFractions] = useState<number>(0)

  const [error, setError] = useState<string | null>(null)

  const handleFractionsChange = (fracts: string) => {
    setFractions(Number(fracts))
  }

  const handleSetError = (err: string) => {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }

  const fractionalize = async (policy: string, name: string, fractions: number) => {
    console.log('name', name)
    // await testAll()
    if (state === 'Init') {
      setError(null)
      setState('Loading')

      // TODO - Pass in walletApi
      const lucid = await initLucid(await window.cardano['nami'].enable())

      //if success
      try {
        await lockNft(lucid, '66726163616461546f6b656e', {[`${policy}${name}`]: BigInt(1)}, BigInt(fractions))
        setState('Success')
      } catch (e) {
        console.log(e)
      }

      setTimeout(() => {
        setState('Init')

        //else
        //error message is shown in ui
        //can be multiline text
        handleSetError(`Failed fractionalizing`)

      }, 3000)

    } else {
      setState('Init')
    }
  }

  const unit = useAssetStore(s => s.unit)
  const image = useAssetStore(s => s.image)
  const policyId = () => unit?.slice(0, 56)
  const assetName = () => unit ? Buffer.from(unit.slice(56), 'hex').toString('ascii') : ''
  const policyString = policyId() || "PolicyNotFound"
  const assetString = assetName()

  const callEndpoint = async () => {
    await fractionalize(policyString, assetString, fractions)
  }


  return <>
      <div className="flex w-full items-center px-6 justify-center">
        <div>
          <div className="flex flex-col justify-between bg-white rounded-lg drop-shadow-sm mb-6 py-5 px-4">
            <div className="ml-11 mt-8 font-medium text-lg">Fractionalize</div>

            <div className="flex flex-col md:flex-row-reverse">

              <Nft unit={unit} image={image} assetName={assetName()} policyId={policyId()} />

              <div className="w-96 flex my-8 flex-col">
                <input
                  type={'number'}
                  id="fraction-num"
                  value={fractions}
                  placeholder="`Number of fractions"
                  disabled={state === 'Loading' || state === 'Success'}
                  onChange={(e) =>
                    handleFractionsChange((e.target as HTMLInputElement).value)
                  }
                  onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                      callEndpoint()
                    }
                  }}
                  className="
                    form-control block w-2/3 px-3 py-3 text-base font-normal text-gray-700 bg-white
                    bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
                    m-auto focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
                {error ? <p className="mx-auto mt-3 md:mt-0 font-medium text-red-500 px-8">
                  {error}
                </p> : !fractions ? <p className="mx-auto mt-3 md:mt-0 font-medium px-8">
                  Choose number of fractions
                </p> : <></>}
              </div>
            </div>
            <div>
              <ActionBottom state={state} enabled={fractions ? true : false} action={callEndpoint} cta="FRACTIONALIZE" successMsg="Fractionalization successful!"/>
            </div>
          </div>
        </div>
      </div>
  </>
};

export default Fractionalize

