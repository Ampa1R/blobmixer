// import { ethers } from 'ethers'

export const MINT_STAGES = {
  INITIALIZED: 'INITIALIZED',
  NOT_MINTED: 'NOT_MINTED',
  CONNECTING_WALLET: 'CONNECTING_WALLET',
  CONNECTING: 'CONNECTING',
  WAITING_CONFIRMATION: 'WAITING_CONFIRMATION',
  ERROR_RETRY: 'ERROR_RETRY',
  MINTING: 'MINTING',
  MINTED: 'MINTED',
}
export const CONNECTING_MESSAGES = [
  'Connecting to wallet',
  'Syncing metadata',
  'Initiating upload',
  'Preparing to mint',
]

export const MINTING_MESSAGES = [
  'Uploading your video',
  'Minting',
  'Still minting',
  'Hang tight, almost there',
]

export const hasEnoughFundsToMint = (balance) => {
  return (
    Number.parseFloat(balance) >
    Number.parseFloat(import.meta.env.REACT_APP_MIN_DONATION_VALUE)
  )
}

export const isRunningMintProcess = (mintStage) =>
  ![MINT_STAGES.NOT_MINTED, MINT_STAGES.ERROR_RETRY].includes(mintStage)

const handleReplacedTransaction = async (receipt, replacement) => {
  try {
    if (receipt.status === 1) {
      return {
        success: true,
        status: `Check out your transaction on Ether scan: https://goerlifaucet.com/tx/${receipt.transactionHash}`,
      }
    }
    return {
      success: false,
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
    }
  }
}

export const mintNFT = async (contract, address, tokenURI, onMintStart) => {
  // try {
  //   const tx = await contract.mintNFT(address, tokenURI, {
  //     value: ethers.utils.parseEther(import.meta.env.REACT_APP_MIN_DONATION_VALUE),
  //   })

  //   if (tx) {
  //     onMintStart()
  //     console.log(
  //       `We have a transaction but waiting for the receipt, check out the status on https://goerlifaucet.com/tx/${tx.hash}`
  //     )

  //     const receipt = await tx.wait()
  //     /* https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt */

  //     console.log(receipt)

  //     if (receipt.status === 1) {
  //       return {
  //         success: true,
  //         status: `Check out your transaction on Ether scan: https://goerlifaucet.com/tx/${tx.hash}`,
  //       }
  //     }
  //   }
  // } catch (error) {
  //   if (error.code === 'TRANSACTION_REPLACED')
  //     return handleReplacedTransaction(error.receipt, error.replacement)

  //   console.log(error)
  //   return {
  //     success: false,
  //     status: 'Error sending the transaction' + error.message,
  //   }
  // }
}
