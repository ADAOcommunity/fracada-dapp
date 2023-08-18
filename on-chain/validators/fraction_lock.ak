use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{OutputReference, ScriptContext, Transaction, find_input}
use aiken/transaction/value.{AssetName,
  PolicyId, from_minted_value, quantity_of}
use types.{Datum}

/// A simple validator which requires a specific amount of the given asset to be burnt.
///
/// - Datum contains asset policy, name, and amount.
///
validator {
  fn spend(datum: Datum, _redeemer: Data, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    let Transaction { mint, .. } = transaction
    let amount = datum.amount
    let policyId = datum.burn_policy
    let assetName = datum.burn_name
    let burn_amount = 0 - amount
    burn_amount == quantity_of(from_minted_value(mint), policyId, assetName) && -1 == quantity_of(
      from_minted_value(mint),
      policyId,
      "beacon",
    )
  }
}
