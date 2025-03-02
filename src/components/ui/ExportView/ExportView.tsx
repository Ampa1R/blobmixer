import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUIStore } from '../../../store';
import BackLink from '../BackLink';
import Dots from '../Dots/Dots.tsx';
import Notification from '../Notification/Notification.tsx';

import s from './ExportView.module.scss';

const getStrokeDashArrayProgress = (progress) => {
  return `${progress} ${100 - progress}`;
};

const ExportView = () => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [outAnimationFinished, setOutAnimationFinished] = useState(false);
  const navigate = useNavigate();
  const animationEndedTimeout = useRef(null);

  const recordingProgress = useUIStore((s) => s.recordingProgress);

  useEffect(() => {
    useUIStore.setState(() => ({
      recordingProgress: -1,
      hideAboutButton: true,
      isExport: true,
    }));

    const timeout = setTimeout(() => {
      useUIStore.setState(() => ({ isRecording: true, recordingProgress: 0 }));
    }, 2000); // was 800 before but lost 1st frame on slow computer

    return () => {
      useUIStore.setState(() => ({
        hideAboutButton: false,
        isExport: false,
        isExportLast: true,
      }));

      window.clearTimeout(timeout);

      if (animationEndedTimeout.current)
        window.clearTimeout(animationEndedTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (recordingProgress >= 100) {
      setIsAnimatingOut(true);

      animationEndedTimeout.current = setTimeout(() => {
        setIsAnimatingOut(false);
        setOutAnimationFinished(true);

        navigate('/web3' + window.location.search);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingProgress]);

  return (
    <div className={s.container}>
      <BackLink to={'/remix' + window.location.search} text={'Back'} />

      {!outAnimationFinished && (
        <div className={s.progressContainer}>
          <svg width="100%" height="100%" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" />

            <circle
              className={s.progressCircle}
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke="#FFFFFF"
              strokeOpacity={0.2}
              strokeWidth="0.2"
              strokeDasharray="100 0"
              strokeDashoffset="25"
            />

            {recordingProgress >= 0 && (
              <circle
                className={isAnimatingOut ? s.progressCircleOutAnimation : ''}
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="#FFFFFF"
                strokeWidth="0.2"
                strokeDasharray={getStrokeDashArrayProgress(recordingProgress)}
                strokeDashoffset="25"
              />
            )}
          </svg>
        </div>
      )}

      <Notification>
        Rendering
        <Dots />
      </Notification>
    </div>
  );
};

export default ExportView;
