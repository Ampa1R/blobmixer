const pinMediaFileWithSignedUrl = async (signedUrl, mediaFile) => {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {},
    body: mediaFile,
  })

  const cid = response.headers.get('x-amz-meta-cid')

  return cid
}

const getSignedUrl = async () => {
  const response = await fetch('/.netlify/functions/getSignedUrl', {
    method: 'GET',
  })

  const content = await response.json()

  return content.url
}

// Uploads metadata to IPFS via netlify cloud function
const uploadMetadataToIPFS = async (metadata) => {
  try {
    const pinnedDataResponse = await fetch(
      '/.netlify/functions/pinJSONToIPFS',
      {
        method: 'POST',
        body: JSON.stringify(metadata),
      }
    )
    const { name, counter } = await pinnedDataResponse.json()

    const cidGetReponse = await fetch(
      '/.netlify/functions/getPinnedObjectCid',
      {
        method: 'POST',
        body: JSON.stringify({ name }),
      }
    )
    const content = await cidGetReponse.json()

    return { ...content, counter }
  } catch (error) {
    console.log('File to IPFS: ')
    console.log(error)
  }
}

export const pinNFTDataToIPFS = async (videoFile, attributes) => {
  try {
    const signedUrl = await getSignedUrl()

    const pinnedItemCid = await pinMediaFileWithSignedUrl(signedUrl, videoFile)

    //make metadata
    const metadata = {
      image: `ipfs://${pinnedItemCid}`,
      attributes,
    }

    const result = await uploadMetadataToIPFS(metadata)

    if (result.success && result.cid) return `ipfs://${result.cid}`
  } catch (err) {
    console.log(err)
    return null
  }
}

/** Attribute formatting is based on Open sea metadata standards see: https://docs.opensea.io/docs/metadata-standards
 *  use displayType === null for string displayType
 */
const formatTraitAttribute = (value, traitType, displayType, meetsCriteria) =>
  meetsCriteria
    ? {
        ...(displayType !== null && { display_type: displayType }),
        trait_type: traitType,
        value,
      }
    : null

// Turns number in to "Low" | "Medium" | "High" strings
const formatAsBuckets = (
  buckets = ['Low', 'Medium', 'High'],
  label,
  numberValue,
  max = 1,
  lowLimit = 0.33,
  highLimit = 0.66
) => ({
  trait_type: label,
  value:
    numberValue < max * lowLimit
      ? buckets[0]
      : numberValue > max * highLimit
      ? buckets[2]
      : buckets[1],
})

const formatGenericAttribute = (value, meetsCriteria) =>
  meetsCriteria
    ? {
        value,
      }
    : null

export const createAttributesMetadataArray = (blobStore, original = false) =>
  [
    formatTraitAttribute('Remix', 'Type', null, !original),
    formatTraitAttribute('Original', 'Type', null, original),

    formatAsBuckets(
      ['Nonmetal', 'Metal', 'Kryptonite'],
      'Metalness',
      blobStore.metalness
    ),

    formatAsBuckets(
      ['Mirror', 'Shiny', 'Matt'],
      'Roughness',
      // find lowest value since we low roughness is most visible (shiny)
      Math.min(
        blobStore.roughness,
        blobStore.clearcoat > 0 ? blobStore.ccRougness : blobStore.roughness
      )
    ),

    formatAsBuckets(
      ['Small', 'Large', 'YOLO'],
      'Distortion',
      Math.max(blobStore.distort, blobStore.surfaceDistort / 10)
    ),

    // Let's format the value [0,1] according to this:
    // low value === short noise period => high frequency
    // high value === large noise period => low frequency
    formatAsBuckets(
      ['High', 'Medium', 'Low'],
      'Frequency',
      // let's find the lowest possible value since "high" frequency is more visible
      Math.min(
        blobStore.distort > 0 ? blobStore.frequency / 5 : 1,
        blobStore.surfaceDistort > 0 ? blobStore.surfaceFrequency / 5 : 1
      ),
      1, // max scale
      0.06, // High below this (just based on eyeballing the blob's look)
      0.3 // Low above this
    ),

    formatAsBuckets(
      ['Few', 'Many', 'Countless'], // FOMO?
      'Surface waves',
      blobStore.numWaves,
      20
    ),

    formatAsBuckets(
      ['Slow', 'Fast', 'Hurricane'],
      'Speed',
      Math.max(
        blobStore.distort && blobStore.speed,
        blobStore.surfaceDistort && blobStore.surfaceSpeed
      ),
      6
    ),

    formatGenericAttribute('Blob noise', blobStore.distort > 0),
    formatGenericAttribute('Surface noise', blobStore.surfaceDistort > 0),
    formatGenericAttribute('Low poly', blobStore.segments < 100),
    formatGenericAttribute('Flat Shaded', !!blobStore.flatShading),
    formatGenericAttribute('Displaced Normals', !!blobStore.uv),
    formatGenericAttribute('Wireframe', !!blobStore.wireframe),
    formatGenericAttribute('Post Processing', !!blobStore.pp),
    formatGenericAttribute('Glitch', !!blobStore.pp && blobStore.glitch),

    formatTraitAttribute(
      String(blobStore.lights?.length || 0),
      'Spotlights',
      null,
      true
    ),

    formatTraitAttribute(
      blobStore.gradient,
      'Gradient',
      null,
      typeof blobStore.gradient === 'string' && blobStore.gradient.length > 0
    ),
  ].filter((attribute) => attribute !== null)
