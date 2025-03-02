import { useState, useEffect } from 'react';
// import {
//   useAccount,
//   useContract,
//   useSigner,
//   useBalance,
//   useNetwork,
//   useSwitchNetwork,
// } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import {
  mintNFT,
  hasEnoughFundsToMint,
  isRunningMintProcess,
  MINT_STAGES,
} from './utils/web3.ts';
import { pinNFTDataToIPFS, createAttributesMetadataArray } from './utils/ipfs';
import { useUIStore, useBlobStore } from '../../../store';
import Button from '../Button/Button.tsx';

import s from './CardButton.module.scss';

const CONTRACT_ADDRESS = import.meta.env.REACT_APP_DEPLOYED_CONTRACT_ADDRESS;

const CardButton = ({ mintStage, setMintStage, setHasEnoughFunds }) => {
  // const { chain, chains } = useNetwork();
  // const { switchNetwork } = useSwitchNetwork();
  // const { data: signer } = useSigner();
  // const { address } = useAccount();
  // const { data: balance } = useBalance({
  //   addressOrName: address || '',
  //   watch: true,
  // });
  // const { openConnectModal } = useConnectModal();
  // const contract = useContract({
  //   addressOrName: CONTRACT_ADDRESS,
  //   contractInterface: {} as any,
  //   signerOrProvider: signer,
  // });

  // const [triggered, setTriggered] = useState(false);
  // const [IPFSTokenURI, setIPFSTokenURI] = useState('');

  // const blobStore = useBlobStore();
  // const videoBlob = useUIStore((s) => s.videoBlob);

  // const setMintError = () => {
  //   setMintStage(MINT_STAGES.ERROR_RETRY);
  // };

  // const connectAndMint = async () => {
  //   const videoFile = new File([videoBlob], 'blob', { type: videoBlob.type });

  //   if (chain?.unsupported) {
  //     switchNetwork(chains[0]?.id);
  //   }

  //   if (!hasEnoughFundsToMint(balance.formatted)) {
  //     setMintStage(MINT_STAGES.ERROR_RETRY);
  //     setHasEnoughFunds(false);
  //     return console.error('Error: not enough funds for minting');
  //   } else setHasEnoughFunds(true);

  //   setMintStage(MINT_STAGES.CONNECTING);

  //   let tokenURI = '';

  //   if (IPFSTokenURI) {
  //     tokenURI = IPFSTokenURI;
  //     setMintStage(MINT_STAGES.WAITING_CONFIRMATION);
  //   } else {
  //     const result = await pinNFTDataToIPFS(
  //       videoFile,
  //       createAttributesMetadataArray(blobStore)
  //     );

  //     tokenURI = result;
  //     if (tokenURI === null) return setMintError();
  //     useBlobStore.setState({ currentNumberOfTokens: result.counter });

  //     setMintStage(MINT_STAGES.WAITING_CONFIRMATION);
  //     setIPFSTokenURI(tokenURI);
  //     setMintStage(MINT_STAGES.WAITING_CONFIRMATION);
  //   }

  //   const onMintStart = () => setMintStage(MINT_STAGES.MINTING);
  //   const { success } = await mintNFT(contract, address, tokenURI, onMintStart);

  //   if (success) {
  //     setMintStage(MINT_STAGES.MINTED);
  //   } else {
  //     setMintStage(MINT_STAGES.ERROR_RETRY);
  //   }
  // };

  // /* STEP 2. Since address + balance + signer can take awhile before showing up,
  //  * use this hook to call `connectAndMint` when everything is in place.
  //  */
  // useEffect(() => {
  //   if (address && balance && signer && triggered) {
  //     setTriggered(false); // reset trigger
  //     setMintStage(MINT_STAGES.CONNECTING_WALLET);
  //     connectAndMint();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setMintStage, address, balance, signer, setTriggered, triggered]);

  // /* STEP 1. Mark as triggered and open connect modal if user is not connected. */
  // const initialize = async (event) => {
  //   event.preventDefault();

  //   useUIStore.setState(() => ({ donationInformationOpen: false }));
  //   useUIStore.setState(() => ({ isBuyNowClicked: true }));

  //   if (isRunningMintProcess(mintStage)) return;

  //   if (!address || !balance) openConnectModal();
  //   setTriggered(true);
  // };

  // const disabled = isRunningMintProcess(mintStage);

  // function renderButtonLabel() {
  //   if (
  //     [
  //       MINT_STAGES.CONNECTING,
  //       MINT_STAGES.WAITING_CONFIRMATION,
  //       MINT_STAGES.MINTING,
  //     ].includes(mintStage)
  //   ) {
  //     return 'Minting for';
  //   } else if (mintStage === MINT_STAGES.MINTED) {
  //     return 'Minted for';
  //   } else {
  //     return 'Mint now';
  //   }
  // }

  return (
    // <Button disabled={disabled} variant="secondary" onClick={initialize}>
    //   <span className={s.buttonCta}>
    //     {renderButtonLabel()}
    //     <CryptocoinIcon flat={disabled} />
    //     {import.meta.env.REACT_APP_MIN_DONATION_VALUE}
    //   </span>
    // </Button>
    <></>
  );
};

const CryptocoinIcon = ({ flat = false }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1598_2865)">
      <path
        d="M6.99847 0.708984L6.91406 0.995702V9.31485L6.99847 9.39907L10.8601 7.11645L6.99847 0.708984Z"
        fill={flat ? 'currentColor' : '#AEBBCA'}
      />
      <path
        d="M7.00426 0.708984L3.14258 7.11645L7.00426 9.39907V5.36118V0.708984Z"
        fill={flat ? 'currentColor' : 'white'}
      />
      <path
        d="M6.99874 10.131L6.95117 10.1891V13.1525L6.99874 13.2913L10.8627 7.84961L6.99874 10.131Z"
        fill={flat ? 'currentColor' : '#939BA9'}
      />
      <path
        d="M7.00426 13.2913V10.131L3.14258 7.84961L7.00426 13.2913Z"
        fill={flat ? 'currentColor' : 'white'}
      />
      <path
        d="M7 9.39921L10.8616 7.1166L7 5.36133V9.39921Z"
        fill={flat ? 'currentColor' : '#939BA9'}
      />
      <path
        d="M3.14258 7.1166L7.00426 9.39921V5.36133L3.14258 7.1166Z"
        fill={flat ? 'currentColor' : '#BECDDC'}
      />
    </g>
    <defs>
      <clipPath id="clip0_1598_2865">
        <rect
          width="12.5816"
          height="12.5816"
          fill={flat ? 'currentColor' : 'white'}
          transform="translate(0.708984 0.708984)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default CardButton;
