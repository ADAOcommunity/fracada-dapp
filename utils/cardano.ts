import { applyParamsToScript, Assets, Constr, Data, Lucid, PlutusData, Script } from 'lucid-cardano'

// Script Stuff.
const tokenName = 'ADAOFracadaToken' // We could allow this to be the name of the asset..

const fracadaScript = ''
const fracadaPolicyString = ''

const fracadaParams = (initTokenClass: [arg0: string, arg1: string]) => {
    let asset = new Constr(0, [initTokenClass[0], initTokenClass[1]])
    return new Constr(0, [asset, [], BigInt(1)])
}

const fracadaValidator = (lucid: Lucid, initTokenClass: [arg0: string, arg1: string]): Script => {
    return {
        type: 'PlutusV1',
        script: applyParamsToScript(
            fracadaScript,
            fracadaParams(initTokenClass)
        )
    }
}

const fracadaPolicy = (lucid: Lucid, initTokenClass: [arg0: string, arg1: string]): Script => {
    return {
        type: 'PlutusV1',
        script: applyParamsToScript(
            fracadaPolicyString,
            lucid.utils.validatorToScriptHash(fracadaValidator(lucid, initTokenClass)),
            `Fracada-${initTokenClass[1]}`
        )
    }
}

// Datum Stuff.
const fracadaDatum = (initTokenClass: [arg0: string, arg1: string], fractions: number) => {
    let asset = new Constr(0, [initTokenClass[0], initTokenClass[1]])
    return new Constr(0, [asset, BigInt(fractions), asset])
} // We want to store relevant datum info in the metadata.

const fracadaRedeemer = () => {
    return new Constr(1, []) // Nothing
}

// Actions
// TODO We may want to make it so that we query for the tx where we minted the fracada tokens, easier for UX, otherwise user must provide nft that was used.
export const unlockNft = async (lucid: Lucid, initTokenClass: [arg0: string, arg1: string]) => {
    try {
        let tx = lucid.newTx()
        const policy = fracadaPolicy(lucid, initTokenClass)
        const validator = fracadaValidator(lucid, initTokenClass)
        const validatorAddress = lucid.utils.validatorToAddress(validator)
        const fracadaToken = `${lucid.utils.mintingPolicyToId(policy)}Fracada-${initTokenClass[1]}`

        // Get UTxOs with fraction token present. 
        const userUtxos = await lucid.wallet.getUtxos()
        let fullAmount = 0
        const withPolicy = userUtxos.filter((v) => {
            const assets = v.assets
            const amountOfAsset = assets[fracadaToken] // Returns 0 when not present hopefully?
            fullAmount += Number(amountOfAsset)
            return amountOfAsset > BigInt(0)
        })

        // Search for the asset in the validator.
        const scriptUtxos = await lucid.utxosAt(validatorAddress)
        const withAsset = scriptUtxos.filter((v) => {
            const assets = v.assets
            const amountOfAsset = assets[`${initTokenClass[0]}${initTokenClass[1]}`] // Returns 0 when not present hopefully?
            return amountOfAsset > BigInt(0)
        })
        if (withAsset.length != 1) {
            throw "The locked UTxO was not found."
        }
        let scriptUtxo = withAsset[0]
        scriptUtxo.datum = Data.to(fracadaDatum(initTokenClass, fullAmount))

        const datum = fracadaDatum(initTokenClass, fullAmount)
        const redeemer = fracadaRedeemer()
        const toBurn: Assets = {
            [fracadaToken]: BigInt(0 - fullAmount)
        }

        tx = tx.collectFrom([scriptUtxo], Data.to(redeemer))
            .collectFrom(withPolicy)
            .mintAssets(toBurn, Data.empty())
            .attachSpendingValidator(validator)
            .attachMintingPolicy(policy)

        // Sign and submit
        let txC = await tx.complete()
        let txS = await txC.sign().complete()
        let txHash = await txS.submit()
        return txHash
    } catch (e) {
        throw e
    }
}

export const fractionalizeNft = async (lucid: Lucid, initTokenClass: [arg0: string, arg1: string], fractions: number) => {
    try {
        let tx = lucid.newTx()
        const policy = fracadaPolicy(lucid, initTokenClass)
        const validator = fracadaValidator(lucid, initTokenClass)
        const validatorAddress = lucid.utils.validatorToAddress(validator)
        const fracadaToken = `${lucid.utils.mintingPolicyToId(policy)}Fracada-${initTokenClass[1]}`

        const datum = fracadaDatum(initTokenClass, fractions)
        const nftUnit = `${initTokenClass[0]}${initTokenClass[1]}`
        const payment = {['lovelace']: BigInt(2000000), [nftUnit]: BigInt(1)}

        tx = tx.payToContract(validatorAddress, Data.to(datum), payment)
            .mintAssets({[fracadaToken]: BigInt(fractions)}, Data.empty())
            .attachMintingPolicy(policy)

        // Sign and submit
        let txC = await tx.complete()
        let txS = await txC.sign().complete()
        let txHash = await txS.submit()
        return txHash
    } catch (e) {
        throw e
    }
}