import { useState, useEffect } from 'react';

const breakpoints = {
  medium: '500px',
  tablet: '700px',
  desktop: '1000px',
  large: '1400px',
  xlarge: '2400px',
  black: '#000',
  'dark-gray': '#333',
  gray: '#4f4f4f',
  'light-gray': '#f2f2f2',
  grape: '#421845',
  'purple-heart': '#6a29e7',
  white: '#fff',
} as const;

const useBreakpoint = (key: keyof typeof breakpoints) => {
  const [isMatching, setIsMatching] = useState(false);
  const breakpoint = breakpoints[key];

  useEffect(() => {
    const getMatchMedia = () => {
      const mq = window.matchMedia(`(min-width: ${breakpoint})`);

      setIsMatching(mq.matches);
    };

    getMatchMedia();

    window.addEventListener('resize', getMatchMedia);

    return () => window.removeEventListener('resize', getMatchMedia);
  }, [breakpoint]);

  return isMatching;
};

export default useBreakpoint;
