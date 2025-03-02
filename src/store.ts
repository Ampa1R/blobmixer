import qs from 'query-string'
import { create } from 'zustand'
import { MathUtils } from 'three'

function mod(n, m) {
  return ((n % m) + m) % m
}

export function parseState(search = window.location.search) {
  return qs.parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'index',
    skipNull: true,
  })
}

export const useBlobStore = create((set) => ({
  ...parseState(),
}))

export const updateBlobState = (querystate) => {
  const state = parseState(querystate)
  useBlobStore.setState(state, true)
}

const fomosphere =
  '?ambient=0&angle1=0.22&angle2=0.31&angle3=1.57&ccRougness=1&clearColor=%2375bcc6&clearcoat=0.13&color1=%23000fff&color2=%23ffff00&color3=%237600ff&decay1=0&decay2=0&decay3=0&dist1=20&dist2=9.53&dist3=8.2&distort=0.08&dynEnv=false&envMap=0.95&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=2.77&gradient=iridescent&int1=5&int2=0.7&int3=5&int4=0&int5=0.63&ior=2.33&lights%5B0%5D=1&lights%5B1%5D=2&lights%5B2%5D=3&metalness=0.73&numWaves=3.4&opacity=1&penum1=1&penum3=1&reflectivity=1&roughness=0.44&rshad=false&rx=-1.33&ry=-0.13&rz=-2&scale=1&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1&surfaceDistort=3.6&surfaceFrequency=1.62&surfaceSpeed=1&transmission=1&useGradient=true&uv=true&x1=3.87&x2=-2.8&x3=1.33&x4=3.07&y1=-3.73&y2=-6.67&y3=-0.27&z1=1.93&z2=5.73&z3=7.13&z4=3.53&z5=6.2'
const disco =
  '?ambient=0&angle1=0.42&angle2=0.52&angle3=0.39&ccRougness=0.14&clearColor=rgba%28118%2C0%2C240%2C1%29&clearcoat=1&color1=rgba%280%2C255%2C248%2C1%29&color2=rgba%28120%2C0%2C255%2C1%29&color3=rgba%28255%2C255%2C255%2C1%29&decay1=1&dist1=8.27&dist2=9.53&dist3=8.2&distort=0&dynEnv=false&envMap=0.05&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=0.06&gradient=rainbow&int1=1.27&int2=3&int3=2&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&numWaves=1&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0&rshad=false&scale=1.04&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=2&surfaceDistort=3.1&surfaceFrequency=0.28&surfaceSpeed=1&transmission=0&useGradient=true&uv=true&x1=-5&x2=-2.73&x3=1.2&x4=3.07&y1=0.07&y2=-6.67&y3=2.67&z1=1.93&z2=5.73&z3=4.6&z4=3.53&z5=6.2'
const cyberfly =
  '?ambient=2&angle1=0.46&angle2=1.57&angle3=1.57&angle5=1.57&ccRougness=1&clearColor=%23fdcf8a&clearcoat=0&color=%23f64aff&color1=%23df00ff&color2=%23ff0044&color3=%23ebff00&color4=%2384ff00&color5=%23ff8d00&decay1=1&decay2=0&decay3=0&decay4=1&decay5=1&dist1=20&dist2=15.93&dist3=9&dist4=0&dist5=12.27&distort=0.69&dynEnv=false&envMap=2&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=0.48&gradient=rainbow&int1=5&int2=5&int3=5&int4=5&int5=5&ior=2.33&lights%5B0%5D=1&lights%5B1%5D=2&lights%5B2%5D=3&metalness=1&numWaves=1.87&opacity=1&penum1=1&penum3=1&reflectivity=1&roughness=0.71&rshad=false&rx=-2.91&ry=-6.38&rz=-4.83&scale=0.57&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1&surfaceDistort=10&surfaceFrequency=5&surfaceSpeed=0&title=Cyberse&transmission=0&useGradient=true&uv=true&x1=-4.2&x2=-6.07&x3=2.47&x4=3.07&x5=-2.8&y1=-5.6&y2=5.47&y3=-6.53&y5=-6.53&z1=9.87&z2=4.53&z3=-4.47&z4=3.53&z5=5.73'
const liquidity =
  '?ambient=0&angle1=0.88&angle2=1.57&angle3=1.57&ccRougness=1&clearColor=%23fdb38a&clearcoat=0&color=%23ffffff&color1=%238000ff&color2=%23ffa900&color3=%230e00ff&decay1=0&decay2=0&decay3=0&dist1=20&dist2=20&dist3=20&distort=0&dynEnv=false&envMap=1.11&frequency=2.09&gradient=imaginarium&int1=5&int2=1.5&int3=0.82&lights[0]=1&lights[1]=2&lights[2]=3&metalness=1&numWaves=2.13&penum3=1&pp=false&roughness=0.58&rshad=false&rx=0.08&ry=-1.44&scale=1&segments=512&shadow1=false&shadowMap=false&speed=1&surfPoleAmount=1&surfaceDistort=1.4&surfaceFrequency=0.48&surfaceSpeed=1&surfacespeed=1&transmission=0&useGradient=true&uv=true&x1=4.13&x2=-7.67&x3=10&y1=5&y2=-7.67&y3=-6.73&z2=-3.53&z3=-0.53'
const t1000 =
  '?ambient=0.19&angle1=0.36&angle2=0.29&angle3=0.36&ccRougness=0&clearcoat=1&color1=rgba%28236%2C176%2C239%2C1%29&color2=rgba%28225%2C247%2C252%2C1%29&color3=rgba%280%2C255%2C220%2C1%29&dist1=6&dist3=6.93&distort=0.63&dynEnv=false&envMap=0.6&frequency=0.92&int1=0.75&int2=1.2&int3=0.23&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.88&numWaves=2.71&penum3=1&roughness=0.27&rshad=false&scale=0.85&segments=512&shadow1=false&shadowMap=false&surfPoleAmount=1&surfaceDistort=1.8&surfaceSpeed=1&transmission=0&useGradient=true&x2=-3.6&x3=2.67&y2=4.27&y3=-2.73&z2=2.6&z3=2.2'
const metagum =
  '?ambient=0&angle1=0.77&angle2=1.57&angle3=0.39&ccRougness=0.51&clearColor=%2399aae6&clearcoat=1&color=%23ffffff&color1=%23ff8300&color2=%2300ffbf&color3=%23fff700&decay1=0&decay2=0&decay3=0&dist1=11.4&dist2=6.47&dist3=11&distort=0.7&dynEnv=false&envMap=2&frequency=1.22&gradient=halloween&int1=5&int2=3.6&int3=2.53&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&numWaves=1.87&penum1=1&penum3=1&poleAmount=0&pp=false&roughness=0.62&rshad=false&rx=0.26&ry=4.21&rz=-0.24&scale=1&segments=512&shadow1=false&shadowMap=false&speed=1&surfPoleAmount=0&surfaceDistort=1.5&surfaceFrequency=0.24&surfaceSpeed=6&transmission=0&useGradient=true&uv=true&x1=-7.67&x2=1.8&x3=-2.73&y1=3.07&y2=-4.27&y3=2.73&z1=3.33&z2=1.27&z3=3.33'
const twistertoy =
  '?angle1=0.42&angle2=0.52&angle3=0.39&ccRougness=0.14&clearColor=%23536c9b&clearcoat=1&color1=rgba%280%2C255%2C248%2C1%29&color2=rgba%28120%2C0%2C255%2C1%29&color3=rgba%28255%2C255%2C255%2C1%29&decay1=1&dist1=8.27&dist2=9.53&dist3=8.2&distort=0&dynEnv=false&envMap=1&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=3.05&gradient=deep-ocean&https%3A%2F%2Fblobmixer.14islands.com%2Fview%3Fambient=0&int1=1.27&int2=3&int3=2&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=1&numWaves=7.2&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0.74&rshad=false&rx=1.27&ry=3.16&rz=0.73&scale=0.9&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=4&surfPoleAmount=1&surfaceDistort=3.27&surfaceFrequency=5&surfacespeed=1&title=Twistertoy&transmission=0&useGradient=true&uv=true&x1=-5&x2=-2.73&x3=1.2&x4=3.07&y1=0.07&y2=-6.67&y3=2.67&z1=1.93&z2=5.73&z3=4.6&z4=3.53&z5=6.2'
const lips =
  '?ambient=0.31&angle1=0.77&angle2=0.27&angle3=0.39&ccRougness=0&clearColor=%23180075&clearcoat=1&color=%239509fc&color1=%23ff8600&color2=%23637cff&color3=%230700ff&decay1=0&decay3=0.45&dist1=11.4&dist2=6.47&dist3=4.13&distort=0.21&dynEnv=false&envMap=0.87&frequency=0.26&gradient=sunset-vibes&int1=1.5&int2=3.6&int3=1.4&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.28&numWaves=0.07&penum1=0.11&penum3=1&poleAmount=0&pp=false&roughness=0.86&rshad=false&rx=-0.29&ry=3.16&scale=1.04&segments=512&shadow1=false&shadowMap=false&speed=0&surfPoleAmount=0&surfaceDistort=10&surfaceFrequency=3.92&surfaceSpeed=6&transmission=0&useGradient=true&uv=true&x1=0.53&x2=-5.6&x3=3.2&y1=2.6&y2=-4.27&y3=-0.93&z1=0.67&z2=1.27&z3=0.47'
const protocool =
  '?ambient=0.07&angle1=0.75&angle2=0.5&angle3=1.57&ccRougness=0.39&clearColor=%23042a2a&clearcoat=0.22&color=%23ffffff&color1=%23dd7cf4&color2=%23ffffff&color3=%23f3d9fc&decay1=0&decay3=0&dist1=9.73&dist2=11.4&dist3=18.87&distort=0.09&dynEnv=false&envMap=0&frequency=0.18&gradient=cosmic-fusion&int1=1.58&int2=1.1&int3=0.35&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0.7&noise=0.22&numWaves=1.67&penum1=0.61&penum2=0&penum3=0&poleAmount=0&pp=false&roughness=0.51&rshad=false&rx=0.7&ry=-0.37&rz=-0.05&scale=1&scanline=0.03&segments=512&set=%28prop%2C%20val%29%20%3D%3E%20set%28%7B%20%5Bprop%5D%3A%20val%20%7D%29&shadow1=false&shadowMap=false&speed=1&surfaceDistort=3.33&surfaceFrequency=0.19&surfaceSpeed=3&title=Fomosphere&transmission=0&useGradient=true&uv=false&x1=-8.13&x2=10&x3=-4.93&y1=7.33&y2=4.4&y3=-10&z1=-4.87&z2=-2.07&z3=-1.73'
const metalness =
  '?ambient=0&angle1=0.42&angle2=0.52&angle3=0.39&ccRougness=0.63&clearColor=%23371b53&clearcoat=1&color1=rgba%280%2C255%2C248%2C1%29&color2=rgba%28120%2C0%2C255%2C1%29&color3=rgba%28255%2C255%2C255%2C1%29&decay1=1&dist1=8.27&dist2=9.53&dist3=8.2&distort=0&dynEnv=false&envMap=1.02&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=3.05&gradient=cosmic-fusion&int1=1.27&int2=3&int3=2&int4=0&int5=0.63&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=1&numWaves=12.07&opacity=1&penum1=0.66&penum3=1&reflectivity=1&roughness=0.36&rshad=false&ry=3.16&scale=1.04&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=4&surfPoleAmount=1&surfaceDistort=1.4&surfaceFrequency=1.74&surfacespeed=1&transmission=0&useGradient=true&uv=true&x1=-5&x2=-2.73&x3=1.2&x4=3.07&y1=0.07&y2=-6.67&y3=2.67&z1=1.93&z2=5.73&z3=4.6&z4=3.53&z5=6.2'
const genesys =
  '?ambient=0&angle1=0.22&angle2=0.31&angle3=0.26&ccRougness=0&clearColor=%23523ea4&clearcoat=0&color1=%2300ffdc&color2=%23af00ff&color3=%2300ff4d&decay1=0&decay2=0&decay3=0&dist1=20&dist2=9.53&dist3=8.2&distort=0.65&dynEnv=false&envMap=0.63&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=1.11&gradient=hollogram&int1=5&int2=5&int3=5&int4=0&int5=0.63&ior=2.33&lights%5B0%5D=1&lights%5B1%5D=2&lights%5B2%5D=3&metalness=0.62&numWaves=0.67&opacity=1&penum1=1&penum3=1&reflectivity=1&roughness=0.24&rshad=false&rx=-1.87&ry=0.04&rz=-1.04&scale=0.96&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1&surfaceDistort=2.07&surfaceFrequency=0.71&surfaceSpeed=1&transmission=0&useGradient=true&uv=true&x1=3.87&x2=-2.8&x3=1.33&x4=3.07&y1=-5.4&y2=-6.67&y3=-0.27&z1=1.93&z2=5.73&z3=7.13&z4=3.53&z5=6.2'
const fungible =
  '?ambient=0&angle1=1.57&angle2=1.57&angle3=1.57&angle5=1.57&ccRougness=1&clearColor=%238fd8a5&clearcoat=0&color=%23ffffff&color1=%2300ff6a&color2=%236300ff&color3=%23ff00c0&color4=%2384ff00&color5=%23ff8d00&decay1=0&decay2=0&decay3=1&decay4=1&decay5=1&dist1=20&dist2=12.27&dist3=20&dist4=0&dist5=12.27&distort=0.22&dynEnv=false&envMap=1.2&floor=false&floorColor=rgba%2811%2C39%2C43%2C1%29&floorEnvMap=0.37&floorMetalness=0&floorOpacity=0.27&floorRoughness=0.15&floorSize=0&floorY=-0.4&frequency=0.87&gradient=cd&int1=5&int2=5&int3=0&int4=5&int5=5&ior=2.33&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&numWaves=3.13&opacity=1&penum1=1&penum3=1&reflectivity=1&roughness=0.3&rshad=false&rx=0.27&scale=0.92&segments=512&shadow1=false&shadow2=false&shadowBias1=false&shadowFocus1=1&shadowMap=false&sky=false&speed=1&surfaceDistort=3.93&surfaceFrequency=0.99&surfaceSpeed=1&title=Cyberse&transmission=0&useGradient=true&uv=true&x1=0.2&x2=-2.73&x3=1.33&x4=3.07&x5=-2.8&y1=-10&y2=10&y3=2.73&y5=-6.53&z1=1.93&z2=5.73&z3=4.53&z4=3.53&z5=5.73'
const firefly =
  '?ambient=0.35&angle1=0.54&angle2=0.54&angle3=0.31&clearColor=rgba%2856%2C11%2C22%2C1%29&clearcoat=0&color1=rgba%28237%2C0%2C255%2C1%29&color2=%23e4b85d&color3=rgba%284%2C190%2C238%2C1%29&decay1=0&dist1=4.2&dist2=3.73&dist3=5.13&distort=0.26&dynEnv=false&frequency=0.49&gradient=passion&int1=2.65&int2=5&int3=1.75&lights[0]=1&lights[1]=2&lights[2]=3&metalness=0&noise=0.22&numWaves=1&penum2=0.5&poleAmount=0&roughness=1&rshad=false&rx=0.75&ry=-0.26&rz=0.1&scale=1&scanline=0.03&segments=512&set=%28prop%2C%20val%29%20%3D%3E%20set%28%7B%0A%20%20%20%20%5Bprop%5D%3A%20val%0A%20%20%7D%29&shadow1=false&shadowMap=false&speed=2&surfaceDistort=2.4&surfaceFrequency=0.19&surfaceSpeed=1&transmission=0&useGradient=true&uv=false&x1=-1.6&x2=0&x3=4&y1=3.73&y2=0.07&y3=-2.93&z1=-1&z2=2.67&z3=2.13'
const slinky =
  '?ambient=2&angle1=1.57&angle2=1.57&angle3=0.46&ccRougness=1&clearColor=%23f186b7&clearcoat=0.62&color=%238f8f8f&color1=%23fff500&color2=%23fff506&color3=%238c00ff&decay1=0&decay2=0&decay3=0&dist1=20&dist2=20&dist3=7.73&distort=0.84&dynEnv=false&envMap=0.58&frequency=5&gradient=pink-floyd&int1=5&int2=5&int3=5&lights%5B0%5D=1&lights%5B1%5D=2&lights%5B2%5D=3&metalness=0&noise=0.22&numWaves=20&penum1=1&penum2=1&poleAmount=0&pp=false&roughness=1&rshad=false&rx=-0.38&ry=-6.37&rz=-1.6&scale=1&scanline=0.03&segments=512&set=%28prop%2C%20val%29%20%3D%3E%20set%28%7B%0A%20%20%20%20%5Bprop%5D%3A%20val%0A%20%20%7D%29&shadow1=false&shadowFocus1=0.45&shadowMap=false&speed=1&surfaceDistort=0.93&surfaceFrequency=5&surfaceSpeed=0&transmission=0&useGradient=true&x1=-10&x2=10&x3=-0.73&y1=7.8&y2=-10&y3=1.53&z1=-8.2&z2=-3.53&z3=3.87'

const WEB3_APP = true

export const useUIStore = create((set) => ({
  blobs: [
    fomosphere,
    disco,
    cyberfly,
    twistertoy,
    fungible,
    metalness,
    metagum,
    firefly,
    slinky,
    t1000,
    genesys,
    protocool,
    liquidity,
    lips,
  ],
  titles: [
    'Fomosphere',
    'Discobrain',
    'Cyberfly',
    'Twistertoy',
    'Fungible',
    'Metalness',
    'Metagum',
    'Firefly',
    'Slinky',
    'T-1000',
    'Genesys',
    'Protocool',
    'Liquidity',
    'Lipsync',
  ],

  pageWidthRatio: 0.5,

  showControls: false,
  aboutOpen: false,
  hideAboutButton: false,
  faqOpen: false,
  nftsAvailabeOpen: false,
  donationInformationOpen: false,

  hideNFTCollectionLinkOnMobile: true,

  mouse: { x: 0, y: 0 },
  vx: 0,

  videoBlobUrl: '',
  videoBlob: null,

  currentNumberOfTokens: -1,

  web3App: WEB3_APP,

  isGallery: false,
  isRemix: false,
  isExport: false,
  isWeb3: false,
  previousRoute: '',
  targetX: window.innerWidth / 2,
  currentPage: 0,
  currentPageUnlimited: 0,
  currentPageDistance: 0,
  currentPageFactor: 0.5,
  currentPageX: 0,
  totalProgress: 0,

  textParallax: 0,

  isVR: false,

  isRecording: false,
  recordingProgress: -1,

  clearColor: '',

  isPostProccessing: false,

  isBuyNowClicked: false,

  successfulMintSceneScale: 0.37,
  mintAnimCardEnded: false,

  // lerps towards current page center
  snapX: (lerp) =>
    set((state) => {
      const targetX = MathUtils.lerp(
        state.targetX,
        state.currentPageX + state.textParallax,
        lerp
      )
      state.updateTargetX(targetX)
      return {};
    }),

  // move to next page
  gotoPage: (nextPage) =>
    set((state) => {
      const pageWidth = window.innerWidth * state.pageWidthRatio
      const margin = (window.innerWidth - pageWidth) * 0.5
      const nextX = margin * 2 + nextPage * pageWidth
      state.updateTargetX(nextX)
      return {};
    }),

  // move to next page
  next: () =>
    set((state) => {
      state.gotoPage(state.currentPageUnlimited + 1)
      return {};
    }),

  // move to previous page
  previous: () =>
    set((state) => {
      state.gotoPage(state.currentPageUnlimited - 1)
      return {};
    }),

  updateTargetX: (targetX) =>
    set((state) => {
      if (isNaN(targetX)) targetX = state.targetX
      const pageWidth = window.innerWidth * state.pageWidthRatio
      const margin = (window.innerWidth - pageWidth) * 0.5

      const currentPageDistance = (targetX - margin) % pageWidth
      const currentPageFactor = currentPageDistance / pageWidth
      const currentPageUnlimited = Math.floor((targetX - margin) / pageWidth)
      const currentPage = mod(currentPageUnlimited, state.blobs.length)
      const currentPageX = margin * 2 + currentPageUnlimited * pageWidth

      return {
        targetX,
        currentPage,
        currentPageUnlimited,
        currentPageDistance,
        currentPageFactor,
        currentPageX,
      }
    }),

  // scale down the scene on successful mint proccess
  sceneScaleDown: (isPortrait) =>
    set(() => {
      return { successfulMintSceneScale: isPortrait ? 0.63 : 0.37 };
    }),
  updateUIState: (newState) =>
    set(() => {
      return newState;
    }),
}))
