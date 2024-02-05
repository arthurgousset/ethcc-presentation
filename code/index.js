import {
  createWalletClient,
  http,
  parseEther,
  createPublicClient,
  hexToBigInt,
} from "viem"
import { celoAlfajores } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { stableTokenABI } from "@celo/abis/types/wagmi/index.js?"
import "dotenv/config" // use to load private key for example

// for this example we send to the faucet
const FAUCET_ALFAJORES = "0x22579CA45eE22E2E16dDF72D955D6cf4c767B0eF"

// uncomment function call below to run
async function send({
  to = FAUCET_ALFAJORES,
  value = "0.1",
  isStablePay = false,
}) {
  const account = privateKeyToAccount(process.env.PK)

  // Create a wallet client that will sign the transaction
  const client = createWalletClient({
    account,
    // Passing chain is how viem knows to try serializing tx as cip42.
    chain: celoAlfajores,
    transport: http(),
  })

  console.log("EOA:", account.address)

  const hash = isStablePay ? sendStable() : sendBasic()

  // viem uses a different client for reads
  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  })
  try {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: await hash,
    })
    console.info("Transaction receipt:", receipt)
  } catch (e) {
    console.error("Failed to get receipt", e)
  }

  // A basic send can be done like this
  async function sendBasic() {
    // Transaction Object conforming to viem's SendTransactionParameters<typeof celo> type
    // This is ending native CELO but paying with CUSD
    const price = await getGasPrice(client)
    const transaction = {
      to,
      value: parseEther(value),
      feeCurrency: "0xc9cce1e51F1393CE39EB722E3e59eDE6faBf89fD", // Adapter address
      maxFeePerGas: price,
      maxPriorityFeePerGas: price,
    }
    console.log("Sending Transaction:", transaction)
    const hash = await client.sendTransaction(transaction)
    console.info("Transaction hash:", hash)
    return hash
  }

  // sending stable token or any contract interaction like this
  async function sendStable() {

    const price = await getGasPrice(client)
    const hash = await client.writeContract({
      abi: stableTokenABI,
      address: "0xc9cce1e51F1393CE39EB722E3e59eDE6faBf89fD",
      functionName: "transfer",
      args: [to, parseEther(value)],
      // set the fee currency on the contract write call
      feeCurrency: "0xc9cce1e51F1393CE39EB722E3e59eDE6faBf89fD", // Adapter address
      maxFeePerGas: price,
      maxPriorityFeePerGas: price,
    })
    console.info("Transaction hash:", hash)
    return hash
  }
}

// to make sure we pay the right price for gas in the right currency
async function getGasPrice(client) {
  const priceHex = await client.request({
    method: "eth_gasPrice",
    params: ["0xc9cce1e51F1393CE39EB722E3e59eDE6faBf89fD"], // Adapter address
  })
  return hexToBigInt(priceHex)
}

send({ isStablePay: true }) // send stable token
// send({ isStablePay: false }) // send native CELO
console.log("DONE")
