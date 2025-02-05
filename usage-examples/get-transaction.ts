
import Web3 from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork/mod.ts'

const providerURL = Deno.args[0]

const web3 = new Web3(new (Web3 as any).providers.HttpProvider(providerURL))

const transactionHash = "0x0d558d490c89fc94ddfebd284e39da5c1bcff15d18c4e9fd2eb37a202d20c703"

const transaction = (await (web3.eth as any).getTransaction(transactionHash))

console.log(transaction)