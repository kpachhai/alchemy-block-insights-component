import { Alchemy, Network } from 'alchemy-sdk'

export default async function handler(req, res) {
  // parse the blockHash and chain from the request body
  const { blockHash, chain } = JSON.parse(req.body)

  // check if the request method is POST
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  // set the settings for Alchemy SDK
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network[chain]
  }

  // create an instance of the Alchemy SDK
  const alchemy = new Alchemy(settings)

  try {
    const params = {
      blockHash
    }

    // fetch the transaction receipts using the Alchemy SDK
    const txReceipts = await alchemy.core.getTransactionReceipts(params)

    // send the array of token balances as a JSON response
    res.status(200).json(txReceipts.receipts)
  } catch (e) {
    console.warn(e)
    res.status(500).send({
      message: 'something went wrong, check the log in your terminal'
    })
  }
}
