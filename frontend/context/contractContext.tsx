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
import axios from '../utils/axios'
interface IContract {
  login: () => Promise<string | void>
  data: string
}

export const ContractContext = createContext<IContract>({
  login: async () => {},
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

  const login = async () => {
    if (!window.ethereum) return console.log('Please install metamask')
    try {
      const accounts = (
        await window!.ethereum!.request({ method: 'eth_accounts' })
      )[0]
      const response = await axios
        .post(
          'http://localhost:3333/auth/getsignmessage',
          { address: accounts },
          {
            withCredentials: true,
          }
        )
        .catch((err) => {
          console.log(err)
        })

      console.log('response', response)
      if (response && response.data) {
        const { message } = response.data
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        )
        const signer = provider.getSigner()
        const signedMessage = await signer.signMessage(message)
        console.log(signedMessage)

        const response2 = await axios
          .post(
            'http://localhost:3333/auth/loginverifymessage',
            { signature: signedMessage },
            {
              withCredentials: true,
            }
          )
          .catch((err) => {
            console.log(err)
          })

        console.log('response2', response)

        localStorage.setItem('user', accounts)
        alert('login passss')

        const response3 = await axios
          .get('http://localhost:3333/auth/getme', {
            withCredentials: true,
          })
          .catch((err) => {
            console.log(err)
          })

        console.log('response3', response3)
      }

      // const contract = getContract()
      // const transactionHash = await contract.addNumber()
      // console.log(transactionHash.hash)
      // await transactionHash.wait()
      // alert(`Tx : ${transactionHash.hash}`)
      // return transactionHash.hash
    } catch (error: any) {
      // throw new Error(error.reason)
      console.log(error)
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
        login,
        data,
      }}
    >
      {!initialLoading && children}
    </ContractContext.Provider>
  )
}
