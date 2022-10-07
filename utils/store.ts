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

export { useWalletStore, useAssetStore }



