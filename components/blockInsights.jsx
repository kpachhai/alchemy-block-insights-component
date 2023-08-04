import { Utils } from 'alchemy-sdk'
import { useState } from 'react'
import styles from '../styles/BlockInsights.module.css'

export default function BlockInsights({ chain }) {
  const [isLoading, setIsloading] = useState(false)
  const [blockInput, setBlockInput] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [receipts, setReceipts] = useState([])
  const [page, setPage] = useState(0)
  const itemsPerPage = 10

  const handleSearch = async () => {
    setIsloading(true)
    setHasSearched(true)
    const res = await fetch('/api/blockInsights', {
      method: 'POST',
      body: JSON.stringify({
        blockHash: blockInput,
        chain: chain ? chain : 'ETH_MAINNET'
      })
    })

    const txReceipts = await res.json()
    setReceipts(txReceipts)
    setIsloading(false)
  }

  const transactionsToShow = receipts
    ? receipts.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
    : []

  return (
    <div className={styles.block_insights}>
      <h1>Block Insights</h1>
      {transactionsToShow.length > 0 && (
        <p>Total transactions in block: {receipts.length}</p>
      )}

      <div className={styles.search_bar}>
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
          <div key={index} className={styles.transaction_receipt}>
            <div className={styles.transaction_details}>
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
      <div className={styles.pagination}>
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
