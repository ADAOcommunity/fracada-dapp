import { applyParamsToScript, Assets, C, Constr, Data, Lucid, Script, UTxO } from 'lucid-cardano'
import * as L from 'lucid-cardano';
import {createHash} from 'crypto';
import {FractionLockSpend, FractionTokenFractionToken} from './plutus'

export const fromHex = (hex: string) => Buffer.from(hex, "hex");
export const toHex = (bytes: number[]) => Buffer.from(bytes).toString("hex");

const validator = new FractionLockSpend()

const stakeCred: L.Credential = {type: "Key", hash: "a679d78da810b73f00405cbbf00e1bfb25eeb4d6303bfa58480234f1" }

export const lockNft = async (lucid: Lucid, fractionTokenName: string, toLock: Assets, fractions: bigint) => {
    try {
        // Create a new instance of the FractionTokenFractionToken
        const contractAddress = lucid.utils.validatorToAddress(validator, stakeCred)
        const contractDetails = await lucid.utils.getAddressDetails(contractAddress)
        // Log all Contract Details
        console.log("contractDetails", contractDetails)
        console.log("contractDetails.paymentType", contractDetails.paymentCredential?.type)
        console.log("contractDetails.paymentHash", contractDetails.paymentCredential?.hash)
        console.log("contractDetails.stakeType", contractDetails.stakeCredential?.type)
        console.log("contractDetails.stakeHash", contractDetails.stakeCredential?.hash)

        const userUtxos = await lucid.wallet.getUtxos()
        const utxo: UTxO = userUtxos[0];
        const vCred: [string] = [lucid.utils.validatorToScriptHash(validator)];
        const sCred: [string] = [stakeCred.hash];
        const ssCred: [{ VerificationKeyCredential: [string] }] = [{ VerificationKeyCredential: sCred }]
        const scriptAddress = {
            paymentCredential: { ScriptCredential: vCred },
            stakeCredential: { Inline: ssCred }
        };
        
        const policy = new FractionTokenFractionToken(scriptAddress, fractionTokenName, {transactionId: {hash: utxo.txHash}, outputIndex: BigInt(utxo.outputIndex)})
        const policyId = lucid.utils.mintingPolicyToId(policy)
        const beaconToken = `${policyId}${'626561636f6e'}`; // '626561636f6e' is the hex representation of 'beacon'
        const fractionToken = `${policyId}${fractionTokenName}`;

        // Define the assets to mint
        const toMint: Assets = {
            [beaconToken]: BigInt(1),
            [fractionToken]: fractions
        };

        // Define the datum
        const datum = Data.to({
            burnPolicy: policyId,
            burnName: fractionTokenName,
            amount: fractions,
            outputRef: {transactionId: { hash: utxo.txHash }, outputIndex: BigInt(utxo.outputIndex)}
        }, FractionLockSpend.datum);

        // Create a new transaction
        let tx = lucid.newTx();

        // Add the utxo to the transaction inputs
        tx = tx.collectFrom([utxo]);

        // Mint the assets
        tx = tx.mintAssets(toMint, Data.to("Mint", FractionTokenFractionToken.rdmr));

        let lockAssets = toLock
        lockAssets[beaconToken] = BigInt(1)

        // Attach the spending validator and the minting policy
        tx = tx.attachMintingPolicy(policy);
        console.log("Datum", datum)
        tx = tx.payToContract(contractAddress, {inline: datum}, lockAssets).payToAddress(await lucid.wallet.address(), { [fractionToken]: fractions })

        // Sign and submit the transaction
        console.log("tx", await tx.toString())
        const txC = await tx.complete();
        const txS = await txC.sign().complete();
        const txHash = await txS.submit();

        return { tx: txHash, policy: policyId };
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export const unlockNft = async (lucid: Lucid, fractionTokenPolicy: string, fractionTokenName: string) => {
    try {

        // First we must find the UTxO with the fractionTokenBeacon. - TODO use our own stake key
        const contractAddress = lucid.utils.validatorToAddress(validator, stakeCred)
        const contractUtxos = await lucid.utxosAt(contractAddress)
        const contractUtxosWithBeacon = contractUtxos.filter((v) => {
            const assets = v.assets
            const amountOfAsset = assets[`${fractionTokenPolicy}${'626561636f6e'}`] // Returns 0 when not present hopefully?
            return amountOfAsset > BigInt(0)
        })
        if (contractUtxosWithBeacon.length != 1) {
            throw "The locked UTxO was not found."
        }
        let contractUtxo = contractUtxosWithBeacon[0]

        const contractDatum = Data.from(contractUtxo.datum || "", FractionLockSpend.datum)

        let tx = lucid.newTx()
        const vCred: [string] = [lucid.utils.validatorToScriptHash(validator)];
        const sCred: [string] = [stakeCred.hash];
        const ssCred: [{ VerificationKeyCredential: [string] }] = [{ VerificationKeyCredential: sCred }]
        const scriptAddress = {
            paymentCredential: { ScriptCredential: vCred },
            stakeCredential: { Inline: ssCred }
        };
        const policy = new FractionTokenFractionToken(scriptAddress, fractionTokenName, contractDatum.outputRef)
        const validatorAddress = lucid.utils.validatorToAddress(validator)
        const fracadaToken = `${lucid.utils.mintingPolicyToId(policy)}${fractionTokenName}`

        // Get UTxOs with fraction token present. 
        const userUtxos = await lucid.wallet.getUtxos()
        let fullAmount = BigInt(0)
        const withPolicy = userUtxos.filter((v) => {
            const assets = v.assets
            const amountOfAsset = assets[fracadaToken] || BigInt(0) // Returns 0 when not present hopefully?
            fullAmount = BigInt(fullAmount) + BigInt(amountOfAsset)
            return amountOfAsset > BigInt(0)
        })
        if (contractDatum.amount != fullAmount) {
            throw "The amount of fractions does not match the amount of fractions locked."
        }

        const toBurn: Assets = {
            [fracadaToken]: BigInt(0) - fullAmount,
            [`${fractionTokenPolicy}${'626561636f6e'}`]: BigInt(0-1)
        }

        tx = tx.collectFrom([contractUtxo], Data.void())
            .collectFrom(withPolicy)
            .mintAssets(toBurn, Data.to("Burn", FractionTokenFractionToken.rdmr))
            .attachSpendingValidator(validator)
            .attachMintingPolicy(policy)

        // Sign and submit
        let txC = await tx.complete()
        let txS = await txC.sign().complete()
        let txHash = await txS.submit()
        return txHash
    } catch (e) {
        console.log(e)
        throw e
    }
}
