---
marp: true
theme: default
size: 16:9
---

# EthCC 6 - Building with purpose, building for all

Speaker: Arthur Gousset
Date: Thu, Jul 20 2023

---

## Agenda

+	User-friendly gas currencies (viem, feeCurrency)
+	User-friendly account discovery (SocialConnect)

---
# Part 1: Alternative gas currencies

---
## Crypto-native UX

Before:

1.	User wants to acquire NFT for $10
1.	User onboards with fiat (e.g. credit card) and expects to pay $10
1. 	User gets 10 USD stablecoin
1.	User expects to transfers 10 USD stablecoin for NFT but must pay gas in native token
1. 	User must acquire native token to pay gas (swap, exchange, buy extra token to pay gas)
1. 	User transfers $10, pays gas in native token and is left with dust in native token

---
## User-friendly UX

After:

1.	User wants to acquire NFT for $10
1.	User onboards with fiat (e.g. credit card) and expects to pay $10
1. 	User gets 10 USD stablecoin
1.	User transfers 10 USD stablecoin for NFT and pays gas in stablecoin
1. 	User transfers $10, pays gas in stablecoin and is left with no dust

---
## How?

+	`feeCurrency` transaction field on Celo blockchain
+	`viem` SDK
+	cUSD (\$), cREAL (R\$), or cEUR (€) fee currencies on Celo

---
## Example

```ts
import 'viem' from "viem"
import { celo } from "viem/chains"
import { stableTokenABI } from "@celo/abis"
```

```ts
const transaction = {
    from: account.address,
    to,
    value: parseEther(value),
    feeCurrency: FEE_CURRENCIES["cusd"],
  }
```

```ts
const FEE_CURRENCIES = {
  cusd: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  creal: "0xE4D517785D091D3c54818832dB6094bcc2744545",
  ceur: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
}
```

---
## Demo

Run `yarn demo` to make demo transaction.

Notes-to-self (REMOVE BEFORE TALK):

-	Show sender balance before
-	Make transaction (using script)
-	Show sender balance after
-	Open celoscan or celo explorer to see transaction

---

# Part 2: SocialConnect