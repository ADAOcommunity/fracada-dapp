import Link from "next/link";
import { useState } from "react";
import { useAssetStore } from "../utils/store";
import FracadaAction from "./FracadaAction";

const Fractionalize = () => {
  const [state, setState] = useState<'Init' | 'Loading' | 'Error' | 'Success'>('Init')
  const [fractions, setFractions] = useState<number>(0)


  const [error, setError] = useState<number>(0)

  const assetStore = useAssetStore()
  const policyId = () => assetStore.unit?.slice(0, 56)
  const assetName = () => assetStore.unit ? Buffer.from(assetStore.unit.slice(56), 'hex').toString('ascii') : ''

  return <>
    <FracadaAction action="Fractionalize" children={<>
      <div className="flex w-full items-center py-12 px-6 justify-center">
        <div>
          <div className="flex flex-col justify-between bg-white rounded-lg drop-shadow-sm mb-6 py-5 px-4">
            <div className="ml-11 mt-8 font-medium text-lg">Fractionalize</div>

            <div className="flex flex-col md:flex-row-reverse">
              <div className="flex flex-col items-center">
                <Link target={'_blank'} href={`https://cardanoscan.io/token/${assetStore.unit}`}>
                  <img className="w-80 h-80 rounded-lg drop-shadow-sm cursor-pointer hover:scale-110" src={assetStore.image ? assetStore.image : ""}></img>
                </Link>
                <div className="w-80 break-all">
                  <Link target={'_blank'} href={`https://cardanoscan.io/token/${assetStore.unit}`}>
                    <h4 className="text-gray-800 font-bold my-3 cursor-pointer hover:scale-105">{assetName()}</h4>
                  </Link>
                  <Link target={'_blank'} href={`https://cardanoscan.io/tokenPolicy/${policyId()}`}>
                    <p className="text-gray-800 text-sm cursor-pointer hover:scale-110">{policyId()}</p>
                  </Link>
                </div>
              </div>
              <div className="w-96 flex my-8">

                <input
                  id="fraction-num"
                  disabled={state === 'Loading' || state === 'Success'}
                  value={fractions}
                  onChange={(e) => setFractions(Number((e.target as HTMLInputElement).value))}
                  type={'number'} placeholder="Set number of fractions"
                  className="
                    form-control
                    block
                    w-2/3
                    px-3
                    py-3
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-auto
                    focus:text-gray-700
                    focus:bg-white
                    focus:border-blue-600
                    focus:outline-none"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-start">
                {state === 'Success' ?
                  <div className="h-14 m-auto md:ml-24 rounded-xl flex font-medium text-green-500 items-center justify-center">Succesfully fractionalized!</div>
                  :
                  <button
                    disabled={fractions === 0}
                    className={`
                    w-44 h-14 m-auto md:ml-24 rounded-xl flex font-medium items-center justify-center
                    ${fractions !== 0 ? 'text-white hover:scale-110 cursor-pointer ' + (state === 'Init' ? 'bg-green-500' : 'bg-orange-500') : 'bg-gray-400 text-gray-300'}`
                    }
                    onClick={() => {
                      if (state === 'Init') {
                        setState('Loading')
                        setTimeout(() => setState('Success'), 1000)
                      } else {
                        setState('Init')
                      }
                    }}
                  >
                      {state === 'Init' ?
                        'FRACTIONALIZE' :
                        // <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check-circle" className="w-14 h-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        //   <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                        // </svg> :
                        <svg className="animate-spin w-14 h-" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="matrix(1,0,0,1,0,0)" ></circle></svg>
                      }
                  </button>
                }
                <Link href="/">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 cursor-pointer hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>} />
  </>
};

export default Fractionalize

