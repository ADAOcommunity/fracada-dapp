import {
    Blockfrost,
    C,
    Emulator,
    Credential,
    fromHex,
    fromText,
    generatePrivateKey,
    getAddressDetails,
    Lucid,
    PoolParams,
    ScriptHash,
    toUnit,
    toHex,
    TxComplete,
    TxHash,
    Data,
} from "lucid-cardano";
import { lockNft, unlockNft } from "./cardano"

export const testAll = async () => {  
    console.log("generating keys")
    const privateKey0 = generatePrivateKey();
  
    console.log("generating addresses")
    const address0 = await (await Lucid.new(undefined, "Custom"))
        .selectWalletFromPrivateKey(privateKey0).wallet.address();

    let lucid = (await Lucid.new(undefined, "Custom"))
  
    console.log("preparing native script")
    const { paymentCredential } = getAddressDetails(address0);
  
    console.log("Emulator being created.")
    const emulator = new Emulator(
        [
            { address: address0, assets: { ['lovelace']: BigInt(3000000000) } }
        ]
    );

    console.log("Establishing lucid with emulator")
    lucid = await Lucid.new(emulator);
    lucid.selectWalletFromPrivateKey(privateKey0);

    emulator.awaitBlock(1)

    let ns = lucid.utils.nativeScriptFromJson({
        keyHash: paymentCredential?.hash,
        type: "sig"
    })

    let pol = lucid.utils.mintingPolicyToId(ns)

    console.log("Creating NFT")
    const nftMint = await (await (await lucid.newTx()
                    .attachMintingPolicy(ns)
                    .mintAssets({[pol]: BigInt(1)})
                    .payToAddress(address0, { [pol]: BigInt(1) })
                    .complete()).sign().complete()).submit();
    console.log("nftMint", nftMint)

    emulator.awaitBlock(1)
    console.log("NFT created, minting policy attached.")

    const lock = await lockNft(lucid, "", {[pol]: BigInt(1)}, BigInt(100))
    emulator.awaitBlock(3)
    console.log("NFT created and fractionalized.")
    console.log(emulator.mempool)
    console.log(emulator.ledger)

    const unlock = await unlockNft(lucid, lock.policy, "")
    console.log("unlock", unlock)

    emulator.awaitBlock(1)
    console.log("NFT created and fractionalized, as well as unlocked.")
}
