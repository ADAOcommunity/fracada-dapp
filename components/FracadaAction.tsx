import { useAssetStore, useWalletStore, useSearchStore } from "../utils/store";
import buffer from 'buffer'
import initializeLucid from "../utils/initializeLucid";
import { ReactNode, useEffect, useState } from "react";
import { DebounceInput } from 'react-debounce-input';
import { Loader } from "./Loader";
import { BLOCKFROST_API_URL, BLOCKFROST_PROJECT_ID } from "../utils/envs";

const Buffer = buffer.Buffer

type Asset = {
  policyId: string,
  assetName: string
}

const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/'
const ARWEAVE_GATEWAY = 'https://arweave.net/'

const FracadaAction = ({ children, action }: { children: ReactNode, action: 'Unlock' | 'Fractionalize' }) => {
  const [chosenUnit, setChosenUnit] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [failed, setFailed] = useState<boolean>(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])

  const walletAddress = useWalletStore((s) => s.address)
  const walletName = useWalletStore((s) => s.walletName)

  const setAsset = useAssetStore((s) => s.setAsset)
  const setImage = useAssetStore((s) => s.setImage)
  const cancelUnit = useAssetStore((s) => s.cancelUnit)

  const isConnected = (walletAddress && walletName) ? true : false

  //FOR TESTING
  function delay(milliseconds: number) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }

  const getNftToUnlock = async (fractionUnit: string) => {
    //
    //HERE WE SHOULD LOOK FOR MINTING TX AND GET LOCKED UNIT
    //
    try {
      await delay(600)

      //FOR TESTING:
      //FAILING LESS THEN HALF THE TIMES
      if(Math.random() < 0.4) {
        await delay(1000)
        throw 'Dapp not ready. Failed searching for related unit.'
      }
      
      //RANDOM SPACEBUD
      return Promise.resolve('d5e6bf0500378d4f0da4e8dde6becec7621cd8cbf5cbb9b87013d4cc5370616365427564323536')
    }
    catch { 
      setFailed(true)
    }

    return ''
  }

  useEffect(() => {
    if (isConnected) loadAssets()
    return () => cancelUnit()
  }, [walletName])

  const filterAssets = (filterString: string) => {
    let count = 0
    let filtered: Asset[] = []
    for (const asst of assets) {
      if (count >= 5) break;
      if (asst.assetName.toLowerCase().includes(filterString.toLowerCase()) || asst.policyId.toLowerCase().includes(filterString.toLowerCase())) {
        filtered.push(asst)
        count++
      }
    }
    setFilteredAssets(filtered)
  }

  const chooseAsset = async (unit: string) => {
    setLoading(true)
    try {
      if (action === 'Unlock') {
        const newUnit = await getNftToUnlock(unit)

        if(!newUnit) throw 'Could not find associated locked asset.'
        else unit = newUnit
      }
      setChosenUnit(unit)
      setAsset(unit)
      const bfAsset = (await (await fetch(`${BLOCKFROST_API_URL}/assets/${unit}`, {
        headers: {
          'project_id': BLOCKFROST_PROJECT_ID
        }
      })).json())

      if (bfAsset.metadata && bfAsset.metadata.logo) {
        setImage('data:image/png;base64, ' + bfAsset.metadata.logo)
      } else if (bfAsset.onchain_metadata && bfAsset.onchain_metadata.image) {
        if (bfAsset.onchain_metadata.image.includes('ipfs://') || bfAsset.onchain_metadata.image.includes('ipfs/')) {
          setImage(
            IPFS_GATEWAY + (bfAsset.onchain_metadata.image as string).replace('ipfs/', '').replace('ipfs://', '')
          )
        } else if (bfAsset.onchain_metadata.image.includes('ar://') || bfAsset.onchain_metadata.image.includes('ar/')) {
          setImage(
            ARWEAVE_GATEWAY + (bfAsset.onchain_metadata.image as string).replace('ar/', '').replace('ar://', '')
          )
        }
      }
    } catch(ex) { console.log(ex) }
    setLoading(false)
  }

  const loadAssets = async () => {
    if (!walletName) throw 'Wallet not connnected. Can not load assets.'
    const lucid = await initializeLucid(await window.cardano[walletName].enable())
    const utxos = await lucid.wallet.getUtxos()

    const allAssets: Map<string, Asset> = new Map<string, Asset>()
    utxos.forEach(utxo => Object.keys(utxo.assets).forEach(unit => {
      try {
        if (unit != 'lovelace' && !allAssets.has(unit)) {
          const pid = unit.slice(0, 56)
          const an = Buffer.from(unit.slice(56), 'hex').toString('ascii')
          allAssets.set(unit, { assetName: an, policyId: pid })
        }
      } catch (ex) {
        console.log('Error parsing unit', unit)
        console.log(ex)
      }
    }))
    const astAr = Array.from(allAssets.values())
    if (astAr && astAr.length > 0) {
      setAssets(astAr)
      setFilteredAssets(astAr.length > 5 ? astAr.slice(0, 5) : astAr)
    }
  }


  return failed ? <div className={'m-auto flex text-neutral-600 flex-col'}>
    <h3 className="text-2xl md:text-4xl">Failed to find related locked asset for the unit.</h3>
    <p>Try again later or contact ADAO on Discord for support</p>
  </div> :
    (loading ? <Loader dark={true} /> : <>
      {!isConnected ?
        <div className={'absolute bottom-[265px] text-2xl md:right-60 md:text-4xl'}><h3>Connect a wallet to {action} → </h3></div> :
        <>
          {!chosenUnit ?
            <div className="px-4 lg:px-12 w-full">
              <div className="relative">
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-0 flex items-center px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <DebounceInput
                    placeholder={`Choose ${action === 'Fractionalize' ? 'an asset' : 'your fractions'}...`}
                    className="pl-16 pr-4 py-4 rounded-md shadow-md bg-white border-0 w-full outline-none"
                    debounceTimeout={300}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault()
                      filterAssets(e.target.value)
                    }}
                  />
                </div>
                <ul className="rounded-md shadow-md bg-white absolute left-0 right-0 -bottom-18 mt-3 p-3">
                  {
                    filteredAssets?.length == 0 && <LoadingItems currentCount={filteredAssets?.length} />
                  }

                  {filteredAssets?.length >= 0 && filteredAssets.map(a =>
                    <AssetItem
                      key={a.policyId + a.assetName}
                      assetName={a.assetName}
                      policyId={a.policyId}
                      onClick={() => {
                        chooseAsset(a.policyId + Buffer.from(a.assetName, 'ascii').toString('hex'))
                      }
                      }
                    />
                  )}
                </ul>
              </div>
            </div> :
            <>
              {children}
            </>
          }
        </>
      }
    </>);
};

export default FracadaAction



const AssetItem = ({ assetName, policyId, onClick }: { assetName: string, policyId: string, onClick: any }) => {
  return <>
    <li onClick={() => onClick()} className="grid grid-cols-10 gap-4 min-w-full justify-center items-center cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-50">
      <div className="flex justify-center items-center min-w-full">
        <img src='/assetitem.png' className={'w-5 h-5 md:w-8 md:h-8'} />
      </div>
      <div className="col-start-2 col-end-11 pl-8 border-l-2 border-solid border-gray break-all">
        <h3 className="text-gray-900 font-medium text-md">{assetName}</h3>
        <div className="text-gray-600 mt-1 font-regular text-sm break-all">
          {policyId}
        </div>
      </div>
    </li>
  </>
}

const LoadingItems = ({currentCount}: {currentCount: number | undefined}) => {

  const isTimeout = useSearchStore((s) => s.isTimeout);
  const messageTitle = useSearchStore((s) => s.messageTitle);
  const message = useSearchStore((s) => s.message);
  const setIsTimeout = useSearchStore((s) => s.setIsTimeout);

  const loadTimeoutMessage = () => {
    if(!currentCount || currentCount == 0){
      setIsTimeout()
    }
  }

  useEffect(() => {
    const _t = setTimeout(loadTimeoutMessage, 5000)
    return () => !!_t && clearTimeout(_t);
  }, [])

  const leftIcon = isTimeout ? <span>{':('}</span> : <img src='/assetitem.png' className={'w-5 h-5 md:w-8 md:h-8'} />

  return <>
    <li className="grid grid-cols-10 gap-4 min-w-full justify-center items-center px-4 py-2 rounded-lg hover:bg-gray-50">
      <div className="flex justify-center items-center min-w-full">
        {leftIcon}
      </div>
      <div className="col-start-2 col-end-11 pl-8 border-l-2 border-solid border-gray break-all">
        <h3 className="text-gray-900 font-medium text-md">{messageTitle}</h3>
        <div className="text-gray-600 mt-1 font-regular text-sm break-all">
          {message}
        </div>
      </div>
    </li>
  </>
}