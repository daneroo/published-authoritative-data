
const fs = require('fs').promises
const crypto = require('crypto')

const dataDir = './public/data'
const historical = require(`${dataDir}/historical.json`)

async function make () {
  const uniqueSortedJoinDates = Object.keys(historical.reduce((acc, { name, joined }) => {
    acc[String(joined)] = true
    return acc
  }, {})).sort().map(strYear => Number(strYear))

  await mkdirp(`${dataDir}/byName`)
  await mkdirp(`${dataDir}/byDigest`)
  await mkdirp(`${dataDir}/byCID`)

  const versions = await Promise.all(uniqueSortedJoinDates.map(async version => {
    const data = historical.filter(({ joined }) => joined <= version)
    const name = `canada-v${version}`
    const content = JSON.stringify({ version, data }, null, 2)
    const digest = hexDigest(content)
    const cid = `Qm${digest.replace(/.*-/, '')}`

    // side effect: write out the versioned file
    await writeJSON(`${dataDir}/byName/${name}.json`, content)
    await writeJSON(`${dataDir}/byDigest/${digest}.json`, content)
    await writeJSON(`${dataDir}/byCID/${cid}.json`, content)

    return { version, name, digest, cid }
  }))
  await writeJSON(`${dataDir}/versions.json`, JSON.stringify(versions, null, 2))
}

make()

async function writeJSON (fname, content) {
  await fs.writeFile(fname, content)
  console.info(`Wrote ${fname}`)
}

function hexDigest (content) {
  const shasum = crypto.createHash('sha1')
  shasum.update(content)
  return 'sha1-' + shasum.digest('hex')
}

async function mkdirp (dirname) {
  await fs.mkdir(dirname, { recursive: true })
}
