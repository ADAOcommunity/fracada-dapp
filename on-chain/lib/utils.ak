use aiken/dict
use aiken/interval.{Finite, NegativeInfinity, PositiveInfinity}
use aiken/list
use aiken/transaction.{
  Datum, DatumHash, InlineDatum, NoDatum, Output, OutputReference, ScriptContext,
  Transaction,
} as tx
use aiken/transaction/credential.{
  Address, Inline, PaymentCredential, ScriptCredential,
  VerificationKeyCredential, from_verification_key,
}
use aiken/transaction/value.{Value, merge, zero}

/// function to convert validator script hash into validator address
pub fn address_from_scripthash(script_hash: ByteArray, stake_hash: ByteArray) {
  Address {
    payment_credential: ScriptCredential(script_hash),
    stake_credential: Some(Inline(VerificationKeyCredential(stake_hash))),
  }
}

pub fn convert_datum(datum: tx.Datum) -> Data {
  trace @"convert_datum"
  when datum is {
    NoDatum -> {
      trace @"NoDatum"
      fail
    }
    DatumHash(_) -> {
      trace @"DatumHash"
      fail
    }
    InlineDatum(d) -> {
      trace @"InlineDatum"
      d
    }
  }
}
