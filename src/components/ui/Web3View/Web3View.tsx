import { useState, useRef, useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useNavigate } from 'react-router-dom';
import { easeBackOut, easeBackInOut } from 'd3-ease';
import classNames from 'classnames/bind';

import useBreakpoint from '../../../lib/useBreakpoint';
import { useUIStore, useBlobStore } from '../../../store';
import {
  MINT_STAGES,
  CONNECTING_MESSAGES,
  MINTING_MESSAGES,
  isRunningMintProcess,
} from './utils/web3';
import { createAttributesMetadataArray } from './utils/ipfs';
import CardButton from './CardButton';
import Notification from '../Notification/Notification.tsx';
import BackLink from '../BackLink.tsx';
import Dots from '../Dots/Dots.tsx';
import DonationInformationOverlay from '../Overlay/DonationInformation/DonationInformation.tsx';

import s from './Web3View.module.scss';

const cn = classNames.bind(s);

const addLeadingZeros = (n, totalLength) => {
  return String(n).padStart(totalLength, '0');
};

const getBackLinkProps = (mintStage) =>
  mintStage === MINT_STAGES.MINTED
    ? {
        to: '/' + window.location.search,
        text: 'Back home',
      }
    : {
        to: '/remix' + window.location.search,
        text: 'Back',
      };

const shouldRenderBackButton = (mintStage) =>
  mintStage === MINT_STAGES.NOT_MINTED ||
  mintStage === MINT_STAGES.MINTED ||
  mintStage === MINT_STAGES.ERROR_RETRY;

const Web3View = () => {
  const [stage1AnimationFinished, setStage1AnimationFinished] = useState(false);
  const [mintStage, setMintStage] = useState(MINT_STAGES.NOT_MINTED);
  const [hasEnoughFunds, setHasEnoughFunds] = useState(true);
  const [mintingMessageIndex, setMintingMessageIndex] = useState(0);
  const [isMintAnimCardEnded, setIsMintAnimCardEnded] = useState(false);
  const [fadeCelebrateMessage1, setFadeCelebrateMessage1] = useState(false);
  const [fadeCelebrateMessage2, setFadeCelebrateMessage2] = useState(false);
  const [cardHeight, setCardHeight] = useState();

  const stage1Ref = useRef();

  const cardHeightRef = useRef();

  const isDesktop = useBreakpoint('desktop');
  const navigate = useNavigate();
  const isPortrait = window.innerHeight > window.innerWidth;

  const isDonationInformationOpen = useUIStore(
    (s) => s.donationInformationOpen
  );
  const blobStore = useBlobStore();
  const videoBlob = useUIStore((s) => s.videoBlob);
  const nextBlobNumber = useUIStore((s) => s.currentNumberOfTokens) + 1;
  const videoBlobUrl = useUIStore((s) => s.videoBlobUrl);
  const sceneScaleDown = useUIStore((s) => s.sceneScaleDown);
  const isBuyNowClicked = useUIStore((s) => s.isBuyNowClicked);
  const isPostProccessing = useUIStore((s) => s.isPostProccessing);
  const clearColor = useUIStore((s) => s.clearColor);

  useEffect(() => {
    useUIStore.setState(() => ({
      isWeb3: true,
    }));

    if (import.meta.env.NODE_ENV === 'development') {
      window.__secretGetMeta = () =>
        createAttributesMetadataArray(blobStore, true);

      // Debug success transition
      window.__secretMint = () => setMintStage(MINT_STAGES.MINTED);
    }

    return () => {
      useUIStore.setState(() => ({ isWeb3: false }));
      typeof window.__secretGetMeta === 'function' &&
        (window.__secretGetMeta = undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mintStage === MINT_STAGES.MINTED && isMintAnimCardEnded) {
      setTimeout(() => {
        useUIStore.setState(() => ({ mintAnimCardEnded: true }));
      }, 600);

      setTimeout(() => {
        setFadeCelebrateMessage1(true);
      }, 1500);

      setTimeout(() => {
        setFadeCelebrateMessage1(false);
        setFadeCelebrateMessage2(true);
      }, 6000);
    }

    return () => {
      useUIStore.setState(() => ({ mintAnimCardEnded: false }));
    };
  }, [isMintAnimCardEnded, mintStage]);

  const [{ cardRotation }, cardRotationApi] = useSpring(() => ({
    cardRotation: 0,
  }));

  const rotationValue = useRef(0);

  const draggingBind = useDrag(
    ({ movement, dragging }) => {
      const dragSpeed = isDesktop ? 0.001 : 0.003;

      const movementX = movement[0] * dragSpeed * 360;
      const rotVal = movementX + rotationValue.current;

      if (!isDonationInformationOpen) {
        if (dragging) {
          cardRotationApi.start({
            cardRotation: rotVal,
            config: config.stiff,
          });
        } else {
          // Round to closest 180 deg
          // https://stackoverflow.com/questions/29865929/what-is-the-cleanest-way-to-round-a-value-to-nearest-45-degrees
          const snapRotation = Math.round(rotVal / 180) * 180;
          rotationValue.current = snapRotation;
          cardRotationApi.start({
            cardRotation: snapRotation,
            config: config.wobbly,
          });
        }
      }
    },
    { filterTaps: true }
  );

  const [cardAnimationProps, cardAnimationApi] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(30%)',
    pointerEvents: 'none',
  }));

  useEffect(() => {
    function handleResize() {
      const computedStyle = getComputedStyle(cardHeightRef.current);

      const cardPaddingTop = parseFloat(computedStyle.paddingTop);
      const cardPaddingBottom = parseFloat(computedStyle.paddingBottom);
      const cardPaddingY = cardPaddingTop + cardPaddingBottom;

      const computedCardHeight =
        cardHeightRef.current.clientHeight - cardPaddingY;

      setCardHeight(computedCardHeight);

      // Scale down the blob to fit the blob on video
      sceneScaleDown(isPortrait);
    }
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    cardAnimationApi.start({
      opacity: 1,
      transform: 'translateY(0%)',
      pointerEvents: 'auto',

      delay: 700,
      onRest: {
        opacity: () => {
          setStage1AnimationFinished(true);
        },
      },
    });
  }, [isDesktop, cardAnimationApi]);

  useEffect(() => {
    if (!videoBlob)
      navigate('/remix' + window.location.search, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoBlob]);

  const cardToggleAnimationProps = useSpring({
    transform: isDonationInformationOpen
      ? 'translateX(-66%)'
      : 'translateX(0%)',
    pointerEvents: 'auto',

    config: {
      duration: 800,
      easing: easeBackInOut,
    },
  });

  const donationAnimationProps = useSpring({
    opacity: isDonationInformationOpen ? 1 : 0,

    delay: isDonationInformationOpen && isDesktop ? 400 : 0,
    config: { duration: isDesktop ? 600 : 300, easing: easeBackOut },

    transform: isDonationInformationOpen
      ? 'translateX(0%)'
      : `translateX(${isDesktop ? 50 : 0}%)`,
  });

  // Change theme color according to background color
  useEffect(() => {
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute('content', isPostProccessing ? '#222222' : clearColor);
  }, [clearColor, isPostProccessing]);

  useEffect(() => {
    const incrementCount = () => {
      if (mintingMessageIndex === CONNECTING_MESSAGES.length - 1) {
        setMintingMessageIndex(0);
      } else {
        setMintingMessageIndex(mintingMessageIndex + 1);
      }
    };

    const timer = setInterval(() => {
      if (isRunningMintProcess(mintStage)) {
        incrementCount();
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [mintingMessageIndex, mintStage]);

  const disabled = isRunningMintProcess(mintStage);

  return (
    <animated.div
      className={cn(
        'container',
        isDonationInformationOpen ? s.isDonationInformationOpen : '',
        mintStage === MINT_STAGES.MINTED ? s.successfulMint : ''
      )}
      style={{
        background:
          mintStage === MINT_STAGES.MINTED
            ? 'transparent'
            : isPostProccessing
            ? '#222222'
            : clearColor,
      }}
    >
      {shouldRenderBackButton(mintStage) && !isDonationInformationOpen && (
        <div className={s.backLinkContainer}>
          <BackLink {...getBackLinkProps(mintStage)} />
        </div>
      )}

      {isDesktop && <DonationInformationOverlay />}

      <animated.div
        className={cn(
          'stage',
          'perspective',
          isMintAnimCardEnded ? 'ovHidden' : '',
          { above: isDonationInformationOpen }
        )}
        ref={stage1Ref}
        {...draggingBind()}
      >
        <animated.div
          className={cn(
            'cardWrapper',
            stage1AnimationFinished &&
              !isDonationInformationOpen &&
              [
                MINT_STAGES.CONNECTING,
                MINT_STAGES.WAITING_CONFIRMATION,
                MINT_STAGES.MINTING,
              ].includes(mintStage)
              ? s.isFloating
              : '',
            mintStage === MINT_STAGES.MINTED ? s.successfulMint : ''
          )}
          style={{
            rotateY: cardRotation,
            ...(stage1AnimationFinished
              ? isDesktop
                ? cardToggleAnimationProps
                : {}
              : cardAnimationProps),
          }}
          onAnimationEnd={() => setIsMintAnimCardEnded(true)}
        >
          <div className={s.frontCard}>
            <div className={cn('card', 'fadeOut')} ref={cardHeightRef}>
              <div
                className={s.cardBlob}
                style={{ '--background-color': clearColor }}
              >
                <video
                  className={s.videoLoop}
                  autoPlay
                  loop
                  muted
                  controls={false}
                >
                  <source src={videoBlobUrl} type={'video/mp4'}></source>
                </video>
              </div>

              <div className={s.cardContent}>
                <h4 className={s.cardTitle}>{`Blob #${addLeadingZeros(
                  nextBlobNumber,
                  4
                )}`}</h4>

                <p className={s.cardDescription}>
                  Just one more step before it’s yours!
                </p>

                <p className={s.cardDonateInfo}>
                  You will help donate
                  <span className={s.cryptocoinIcon}>
                    <GreyCryptocoinIcon />
                  </span>
                  <span>{import.meta.env.REACT_APP_MIN_DONATION_VALUE} to </span>
                  <span
                    role="button"
                    tabIndex="0"
                    className={cn('donationInfoButton', { disabled })}
                    onPointerDown={(e) => {
                      if (disabled) return;
                      e.stopPropagation();
                      useUIStore.setState(() => ({ donationInformationOpen: true }));
                    }}
                  >
                    Ukraine Emergency Response Fund
                  </span>
                  . Gas fees not included.
                </p>

                <CardButton
                  mintStage={mintStage}
                  setMintStage={setMintStage}
                  setHasEnoughFunds={setHasEnoughFunds}
                />
              </div>
            </div>
          </div>

          <div className={s.backCard}>
            <div className={s.metadata} style={{ height: cardHeight }}>
              <div className={s.metadataContent}>
                {createAttributesMetadataArray(blobStore).map((data, index) => {
                  return (
                    <div className={s.dataWrapper} key={index}>
                      <span className={s.dataLabel}>
                        {data.trait_type ? data.trait_type : 'Property'}
                      </span>
                      <div className={s.dataValue}>{data.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </animated.div>

        {!isDesktop && <DonationInformationOverlay />}

        <animated.div
          className={s.donationInformation}
          style={donationAnimationProps}
        >
          <div
            className={cn('donationInformationContent', {
              open: isDonationInformationOpen,
            })}
          >
            <h1 className={s.donationInformationTitle}>
              With every NFT you buy, you help people in need
            </h1>

            <div>
              <p className={s.donationInformationText}>
                For every minted blob, the full amount of 0.14 ETH goes directly
                to the{' '}
                <Link
                  href="https://thegivingblock.com/campaigns/ukraine-emergency-response-fund/"
                  style={{ '--link-color': 'rgba(255, 255, 255, 0.7)' }}
                >
                  Ukraine Emergency Response Fund
                </Link>{' '}
                which supports organizations that provide humanitarian aid in
                Ukraine.
              </p>

              <p className={s.donationInformationText}>
                The Ukraine Emergency Response Fund splits all incoming
                donations equally between participating humanitarian relief
                organizations and international nonprofits. The mission of these
                organizations' include providing urgent medical care and
                humanitarian aid to children, individuals, families, and
                animals. Your support can make a big difference.
              </p>
            </div>
          </div>
        </animated.div>

        <div className={cn({ hide: isDonationInformationOpen })}>
          {!isBuyNowClicked && stage1AnimationFinished && (
            <Notification>
              Tap and drag to rotate the card and check the metadata on the
              back.
            </Notification>
          )}

          {mintStage === MINT_STAGES.CONNECTING && (
            <Notification
              classNames={
                mintingMessageIndex === CONNECTING_MESSAGES.length - 1
                  ? ''
                  : 'fadeInOut'
              }
            >
              {CONNECTING_MESSAGES[mintingMessageIndex]}
              <Dots />
            </Notification>
          )}

          {mintStage === MINT_STAGES.CONNECTING_WALLET && (
            <Notification>
              Connecting
              <Dots />
            </Notification>
          )}

          {!hasEnoughFunds && (
            <Notification error>Not enough funds for minting</Notification>
          )}

          {mintStage === MINT_STAGES.WAITING_CONFIRMATION && (
            <Notification>
              Waiting for transaction confirmation
              <Dots />
            </Notification>
          )}

          {mintStage === MINT_STAGES.ERROR_RETRY && hasEnoughFunds && (
            <Notification error>
              Transaction failed, please try again
            </Notification>
          )}

          {mintStage === MINT_STAGES.MINTING && (
            <Notification
              classNames={
                mintingMessageIndex === CONNECTING_MESSAGES.length - 1
                  ? ''
                  : 'fadeInOut'
              }
            >
              {MINTING_MESSAGES[mintingMessageIndex]}
              <Dots />
            </Notification>
          )}

          {mintStage === MINT_STAGES.MINTED && (
            <Notification
              className={cn('minting', fadeCelebrateMessage2 ? 'fadeOut' : '')}
            >
              Congrats! Your transaction was successful.
            </Notification>
          )}
        </div>

        {mintStage === MINT_STAGES.MINTED && (
          <div
            className={cn(
              'celebrationText',
              fadeCelebrateMessage1 || fadeCelebrateMessage2 ? 'fadeBg' : ''
            )}
            style={{ '--background-color': clearColor }}
          >
            {fadeCelebrateMessage1 && (
              <div className={cn('celebrationMessageWrapper')}>
                <p className={cn('celebrationMessage')}>
                  <SplitedTextReveal>{`We have donated this money to the Ukraine Emergency Response Fund.`}</SplitedTextReveal>
                </p>
              </div>
            )}

            {fadeCelebrateMessage2 && (
              <div className={cn('celebrationMessageWrapper')}>
                <p className={cn('celebrationMessage')}>
                  <SplitedTextReveal>
                    {`In total, ${(
                      Number(import.meta.env.REACT_APP_MIN_DONATION_VALUE) *
                      (nextBlobNumber -
                        parseInt(import.meta.env.REACT_APP_PRE_MINT_LIMIT))
                    ).toFixed(3)} ETH have been raised to help this cause.`}
                  </SplitedTextReveal>
                </p>

                <p className={cn('openSeaMessage')}>
                  Please visit the{' '}
                  <Link href={import.meta.env.REACT_APP_OPEN_SEA_COLLECTION_URL}>
                    OpenSea collection
                  </Link>{' '}
                  to find your newly minted blob. It will appear shortly!
                </p>
              </div>
            )}
          </div>
        )}
      </animated.div>
    </animated.div>
  );
};

export default Web3View;

const Link = ({ href, children, ...props }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="underline"
    {...props}
  >
    {children}
  </a>
);

const SplitedTextReveal = ({ children, ...props }) => {
  // Word wrapper to prevent wrapping of words using CSS
  const Wrapper = ({ children }) => {
    return <span className="word-wrapper">{children}</span>;
  };
  const Animation = (i) =>
    useSpring({
      from: { opacity: 0, y: 12 },
      to: { opacity: 1, y: 0 },
      delay: i * 100,
      config: {
        easing: easeBackOut,
        duration: 500,
      },
    });

  const array = children.split(' ');

  const words = [];

  for (const [, item] of array.entries()) {
    words.push(item.split(''));
  }

  // Add a space to the end of each word
  words.map((word) => {
    return word.push('\u00A0');
  });

  return words.map((item, index) => (
    <Wrapper key={index}>
      {words[index].flat().map((item, i) => {
        return (
          <animated.span key={i} style={Animation(index)} {...props}>
            {item}
          </animated.span>
        );
      })}
    </Wrapper>
  ));
};

const GreyCryptocoinIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1763_1604)">
      <path
        d="M7.4981 0L7.39746 0.34183V10.2601L7.4981 10.3605L12.1019 7.63909L7.4981 0Z"
        fill="#7A8494"
      />
      <path
        d="M7.50435 0L2.90039 7.63909L7.50435 10.3605V5.54643V0Z"
        fill="#AEBBCA"
      />
      <path
        d="M7.49812 11.2327L7.44141 11.3018V14.8348L7.49812 15.0004L12.1048 8.5127L7.49812 11.2327Z"
        fill="#404753"
      />
      <path
        d="M7.50435 15.0004V11.2327L2.90039 8.5127L7.50435 15.0004Z"
        fill="#7A8494"
      />
      <path
        d="M7.5 10.3599L12.1038 7.63856L7.5 5.5459V10.3599Z"
        fill="#404753"
      />
      <path
        d="M2.90039 7.63856L7.50435 10.3599V5.5459L2.90039 7.63856Z"
        fill="#7A8494"
      />
    </g>
    <defs>
      <clipPath id="clip0_1763_1604">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
