import { useContext } from "react"
import { useAccount } from "wagmi"
import { ContractContext } from "../context/contractContext"
import useIsMounted from "../hooks/useIsMounted"
interface Props {}

function index({}: Props) {
 
 const { sendTxFaucet,data } = useContext(ContractContext)
 const {address} = useAccount()
 const mounted = useIsMounted();
  return (
    <div>
      <h1>NFT</h1>
      <p> {mounted ? `My Address ${address}` : 'No Address'}</p>
      <button
        className="bg-red-500 px-3  py-2 rounded-md"
        onClick={sendTxFaucet}
      >
        Test Tx Faucet
      </button>
      <p>Data : {data}</p>
    </div>
  )
}

export default index