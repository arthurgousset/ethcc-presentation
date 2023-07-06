import {
  createWalletClient,
  http,
  parseEther,
  getContract,
  createPublicClient,
} from "viem"
import { celo, celoAlfajores } from "viem/chains"
import { stableTokenABI } from "@celo/abis"

async function send({ to, value }) {
  const privateKey = process.env.PK

  const account = privateKeyToAccount(privateKey)
  const client = createWalletClient({
    account,
    chain: celoAlfajores,
    transport: http(),
  })

  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  })

  console.log("EOA:", account.address)

  const transaction = {
    from: account.address,
    to,
    value: parseEther(value),
    feeCurrency: FEE_CURRENCIES_ALFAJORES["cusd"],
  }

  console.log("Sending Transaction:", transaction)

  const hash = await client.sendTransaction(transaction)

  console.info("Transaction hash:", hash)
}

function selectFeeCurrency(publicClient) {
  const balances = Promise.all(
    Object.entries(FEE_CURRENCIES_ALFAJORES).map(async ([token, address]) => {
      const balance = await publicClient.readContract({
        address,
        abi: stableTokenABI,
        functionName: "balanceOf",
        args: [account.address],
      })

      return { token, balance }
    })
  )

  balances.sort((a, b) => b.balance - a.balance)
}

const FEE_CURRENCIES_ALFAJORES = {
  cusd: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  creal: "0xE4D517785D091D3c54818832dB6094bcc2744545",
  ceur: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
}
