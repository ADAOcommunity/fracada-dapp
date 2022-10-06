import { Lucid, Blockfrost } from 'lucid-cardano'
import { WalletApi } from '../global'

const initializeLucid = async (walletApi?: WalletApi) => {
    let luc = await Lucid.new(new Blockfrost(
        'https://cardano-mainnet.blockfrost.io/api/v0/',
        'mainnetxIyVZQ4yaAvofGroMlHEYqGPJr1uFVmW'
    ), 'Mainnet')

    if(walletApi) luc = luc.selectWallet(walletApi)

    return luc
}
export default initializeLucid