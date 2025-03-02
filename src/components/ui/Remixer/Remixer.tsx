import { useEffect, useState, useLayoutEffect } from 'react';
import copy from 'copy-to-clipboard';
import qs from 'query-string';
import { useNavigate } from 'react-router-dom';
import { useControl } from 'react-three-gui';
// import { ethers } from 'ethers';

import { updateBlobState, useBlobStore, useUIStore } from '../../../store';
import Button from '../Button/Button.tsx';

import s from './Remixer.module.scss';
import NftsAvailableOverlay from './../Overlay/NftsAvailable/NftsAvailable.tsx';

const LABEL_SHARE = 'Copy URL';
const LABEL_COPIED = 'URL copied';

const MAX_NUMBER_OF_TOKENS = parseInt(
  import.meta.env.REACT_APP_MAX_NUMBER_OF_TOKENS
);

function copyToClipboard() {
  const query = useBlobStore.getState();
  const path = qs.stringify(query, { skipNull: true, arrayFormat: 'index' });
  copy(
    window.location.protocol + '//' + window.location.host + '/view?' + path
  );
}

const getCounterValue = async () => {
  // const provider = ethers.getDefaultProvider(
  //   import.meta.env.REACT_APP_DEFAULT_PROVIDER
  // );
  // const instance = await new ethers.Contract(
  //   import.meta.env.REACT_APP_DEPLOYED_CONTRACT_ADDRESS || '',
  //   {} as any,
  //   provider
  // );
  // const response = await instance.getCounter();

  // return parseInt(response._hex);
  return 0;
};

const Remixer = () => {
  const navigate = useNavigate();
  const [shareLabel, setShareLabel] = useState(LABEL_SHARE);
  const currentNumberOfTokens = useUIStore((s) => s.currentNumberOfTokens);
  const isNftsAvailabeOpen = useUIStore((s) => s.nftsAvailabeOpen);
  const [finalMintTimestamp, setFinalMintTimestamp] = useState(0);

  const availableNFT = MAX_NUMBER_OF_TOKENS - currentNumberOfTokens;
  const totalNFT = MAX_NUMBER_OF_TOKENS;

  useControl(`${shareLabel}`, {
    type: 'button',
    onClick: () => {
      copyToClipboard();
      setShareLabel(LABEL_COPIED);
    },
  });

  useEffect(() => {
    let timer;
    if (shareLabel !== LABEL_SHARE) {
      timer = setTimeout(() => setShareLabel(LABEL_SHARE), 3000);
    }
    return () => clearTimeout(timer);
  }, [shareLabel]);

  useEffect(() => {
    // update blob if there are query params (history nav)
    window.location.search && updateBlobState();
    document.documentElement.classList.add('remix');

    useUIStore.setState(() => ({
      showControls: true,
      isRemix: true,
      recordingProgress: -1,
      isRecording: false,
    }));

    fetchNumberOfTokens();
    getFinalMintTime();

    return () => {
      useUIStore.setState(() => ({ showControls: false, isRemix: false }));

      document.documentElement.classList.remove('remix');
    };
  }, []);

  const fetchNumberOfTokens = async () => {
    const counter = await getCounterValue();
    useUIStore.setState(() => ({ currentNumberOfTokens: counter }));
  };

  const getFinalMintTime = async () => {
    // const provider = ethers.getDefaultProvider(
    //   import.meta.env.REACT_APP_DEFAULT_PROVIDER
    // );
    // const instance = await new ethers.Contract(
    //   import.meta.env.REACT_APP_DEPLOYED_CONTRACT_ADDRESS || '',
    //   BlobmixerContract.abi,
    //   provider
    // );
    // const response = await instance.getFinalMintTime();
    // setFinalMintTimestamp(parseInt(response._hex));
  };

  const noMoreBlobsToMint = currentNumberOfTokens === totalNFT;

  return (
    <>
      {currentNumberOfTokens >= 0 && !isNftsAvailabeOpen && (
        <button
          className={s.remainingTokensHeader}
          onClick={() =>
            noMoreBlobsToMint && useUIStore.setState(() => ({ nftsAvailabeOpen: true }))
          }
          disabled={currentNumberOfTokens !== totalNFT}
        >
          {noMoreBlobsToMint
            ? `${currentNumberOfTokens} blobs have been minted`
            : `${availableNFT}/${totalNFT} NFTs available`}
        </button>
      )}

      <NftsAvailableOverlay finalMintTimestamp={finalMintTimestamp} />

      <div className={s.toolbar}>
        <Button
          onClick={() => navigate('/export' + window.location.search)}
          disabled={noMoreBlobsToMint}
        >
          <NFTIcon fill={noMoreBlobsToMint} />
          Own as NFT
        </Button>
      </div>
    </>
  );
};

const NFTIcon = ({ fill = false }) => (
  <svg
    className={s.buttonIcon}
    viewBox="0 0 15 16"
    fill={fill ? 'currentColor' : 'none'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5 8V8.7094C14.3612 8.72651 14.1973 8.75106 14.0137 8.78631C13.4386 8.89673 12.6616 9.11385 11.8583 9.54267C10.304 10.3724 8.69246 11.9763 8.23132 15H7.5H6.76838C6.30673 11.99 4.6951 10.3871 3.14258 9.55438C2.33979 9.12381 1.56318 8.9038 0.988367 8.79093C0.803841 8.7547 0.639193 8.72933 0.5 8.71157V8V7.2906C0.638778 7.27349 0.802712 7.24894 0.986313 7.21369C1.5614 7.10327 2.33845 6.88615 3.14172 6.45733C4.69597 5.62762 6.30754 4.02366 6.76868 1H7.5H8.23132C8.69246 4.02366 10.304 5.62762 11.8583 6.45733C12.6616 6.88615 13.4386 7.10327 14.0137 7.21369C14.1973 7.24894 14.3612 7.27349 14.5 7.2906V8Z"
      stroke="currentColor"
    />
  </svg>
);

export default Remixer;
