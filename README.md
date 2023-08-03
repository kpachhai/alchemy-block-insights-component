# Block Insights Component for Web3 DApp

The Block Insights component is a useful dashboard that provides detailed insights into specific blocks on the Ethereum blockchain. By entering a block hash, users can view transactions within the block, including details such as transaction hash, gas used, sender and receiver. More details can be added such as decoded contract data.

## Requirements

- Node.js
- npm or yarn
- A Web3 provider like MetaMask
- Alchemy API key. Go to [https://auth.alchemy.com/?a=create-web3-dapp](https://auth.alchemy.com/?a=create-web3-dapp) to get your API key

## Pre-Requisite

1. **Install create-web3-dapp:**
   `npx create-web3-dapp@latest`
   Please refer to [https://docs.alchemy.com/docs/create-web3-dapp](https://docs.alchemy.com/docs/create-web3-dapp) for more information.

2. **Navigate to the project directory:**
   `cd your-project-folder`

3. **Install the required dependencies:**
   `yarn install` or `npm install`

## Block Insights Dashboard

### Step 1: Add Dependencies

Make sure you have the following dependencies installed in your project:

`yarn add alchemy-sdk`

### Step 2: Add the CSS File

Create a file named BlockInsights.css within your styles directory (styles/) and add the following styling:

```
.block-insights {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  font-family: Arial, sans-serif;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}

.search-bar input {
  flex-grow: 1;
  padding: 5px;
  border-radius: 3px;
}

.search-bar button {
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.transaction-receipt {
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.transaction-receipt a {
  text-decoration: none;
  color: #007bff;
}

.transaction-receipt a:hover {
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.pagination button {
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
}

.pagination button:hover {
  background-color: #0056b3;
}

.transaction-details {
  display: flex;
  flex-wrap: wrap;
}

.transaction-details p {
  flex: 1 1 50%;
}
```

### Step 3: Add the API Handler

Create a file named blockInsights.js within your API directory (pages/api/) and add the following code:

```
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
```

### Step 4: Create the Block Insights Component

Create a file named BlockInsights.js within your components directory (components/) and add the following code:

```
import { Utils } from 'alchemy-sdk'
import React from 'react'
import '../styles/BlockInsights.css'

export default function BlockInsights() {
  const [isLoading, setIsloading] = React.useState(false)
  const [blockInput, setBlockInput] = React.useState('')
  const [hasSearched, setHasSearched] = React.useState(false)
  const [receipts, setReceipts] = React.useState([])
  const [page, setPage] = React.useState(0)
  const itemsPerPage = 10

  const handleSearch = async () => {
    setIsloading(true)
    setHasSearched(true)
    const res = await fetch('/api/blockInsights', {
      method: 'POST',
      body: JSON.stringify({ blockHash: blockInput })
    })

    const txReceipts = await res.json()
    setReceipts(txReceipts)
    setIsloading(false)
  }

  const transactionsToShow = receipts
    ? receipts.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
    : []

  return (
    <div className='block-insights'>
      <h1>Block Insights</h1>
      {transactionsToShow.length > 0 && (
        <p>Total transactions in block: {receipts.length}</p>
      )}

      <div className='search-bar'>
        <input
          type='text'
          placeholder='Enter block hash'
          value={blockInput}
          onChange={(e) => setBlockInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {transactionsToShow.length > 0 ? (
        transactionsToShow.map((receipt, index) => (
          <div key={index} className='transaction-receipt'>
            <div className='transaction-details'>
              <p>
                Transaction Hash:
                <a
                  href={`https://etherscan.io/tx/${receipt.transactionHash}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {receipt.transactionHash}
                </a>
              </p>
              <p>Gas Used: {Utils.formatEther(receipt.gasUsed)} Eth</p>
              <p>
                From:{' '}
                <a
                  href={`https://etherscan.io/address/${receipt.from}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {receipt.from}
                </a>
              </p>
              <p>
                To:{' '}
                <a
                  href={`https://etherscan.io/address/${receipt.to}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {receipt.to}
                </a>
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>
          {isLoading
            ? 'Loading...'
            : hasSearched && receipts.length === 0
            ? 'No transactions found.'
            : ''}
        </p>
      )}
      <div className='pagination'>
        {page > 0 && (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        )}
        {transactionsToShow.length === itemsPerPage && (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>
    </div>
  )
}
```

### Step 5: Include the Component in Your App

You can now use the <BlockInsights /> component within your DApp like any other React component:

```
import BlockInsights from './components/BlockInsights'

function App() {
  return (
    <div>
      <BlockInsights />
      {/* Other components */}
    </div>
  )
}
```

## Conclusion

You have now successfully integrated the Block Insights component into your Web3 DApp. Users can search for specific blocks using a block hash, and the component will display detailed information about each transaction within that block.
