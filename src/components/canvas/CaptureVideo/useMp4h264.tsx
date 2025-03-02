import { useCallback, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { simd } from 'wasm-feature-detect';

const state = {
  frame: 0,
  isRecording: false,
  playhead: 0,
  duration: 0,
  rgbPointer: null,
};

const getProgress = () => {
  return state.playhead / state.duration;
};

const getPlayhead = () => {
  return state.playhead;
};

function even(num) {
  return 2 * Math.round(num / 2);
}

export function useMp4h264({
  duration = 10,
  fps = 60,
  debug = false,
  filename = 'recording',
  priority = 10000,
  checkSIMD = false,
  encoderOptions,
  onProgress,
  onRecordingEnd,
  forceRender = false,
}) {
  const [isRecording, setRecording] = useState(false);
  const [encoder, setEncoder] = useState();

  const r3fclock = useThree((s) => s.clock);
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  const dpr = useThree((s) => s.viewport.dpr);
  const { width, height } = useThree((s) => s.size);

  // Override clock and render loop while exporting mounted
  useEffect(() => {
    debug && console.log('OVERRIDE CLOCK AND FRAMELOOP');
    // @ts-ignore
    if (!window._origElapsed) window._origElapsed = r3fclock.getElapsedTime;
    // @ts-ignore
    if (!window._getDelta) window._getDelta = r3fclock.getDelta;

    // Override clock and turn off render loop
    r3fclock.getElapsedTime = () => state.playhead % duration;
    r3fclock.getDelta = () => 1 / fps;

    setFrameloop('demand');
    setTimeout(() => {
      // fix race condition when resizing canvas
      setFrameloop('demand');
    });

    return () => {
      debug && console.log('RESET CLOCK AND FRAMELOOP');
      setFrameloop('always');
      // @ts-ignore
      if (window._origElapsed) r3fclock.getElapsedTime = window._origElapsed;
      // @ts-ignore
      if (window._getDelta) r3fclock.getDelta = window._getDelta;
    };
  }, [r3fclock, duration, setFrameloop, width, height, fps, debug]);

  const finishRecording = useCallback(async () => {
    state.isRecording = false;
    setRecording(false);
    setEncoder(undefined);

    // @ts-ignore
    const buf = await encoder.end();
    const blob = new Blob([buf], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    onRecordingEnd && onRecordingEnd({ url, blob });
    onProgress && onProgress(100);
  }, [encoder, setRecording, onRecordingEnd, onProgress]);

  const startRecording = useCallback(() => {
    if (state.isRecording) return console.log('Record already in progress...');

    setRecording(true);

    state.isRecording = true;

    debug && console.log('width', dpr, even(width), 'x', even(height));

    const init = async () => {
      // check for SIMD support -> faster
      const isSIMD = checkSIMD ? await simd() : false;
      debug && console.log('isSIMD', isSIMD);

      return;
      // // Load the WASM module first
      // const Encoder = await loadEncoder({
      //   simd: isSIMD,
      //   getWasmPath: (fileName) => '/wasm/' + fileName, // return wasm from public dir
      // })

      // // Create a new encoder interface
      // const encoder = Encoder.create({
      //   width: even(width * dpr),
      //   height: even(height * dpr),
      //   fps,
      //   rgbFlipY: true, // https://github.com/mattdesl/mp4-h264/issues/2
      //   speed: 10,
      //   kbps: 50000,
      //   ...encoderOptions,
      // })

      // state.rgbPointer = encoder.getRGBPointer()

      // setEncoder(encoder)
    };

    init();
  }, [setRecording, fps, debug, dpr, encoderOptions, height, width, checkSIMD]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    setEncoder(undefined);
  }, [setRecording]);

  useEffect(() => {
    if (isRecording && encoder) {
      state.playhead = 0;
      state.isRecording = true;
      state.frame = 0;
      invalidate();
    } else {
      state.playhead = 0;
      state.isRecording = false;
      state.frame = 0;
    }
  }, [invalidate, isRecording, encoder]);

  useFrame(async ({ gl, scene, camera }) => {
    if (!isRecording || !encoder) return;

    const framesToRecord = duration * fps;

    if (state.frame < framesToRecord) {
      debug && console.log('export frame', state.frame);

      // First render the requested frame if not outside render loop handles it
      // if post-processing is enabled it will do the rendering for us
      if (forceRender) {
        debug && console.log('render frame to canvas', state.frame);
        gl.render(scene, camera);
      }

      if (onProgress) {
        const percentage = (state.frame * 100) / framesToRecord;
        onProgress(percentage);
      }

      const _gl = gl.getContext();

      // read pixels from WebGL canvas
      _gl.readPixels(
        0,
        0,
        even(width * dpr),
        even(height * dpr),
        _gl.RGBA,
        _gl.UNSIGNED_BYTE,
        // @ts-ignore
        encoder.memory(),
        // @ts-ignore
        state.rgbPointer
      );

      // encode frame
      // @ts-ignore
      encoder.encodeRGBPointer();

      debug && console.log('read & ecoded frame ' + state.frame);

      // move to next frame
      state.frame++;
      state.playhead = (state.frame * 1) / fps;

      // trigger render of next frame
      invalidate();
    } else {
      finishRecording();
    }
  }, priority);

  return {
    startRecording,
    stopRecording,
    getProgress,
    getPlayhead,
    ...state,
    isRecording,
  };
}
