import { ConnectButton } from '@rainbow-me/rainbowkit'

type Props = {}

function Header({}: Props) {

  return (
    <div className="sticky inset-0 z-10">
      <div className='bg-black p-2'>
          <ConnectButton
            label="connect web3"
            accountStatus={'full'}
            chainStatus={'full'}
          />
      </div>
    </div>
  )
}

export default Header
