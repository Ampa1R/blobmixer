import { useEffect, useRef, useCallback } from 'react';
import { useProgress } from '@react-three/drei';
import { useSpring } from '@react-spring/web';

export default function Loader({
  containerStyles,
  innerStyles,
  barStyles,
  dataStyles,
  dataInterpolation = (p) => `Loading ${p.toFixed(2)}%`,
  initialState = (active) => active,
}) {
  const { active, progress } = useProgress();
  const domEl = useRef(document.querySelector('.loaderprogress'));
  const numberEl = useRef(document.querySelector('.loadernumber'));

  const onChange = useCallback(({ value: { val } }) => {
    const percentage = Number(val).toFixed(0);
    const currentValue = parseInt(numberEl.current.textContent, 10);
    numberEl.current.textContent = Math.min(
      100,
      Math.max(currentValue, percentage)
    );
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [_, api] = useSpring(() => ({
    val: 0,
    onChange,
    config: { tension: 280, friction: 30 },
  }));

  useEffect(() => {
    // if (!active && !lastProgress.current) return
    api.start({ val: Math.max(14, progress) });
  }, [api, progress]);

  useEffect(() => {
    if (
      active &&
      domEl.current &&
      !domEl.current.classList.contains('loading')
    ) {
      domEl.current.classList.add('loading');
    }
  }, [active]);

  return null;
}
