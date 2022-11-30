import { Lucid, Blockfrost, Network } from 'lucid-cardano'
import { WalletApi } from '../global'
import { BLOCKFROST_API_URL, BLOCKFROST_PROJECT_ID, NETWORK_NAME} from "./envs.js"

const initializeLucid = async (walletApi?: WalletApi) => {
    let luc = await Lucid.new(new Blockfrost(
        BLOCKFROST_API_URL,
        BLOCKFROST_PROJECT_ID,
    ),  NETWORK_NAME as Network)

    if(walletApi) luc = luc.selectWallet(walletApi)

    return luc
}
export default initializeLucid