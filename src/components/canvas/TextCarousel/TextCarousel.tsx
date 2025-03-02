import {
  useState,
  memo,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
} from 'react';
import { Text, shaderMaterial } from '@react-three/drei';
import { MathUtils, Color, DoubleSide, FrontSide } from 'three';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';

import { useUIStore } from '../../../store';

/* eslint import/no-webpack-loader-syntax: off */
// import vertShader from '!raw-loader!glslify-loader!./vertShader.glsl'

// import fontSrc from '../../../assets/fonts/Aften_Screen.ttf'
import fontSrc from '../../../assets/aften_screen.woff';

const TextMaterial = shaderMaterial(
  {
    time: 0,
    color: new Color(1, 1, 1),
    opacity: 1,
    fulltime: 0,
    heightFactor: 1,
  },
  // vertex shader
  `
    // uniform float time;
    uniform float fulltime;
    uniform float heightFactor;
    // varying vec2 vUv;

    #define M_PI 3.1415926538

    vec3 rotateAxis(vec3 p, vec3 axis, float angle) {
        return mix(dot(axis, p)*axis, p, cos(angle)) + cross(axis,p)*sin(angle);
    }

    void main() {
        // vUv = uv;
        vec3 pos = position;

        float progress = clamp(fulltime, 0.0, 1.0);

        // TWIRL
        float twistAmount = M_PI * 2.;
        float direction = sign(cos(M_PI * progress));

        float twirlPeriod = sin(progress * M_PI*2.);

        float rotateAngle = -direction * pow(sin(progress * M_PI), 1.5) * twistAmount;
        float twirlAngle = -sin(uv.x -.5) * pow(twirlPeriod, 2.0) * -4.;
        pos = rotateAxis(pos, vec3(1., 0., 0.), rotateAngle + twirlAngle);


        // SCALE on the sides
        float scale = pow(abs(cos(fulltime * M_PI)), 2.0) * .33;
        pos *= 1. - scale;
        pos.y -= scale * heightFactor * 0.35;
        pos.x += cos(fulltime * M_PI) * -.02;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float fulltime;
    uniform vec3 color;
    uniform float opacity;

    // varying vec3 vTroikaGlyphColor;

    #define M_PI 3.1415926538

    void main() {
      gl_FragColor.rgba = vec4(color, max(sin((fulltime)*M_PI), 0.2) * opacity);
    }
  `
);

extend({ TextMaterial });

function mod(n, m) {
  return ((n % m) + m) % m;
}

export const TextTitle = memo(
  ({ y, title, page = 0, standalone, enabled = true }) => {
    const { viewport, size } = useThree();
    const text = useRef();
    const [textMat, setTextMat] = useState();

    const pageWidthRatio = useUIStore((s) => s.pageWidthRatio);
    const blobs = useUIStore((s) => s.blobs);

    const local = useRef({
      targetX: useUIStore.getState().targetX,
      currentPage: useUIStore.getState().currentPage,
      textParallax: useUIStore.getState().textParallax,
    }).current;
    const pageWidth = size.width * pageWidthRatio;
    const totalDistance = pageWidth * blobs.length;
    const margin = (size.width - pageWidth) * 0.5;

    const getMyPos = (fullwidth) => {
      if (standalone) return 0.5;
      const shift = pageWidth * Math.floor(blobs.length / 2); // dont flip objects at the edges where visible
      if (fullwidth) {
        const x =
          mod(local.targetX - page * size.width + shift, totalDistance) - shift;
        return x / size.width;
      } else {
        const x =
          mod(
            local.targetX - margin - page * pageWidth + shift,
            totalDistance
          ) - shift;
        return x / pageWidth;
      }
    };

    useEffect(
      () => {
        const unsubscribe = useUIStore.subscribe((state: any, prevState: any) => {
          const { targetX, currentPage, textParallax } = state;
          local.targetX = targetX;
          local.currentPage = currentPage;
          local.textParallax = textParallax;
        });
        return () => unsubscribe();
      },
      [local]
    );

    const isPrevPage = useCallback(() => {
      const current =
        mod(local.currentPage - page, blobs.length) -
        Math.floor(blobs.length / 2);
      return 0 > current + 3; // hide 3 from edge
    }, [local, blobs, page]);

    const isNextPage = useCallback(() => {
      const current =
        mod(local.currentPage - page, blobs.length) -
        Math.floor(blobs.length / 2);
      return 0 < current - 3; // hide 3 from edge
    }, [local, blobs, page]);

    useFrame(({ clock }) => {
      if (text.current) {
        const isCurrentPage = standalone ? true : page === local.currentPage;

        let lerp = enabled ? 0.05 : 0.1;

        const myPos = getMyPos();

        // calc position
        const pos =
          (viewport.width * pageWidthRatio * 0.5 -
            myPos * viewport.width * pageWidthRatio) *
          1; // 0.4

        if (!standalone) {
          const visible = isCurrentPage || isPrevPage() || isNextPage();

          if (visible && !text.current.visible) {
            text.current.visible = true;
          } else if (!visible && text.current.visible) {
            text.current.visible = false;
          }

          // velocity
          const vx = (text.current.position.x - pos) * 0.5;
          const vxAvg = vx * 0.8 + useUIStore.getState().vx * 0.2; // rolling average
          if (isCurrentPage) {
            useUIStore.setState(() => ({ vx: vxAvg }));
          }

          // move immediately if not visible
          if (!visible) lerp = 1;

          // lerp position
          const parallax = isCurrentPage
            ? local.textParallax
            : local.textParallax * 0.2;
          text.current.position.x = MathUtils.lerp(
            text.current.position.x,
            pos + parallax,
            lerp
          );
          text.current.position.y = MathUtils.lerp(
            text.current.position.y,
            y,
            lerp
          );

          text.current.scale.setScalar(1);
        } else {
          text.current.scale.setScalar(0.7);
        }

        // MATERIAL UNIFORMS
        text.current.material.opacity = MathUtils.lerp(
          text.current.material.opacity,
          enabled ? 1 : 0,
          enabled ? 0.05 : 0.2
        );
        // textMat.time = MathUtils.lerp( textMat.time, myPos, lerp)

        const fulltime = MathUtils.mapLinear(
          !enabled && isCurrentPage ? (standalone ? 0 : 1) : myPos,
          isCurrentPage ? -0.7 : -0.5,
          isCurrentPage ? 1.7 : 1.5,
          0,
          1
        ); // + (isCurrentPage ? local.textParallax*10 : 0)
        const textLerp =
          isCurrentPage && clock.getElapsedTime() < 3 ? 0.022 : lerp;
        textMat.fulltime = MathUtils.lerp(textMat.fulltime, fulltime, textLerp);

        // slow snap to current page
        if (!standalone && isCurrentPage) {
          useUIStore.getState().snapX(0.01);
          // update progress
          const totalProgress =
            mod(
              useUIStore.getState().targetX - pageWidth * 0.5,
              totalDistance
            ) / totalDistance;
          useUIStore.setState(() => ({ totalProgress }));
        }
      }
    });

    const isPortrait = size.height > size.width;
    // const isVR = useUIStore((s) => s.isVR)

    return (
      <Interactive
        onSelectStart={(e) => {
          if (page === local.currentPage || isNextPage()) {
            useUIStore.getState().next();
          } else if (isPrevPage()) {
            useUIStore.getState().previous();
          }
        }}
      >
        <textMaterial
          ref={setTextMat}
          depthTest={false}
          side={standalone && !isPortrait ? FrontSide : DoubleSide}
          opacity={standalone ? 1 : -3}
          heightFactor={viewport.width * 0.04}
          transparent
        />
        <Text
          ref={text}
          anchorX="center" // default
          anchorY="middle" // default
          color={'white'}
          // fontSize={viewport.width * 0.04}
          fontSize={viewport.width * 0.1}
          letterSpacing={-0.06}
          // position={[viewport.width*pageWidthRatio*0.5 - getMyPos() * viewport.width, y, 0]}
          // position={[0, y, isPortrait ? 0 : isVR ? -0.5 : 0.14]}
          position={[0, y, isPortrait ? 0 : 0.14]}
          // renderOrder={10}
          font={fontSrc}
          material={textMat}
          glyphGeometryDetail={20}
          transparent
        >
          {title}
        </Text>
      </Interactive>
    );
  }
);

const TextCarousel = ({ y, visible }, ref) => {
  const titles = useUIStore((s) => s.titles || []);
  return (
    <mesh ref={ref}>
      {titles.map((title, index) => (
        <TextTitle
          key={index}
          y={y}
          title={titles[index]}
          page={index}
          enabled={visible}
        />
      ))}
      {/* <TextTitle key={0} y={y} title={'test'} page={14} enabled={visible} /> */}
    </mesh>
  );
};

export default memo(forwardRef(TextCarousel));
