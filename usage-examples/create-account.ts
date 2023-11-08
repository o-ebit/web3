
import Web3 from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork/mod.ts'

const providerURL = Deno.args[0]

const web3 = new Web3(new (Web3 as any).providers.HttpProvider(providerURL))

const newAccount = await (web3 as any).eth.accounts.create()

console.log(newAccount)