import React, { createContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import artifactContract from '../artifacts/contract.json'
import { Contract } from '../utils/contractAddress'
import {
  toEtherandFixFloatingPoint,
  toWei,
  toEther,
  toEtherFloatingPoint,
  toFixUnits,
} from '../utils/UnitInEther'

interface IContract {
  sendTxFaucet: () => Promise<string | void>
  data: string
}

export const ContractContext = createContext<IContract>({
  sendTxFaucet: async () => {},
  data: '',
})

interface ChildrenProps {
  children: React.ReactNode
}

export const ContractProvider = ({ children }: ChildrenProps) => {
  const [initialLoading, setInitialLoading] = useState(true)

  const [data, setData] = useState('')

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(Contract, artifactContract.abi, signer)

    return contract
  }

  useEffect(() => {
    if (!window.ethereum) return alert('Please install metamask')
    // queryData()
    setInitialLoading(false)
  }, [])

  const sendTxFaucet = async () => {
    if (!window.ethereum) return console.log('Please install metamask')
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any)
      const signer = provider.getSigner()
      const signedMessage = await signer.signMessage(
        `Please sign this message for login in sphere exchange 
    address : 0x77db4C729494bDD1D5bB9aE64750FF52s3f4ed2ee nonce: 1695674655751`
      )
      console.log(signedMessage)
      // const contract = getContract()
      // const transactionHash = await contract.addNumber()
      // console.log(transactionHash.hash)
      // await transactionHash.wait()
      // alert(`Tx : ${transactionHash.hash}`)
      // return transactionHash.hash
    } catch (error: any) {
      // throw new Error(error.reason)
      alert(error)
    }
  }

  const queryData = async () => {
    if (!window.ethereum) return console.log('Please install metamask')
    try {
      const contract = getContract()
      const getData = await contract.getNumber()
      setData(toFixUnits(getData, '0'))
    } catch (error: any) {
      // throw new Error(error.reason)
      alert(error)
    }
  }
  return (
    <ContractContext.Provider
      value={{
        sendTxFaucet,
        data,
      }}
    >
      {!initialLoading && children}
    </ContractContext.Provider>
  )
}
