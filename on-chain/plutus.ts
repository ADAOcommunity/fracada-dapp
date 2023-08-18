// deno-lint-ignore-file
import {
  applyParamsToScript,
  Data,
  Validator,
} from "https://deno.land/x/lucid@0.10.4/mod.ts";

export interface FractionLockSpend {
  new (): Validator;
  datum: {
    burnPolicy: string;
    burnName: string;
    amount: bigint;
    outputRef: { transactionId: { hash: string }; outputIndex: bigint };
  };
  _redeemer: Data;
}

export const FractionLockSpend = Object.assign(
  function () {
    return {
      type: "PlutusV2",
      script:
        "5903e301000032323232323232323232323222232533300932323232323232323232323232323232323232323232533301f3370e012666008600201a016014266e1d2001333004300100d00b488106626561636f6e0014a0466004002911003001001222533302300214bd6f7b630099191919299981199b8f0050011003133028337606ea4004dd30011998038038018029bae302400337566048004604e006604a004444646464a66604266e1d20020011480004c8dd69814000980f801180f80099299981019b8748008004530103d87a800013232330080010053756604e002603c004603c0026600c0060046002002444a666040004298103d87a800013232323253330203371e00a002266e95200033025375000497ae01333007007003005375c60420066eb4c084008c09000cc088008c0040048894ccc078008530103d87a8000132323232533301e3371e00a002266e95200033023374c00497ae01333007007003005375c603e0066eacc07c008c08800cc080008cdc0a40000066eb8cc044c04c0352002375c66020602401890001bad3300f301100b48010dd5980c000980c000980b800980b000980a800980580198090009809001180800098038010a4c2c6400864a66601266e1d20000011323232323232323253330153018002132498c94ccc048cdc3a4000002264646464a666034603a0042649319299980b99b87480000044c8c94ccc074c080008526153301a491334c6973742f5475706c652f436f6e73747220636f6e7461696e73206d6f7265206974656d73207468616e2065787065637465640016375c603c002602a0082a660309212b436f6e73747220696e64657820646964206e6f74206d6174636820616e7920747970652076617269616e740016301500315330174901334c6973742f5475706c652f436f6e73747220636f6e7461696e73206d6f7265206974656d73207468616e2065787065637465640016375a60360026036004603200260200042a660269212b436f6e73747220696e64657820646964206e6f74206d6174636820616e7920747970652076617269616e740016301000115330124901334c6973742f5475706c652f436f6e73747220636f6e7461696e73206d6f7265206974656d73207468616e206578706563746564001630160013016002375a602800260280046eb8c048004c048008dd7180800098038020a9980524812b436f6e73747220696e64657820646964206e6f74206d6174636820616e7920747970652076617269616e740016300700333001001480008888cccc01ccdc38008018069199980280299b8000448008c03c0040080088c018dd5000918021baa0015734ae7155ceaab9e5573eae815d0aba21",
    };
  },
  {
    datum: {
      "title": "Datum",
      "anyOf": [{
        "title": "Datum",
        "dataType": "constructor",
        "index": 0,
        "fields": [
          { "dataType": "bytes", "title": "burnPolicy" },
          { "dataType": "bytes", "title": "burnName" },
          { "dataType": "integer", "title": "amount" },
          {
            "title": "outputRef",
            "description":
              "An `OutputReference` is a unique reference to an output on-chain. The `output_index`\n corresponds to the position in the output list of the transaction (identified by its id)\n that produced that output",
            "anyOf": [{
              "title": "OutputReference",
              "dataType": "constructor",
              "index": 0,
              "fields": [{
                "title": "transactionId",
                "description":
                  "A unique transaction identifier, as the hash of a transaction body. Note that the transaction id\n isn't a direct hash of the `Transaction` as visible on-chain. Rather, they correspond to hash\n digests of transaction body as they are serialized on the network.",
                "anyOf": [{
                  "title": "TransactionId",
                  "dataType": "constructor",
                  "index": 0,
                  "fields": [{ "dataType": "bytes", "title": "hash" }],
                }],
              }, { "dataType": "integer", "title": "outputIndex" }],
            }],
          },
        ],
      }],
    },
  },
  { _redeemer: { "title": "Data", "description": "Any Plutus data." } },
) as unknown as FractionLockSpend;

export interface FractionTokenFractionToken {
  new (
    scriptAddress: {
      paymentCredential: { VerificationKeyCredential: [string] } | {
        ScriptCredential: [string];
      };
      stakeCredential: {
        Inline: [
          { VerificationKeyCredential: [string] } | {
            ScriptCredential: [string];
          },
        ];
      } | {
        Pointer: {
          slotNumber: bigint;
          transactionIndex: bigint;
          certificateIndex: bigint;
        };
      } | null;
    },
    tokenName: string,
    utxoRef: { transactionId: { hash: string }; outputIndex: bigint },
  ): Validator;
  rdmr: "Mint" | "Burn";
}

export const FractionTokenFractionToken = Object.assign(
  function (
    scriptAddress: {
      paymentCredential: { VerificationKeyCredential: [string] } | {
        ScriptCredential: [string];
      };
      stakeCredential: {
        Inline: [
          { VerificationKeyCredential: [string] } | {
            ScriptCredential: [string];
          },
        ];
      } | {
        Pointer: {
          slotNumber: bigint;
          transactionIndex: bigint;
          certificateIndex: bigint;
        };
      } | null;
    },
    tokenName: string,
    utxoRef: { transactionId: { hash: string }; outputIndex: bigint },
  ) {
    return {
      type: "PlutusV2",
      script: applyParamsToScript(
        "5908ab0100003232323232323232323232322232222323232323232323232533301432323232323232323232323232323232323232323253330293370e90000008991919191919191919192999819a999819a999819a999819a999819a999819a999819a9998198078a51153303449011c73696e676c655f6f75747075745f626561636f6e203f2046616c73650014a02a666066010294454cc0d124011e636f72726563745f6f75747075745f61646472657373203f2046616c73650014a0294054ccc0cc0145288a9981a2491d636f72726563745f616d6f756e745f6d696e746564203f2046616c73650014a0294054ccc0cc0105288a9981a2491b636f72726563745f6f75747075745f6e616d65203f2046616c73650014a0294054ccc0cc00c5288a9981a2491d636f72726563745f6f75747075745f706f6c696379203f2046616c73650014a0294054ccc0cc0085288a9981a2491a636f72726563745f6f75747075745f726566203f2046616c73650014a0294054ccc0cc06c5288a9981a24914636f72726563745f6e616d65203f2046616c73650014a0294054ccc0cc0305288a9981a2491b636f72726563745f626561636f6e5f6d696e74203f2046616c73650014a02940c0c0c94ccc0cccdc3a4000606400220022a6606892012a4578706563746564206f6e20696e636f727265637420636f6e7374727563746f722076617269616e742e001633323001001222533303900214c103d87a8000132325333037300300213374a90001981e00125eb804ccc01401400400cc0f400cc0ec0080588cdd7998179818800a400005666ebccc0b4c0bc01520060293371e6eb8cc0b0c0b801120000163371e6eb8cc0acc0b400d20020283370e0106eb4cc0a8c0b0009200432533302e3370e900000089919191919191919299981d181e80109924c64a66606e66e1d2000001132323232533303f3042002132498c94ccc0f0cdc3a400000226464a666084608a0042930a9981fa49334c6973742f5475706c652f436f6e73747220636f6e7461696e73206d6f7265206974656d73207468616e2065787065637465640016375c608600260740082a6607a9212b436f6e73747220696e64657820646964206e6f74206d6174636820616e7920747970652076617269616e740016303a003153303c4901334c6973742f5475706c652f436f6e73747220636f6e7461696e73206d6f7265206974656d73207468616e2065787065637465640016375a60800026080004607c002606a0042a660709212b436f6e73747220696e64657820646964206e6f74206d6174636820616e7920747970652076617269616e740016303500115330374901334c6973742f5475706c652f436f6e73747220636f6e7461696e73206d6f7265206974656d73207468616e2065787065637465640016303b001303b002375a607200260720046eb8c0dc004c0dc008dd7181a80098160010a99817a4812b436f6e73747220696e64657820646964206e6f74206d6174636820616e7920747970652076617269616e740016302c0013253302e4910d636f6e766572745f646174756d00132533302e3370e90000008a99817a49074e6f446174756d00153302f4910c61696b656e3a3a6572726f7200161533302e3370e900100089929981824909446174756d486173680015330304910c61696b656e3a3a6572726f720016302c0021323253303149010b496e6c696e65446174756d0010013035001302c002302c00133028302a00248010cdd7998139814800a400004c6060002604e64a66605466e1d200030290011001153302b4912a4578706563746564206f6e20696e636f727265637420636f6e7374727563746f722076617269616e742e0016533302d00614c103d87a800013374a900019817181780325eb804cdc4001a4000604e03a66e1c0092002333016301300400c01f333015301200300b48906626561636f6e003370e664600200244a6660540022900009919b8048008cc00c00c004c0b4004005200233323001001222533302a00214bd700991929998141801801099816801199802802800801899980280280080198170019816001002119b873330143756660406044002900100524506626561636f6e0048008dd59814000981400098138011bac30250013025001302400237586044002603200c6eb8c080004c05d4ccc064cdc3a4000603000420042a660349212a4578706563746564206f6e20696e636f727265637420636f6e7374727563746f722076617269616e742e00163330183371e022910106626561636f6e004a0944c074004c074008c06c004c048028526162330020014881003001001222533301800214bd6f7b630099191919299980c19b8f005001100313301d337606ea4004dd30011998038038018029bae30190033756603200460380066034004444646464a66602c66e1d20020011480004c8dd6980e800980a001180a00099299980a99b8748008004530103d87a8000132323300800100537566038002602600460260026600c0060046002002444a66602a004298103d87a800013232323253330153371e00a002266e9520003301a375000497ae01333007007003005375c602c0066eb4c058008c06400cc05c008c0040048894ccc04c008530103d87a800013232323253330133371e00a002266e95200033018374c00497ae01333007007003005375c60280066eacc050008c05c00cc054008c800cc94ccc030cdc3a40000022a66602060140062930a99806a491d4578706563746564206e6f206669656c647320666f7220436f6e73747200161533300c3370e90010008a99980818050018a4c2a6601a92011d4578706563746564206e6f206669656c647320666f7220436f6e7374720016153300d4912b436f6e73747220696e64657820646964206e6f74206d6174636820616e7920747970652076617269616e740016300a002375c0026600200290001111199980399b8700100300d233330050053370000890011807800801001118031baa001230043754002ae695ce2ab9d5573caae7d5d02ba15745",
        [scriptAddress, tokenName, utxoRef],
        {
          "dataType": "list",
          "items": [
            {
              "title": "Address",
              "description":
                "A Cardano `Address` typically holding one or two credential references.\n\n Note that legacy bootstrap addresses (a.k.a. 'Byron addresses') are\n completely excluded from Plutus contexts. Thus, from an on-chain\n perspective only exists addresses of type 00, 01, ..., 07 as detailed\n in [CIP-0019 :: Shelley Addresses](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0019/#shelley-addresses).",
              "anyOf": [{
                "title": "Address",
                "dataType": "constructor",
                "index": 0,
                "fields": [{
                  "title": "paymentCredential",
                  "description":
                    "A general structure for representing an on-chain `Credential`.\n\n Credentials are always one of two kinds: a direct public/private key\n pair, or a script (native or Plutus).",
                  "anyOf": [{
                    "title": "VerificationKeyCredential",
                    "dataType": "constructor",
                    "index": 0,
                    "fields": [{ "dataType": "bytes" }],
                  }, {
                    "title": "ScriptCredential",
                    "dataType": "constructor",
                    "index": 1,
                    "fields": [{ "dataType": "bytes" }],
                  }],
                }, {
                  "title": "stakeCredential",
                  "anyOf": [{
                    "title": "Some",
                    "description": "An optional value.",
                    "dataType": "constructor",
                    "index": 0,
                    "fields": [{
                      "description":
                        "Represent a type of object that can be represented either inline (by hash)\n or via a reference (i.e. a pointer to an on-chain location).\n\n This is mainly use for capturing pointers to a stake credential\n registration certificate in the case of so-called pointer addresses.",
                      "anyOf": [{
                        "title": "Inline",
                        "dataType": "constructor",
                        "index": 0,
                        "fields": [{
                          "description":
                            "A general structure for representing an on-chain `Credential`.\n\n Credentials are always one of two kinds: a direct public/private key\n pair, or a script (native or Plutus).",
                          "anyOf": [{
                            "title": "VerificationKeyCredential",
                            "dataType": "constructor",
                            "index": 0,
                            "fields": [{ "dataType": "bytes" }],
                          }, {
                            "title": "ScriptCredential",
                            "dataType": "constructor",
                            "index": 1,
                            "fields": [{ "dataType": "bytes" }],
                          }],
                        }],
                      }, {
                        "title": "Pointer",
                        "dataType": "constructor",
                        "index": 1,
                        "fields": [{
                          "dataType": "integer",
                          "title": "slotNumber",
                        }, {
                          "dataType": "integer",
                          "title": "transactionIndex",
                        }, {
                          "dataType": "integer",
                          "title": "certificateIndex",
                        }],
                      }],
                    }],
                  }, {
                    "title": "None",
                    "description": "Nothing.",
                    "dataType": "constructor",
                    "index": 1,
                    "fields": [],
                  }],
                }],
              }],
            },
            { "dataType": "bytes" },
            {
              "title": "OutputReference",
              "description":
                "An `OutputReference` is a unique reference to an output on-chain. The `output_index`\n corresponds to the position in the output list of the transaction (identified by its id)\n that produced that output",
              "anyOf": [{
                "title": "OutputReference",
                "dataType": "constructor",
                "index": 0,
                "fields": [{
                  "title": "transactionId",
                  "description":
                    "A unique transaction identifier, as the hash of a transaction body. Note that the transaction id\n isn't a direct hash of the `Transaction` as visible on-chain. Rather, they correspond to hash\n digests of transaction body as they are serialized on the network.",
                  "anyOf": [{
                    "title": "TransactionId",
                    "dataType": "constructor",
                    "index": 0,
                    "fields": [{ "dataType": "bytes", "title": "hash" }],
                  }],
                }, { "dataType": "integer", "title": "outputIndex" }],
              }],
            },
          ],
        },
      ),
    };
  },
  {
    rdmr: {
      "title": "Action",
      "anyOf": [{
        "title": "Mint",
        "dataType": "constructor",
        "index": 0,
        "fields": [],
      }, {
        "title": "Burn",
        "dataType": "constructor",
        "index": 1,
        "fields": [],
      }],
    },
  },
) as unknown as FractionTokenFractionToken;
