use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction.{OutputReference}
use aiken/transaction/credential.{Script, VerificationKey}
use aiken/transaction/value.{AssetName, PolicyId}

// use aiken/transaction/value

pub type Action {
  Mint
  Burn
}

pub type Datum {
  /// The burn policy is both the token required for unlocking the UTxO, as well as a beacon token policy.
  burn_policy: PolicyId,
  burn_name: AssetName,
  amount: Int,
  output_ref: OutputReference,
}
