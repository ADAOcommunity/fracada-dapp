use aiken/dict
use aiken/list
use aiken/transaction.{OutputReference, ScriptContext, Transaction} as tx
use aiken/transaction/credential.{Address}
use aiken/transaction/value
use types.{Datum}
use utils.{address_from_scripthash, convert_datum}

type Action {
  Mint
  Burn
}

validator(
  script_address: Address,
  token_name: ByteArray,
  utxo_ref: OutputReference,
) {
  fn fraction_token(rdmr: Action, ctx: ScriptContext) -> Bool {
    let beacon_name = "beacon"
    let ScriptContext { transaction, purpose } = ctx

    let correct_name = token_name != beacon_name

    expect tx.Mint(policy_id) = purpose
    let Transaction { inputs, mint, outputs, .. } = transaction
    let beacon_output =
      list.filter(
        outputs,
        fn(output) {
          value.quantity_of(output.value, policy_id, beacon_name) == 1
        },
      )
    let single_output_beacon = list.length(beacon_output) == 1

    let beacon_amount_minted =
      value.quantity_of(value.from_minted_value(mint), policy_id, beacon_name)
    let amount_minted =
      value.quantity_of(value.from_minted_value(mint), policy_id, token_name)
    let correct_beacon_mint = beacon_amount_minted == 1

    when rdmr is {
      Mint -> {
        expect Some(beacon_output_single) = list.head(beacon_output)
        let correct_output_address =
          beacon_output_single.address == script_address
        expect beacon_output_datum: Datum =
          convert_datum(beacon_output_single.datum)
        let correct_amount_minted = amount_minted == beacon_output_datum.amount
        let correct_output_name = beacon_output_datum.burn_name == token_name
        let correct_output_policy = beacon_output_datum.burn_policy == policy_id
        let correct_output_ref = beacon_output_datum.output_ref == utxo_ref
        expect Some(_input) =
          list.find(inputs, fn(input) { input.output_reference == utxo_ref })
        single_output_beacon? && correct_output_address? && correct_amount_minted? && correct_output_name? && correct_output_policy? && correct_output_ref? && correct_name? && correct_beacon_mint?
      }
      Burn -> amount_minted < 0
    }
  }
}
