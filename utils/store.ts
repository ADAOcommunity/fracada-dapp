import create from 'zustand'

type WalletStore = {
    walletName: null | string,
    address: null | string,
    setConnected: (walletName: string, address: string) => void,
    disconnect: () => void
}

const useWalletStore = create<WalletStore>((set) => ({
  walletName: null,
  address: null,
  setConnected: (walletName: string, address: string) => set({ walletName, address }),
  disconnect: () => set({ walletName: null, address: null }),
}))

type AssetStore = {
  unit: null | string,
  image: null | string,
  setAsset: (unit: string) => void,
  setImage: (image: string) => void,
  cancelUnit: () => void
}

const useAssetStore = create<AssetStore>((set) => ({
  unit: null,
  image: null,
  setAsset: (unit: string) => set({ unit, image: null }),
  setImage: (image: string) => set((s) => { return { image, unit: s.unit }}),
  cancelUnit: () => set({unit: null, image: null}),
}))

type SearchStore = {
  totalResults: number,
  isTimeout: boolean,
  messageTitle: string,
  message: string,
  setTotalResults: (count: number)  => void,
  setIsTimeout: () => void
}

const useSearchStore = create<SearchStore>((set) => ({
  totalResults: 0,
  isTimeout: false,
  messageTitle: "Loading...",
  message: "Please wait while we load assets from your wallet.",
  setIsTimeout: () => set({
    isTimeout: true,
    messageTitle: "No assets found",
    message: "We were not able to find any native assets on this wallet."}),
  setTotalResults: (count: number) => set({totalResults: count})
}))

export { useWalletStore, useAssetStore, useSearchStore }
