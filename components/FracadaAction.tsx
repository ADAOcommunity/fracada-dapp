import { useAssetStore, useWalletStore } from "../utils/store";
import buffer from 'buffer'
import initializeLucid from "../utils/initializeLucid";
import { ReactNode, useEffect, useState } from "react";
import { DebounceInput } from 'react-debounce-input';

const Buffer = buffer.Buffer

type Asset = {
  policyId: string,
  assetName: string
}

const IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs/'
const ARWEAVE_GATEWAY = 'https://arweave.net/'

const FracadaAction = ({ children, action }: { children: ReactNode, action: 'Unlock' | 'Fractionalize' }) => {
  const [chosenUnit, setChosenUnit] = useState<string | undefined>(undefined)
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const walletStore = useWalletStore()
  const assetStore = useAssetStore()
  const isConnected = (walletStore.address && walletStore.walletName) ? true : false

  useEffect(() => {
    if (isConnected) loadAssets()
  }, [walletStore.walletName])

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
    setChosenUnit(unit)

    const bfAsset = (await (await fetch(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${unit}`, {
      headers: {
        'project_id': 'mainnetxIyVZQ4yaAvofGroMlHEYqGPJr1uFVmW'
      }
    })).json())

    if (bfAsset.metadata && bfAsset.metadata.logo) {
      assetStore.setAsset(unit, 'data:image/png;base64, ' + bfAsset.metadata.logo)
    } else if (bfAsset.onchain_metadata && bfAsset.onchain_metadata.image) {
      if (bfAsset.onchain_metadata.image.includes('ipfs://') || bfAsset.onchain_metadata.image.includes('ipfs/')) {
        assetStore.setAsset(
          unit,
          IPFS_GATEWAY + (bfAsset.onchain_metadata.image as string).replace('ipfs/', '').replace('ipfs://', '')
        )
      } else if (bfAsset.onchain_metadata.image.includes('ar://') || bfAsset.onchain_metadata.image.includes('ar/')) {
        assetStore.setAsset(
          unit,
          ARWEAVE_GATEWAY + (bfAsset.onchain_metadata.image as string).replace('ar/', '').replace('ar://', '')
        )
      }
    }
  }

  const loadAssets = async () => {
    if (!walletStore.walletName) throw 'Wallet not connnected. Can not load assets.'
    const lucid = await initializeLucid(await window.cardano[walletStore.walletName].enable())
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

  return <>
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
                {filteredAssets.map(a =>
                  <AssetItem
                    key={a.policyId + a.assetName}
                    assetName={a.assetName}
                    policyId={a.policyId}
                    onClick={() => chooseAsset(a.policyId + Buffer.from(a.assetName, 'ascii').toString('hex'))}
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
  </>;
};

export default FracadaAction



const AssetItem = ({ assetName, policyId, onClick }: { assetName: string, policyId: string, onClick: any }) => {
  return <>
    <li onClick={() => onClick()} className="grid grid-cols-10 gap-4 min-w-full justify-center items-center cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-50">
      <div className="flex justify-center items-center min-w-full">
        <img src='/assetitem.png' className={'w-8 h-8'} />
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