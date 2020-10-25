
const fs = require('fs').promises
const crypto = require('crypto')

const historical = require('./data/historical.json')

async function make () {
  const uniqueSortedJoinDates = Object.keys(historical.reduce((acc, { name, joined }) => {
    acc[String(joined)] = true
    return acc
  }, {})).sort().map(strYear => Number(strYear))

  await mkdirp('./data/named')
  await mkdirp('./data/immutable')
  console.log(JSON.stringify(uniqueSortedJoinDates, null, 2))
  const versions = await Promise.all(uniqueSortedJoinDates.map(async version => {
    const data = historical.filter(({ joined }) => joined <= version)
    const file = `canada-v${version}.json`
    const content = JSON.stringify({ version, data }, null, 2)
    const digest = hexDigest(content)

    // side effect: write out the versioned file
    await writeJSON(`./data/named/${file}`, content)
    await writeJSON(`./data/immutable/${digest}.json`, content)

    return { file, digest }
  }))
  await writeJSON('./data/versions.json', JSON.stringify(versions, null, 2))
}

make()

async function writeJSON (fname, content) {
  await fs.writeFile(fname, content)
  console.info(`Wrote ${fname}`)
}

function hexDigest (content) {
  const shasum = crypto.createHash('sha1')
  shasum.update(content)
  return 'sha1:' + shasum.digest('hex')
}

async function mkdirp (dirname) {
  await fs.mkdir(dirname, { recursive: true })
}
