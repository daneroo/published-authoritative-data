import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export function Card ({ versionsUrl = '/data/versions.json' }) {
  const [versions, setVersions] = useState([])
  const [versionIndex, setVersionIndex] = useState(null)
  const [data, setData] = useState({ version: 'Unknown', data: [] })

  useEffect(async () => {
    const versions = await getUrl(versionsUrl)
    setVersions(versions)
    if (!versions.length) return
    const versionIndex = versions.length - 1
    setVersionIndex(versionIndex)
    const dataUrl = versions[versionIndex].file
    setData(await getUrl(`/data/named/${dataUrl}`))
  }, [versionsUrl])

  useEffect(async () => {
    if (!versions.length) return
    const dataUrl = versions[versionIndex].file
    setData(await getUrl(`/data/named/${dataUrl}`))
  }, [versionIndex])

  const dataUrl = (versions && versionIndex != null) ? versions[versionIndex].file : ''
  return (
    <>
      <div className={styles.grid}>
        <VersionBar {...{ versions, versionIndex, setVersionIndex }} />
        <Table data={data} dataUrl={dataUrl} />
        <Json data={data} />
      </div>
    </>
  )
}

function VersionBar ({ versions, versionIndex, setVersionIndex }) {
  if (!versions || versionIndex === null) return <></>
  const { version, file, digest } = versions[versionIndex]
  function set (index) {
    index = Math.max(0, index)
    index = Math.min(index, versions.length - 1)
    setVersionIndex(index)
  }
  const mediaButtonStyle = { color: '#0070f3', letterSpacing: -5 }
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h3>Canadian Provinces and Territories</h3>
      </div>

      <div style={{
        marginTop: '1rem',
        marginBottom: '1rem',
        display: 'grid',
        gridTemplateColumns: '2rem 2rem 1fr 2rem 2rem',
        alignItems: 'center',
        justifyItems: 'center',
        justifyContent: 'space-between'
      }}
      >
        <div onClick={() => set(0)} style={mediaButtonStyle}>◀️◀️</div>
        <div onClick={() => set(versionIndex - 1)} style={mediaButtonStyle}>◀️</div>
        <div style={{ textAlign: 'center' }}>
          <div>Version: {version}</div>
          <div><code>{file}</code></div>
          <div><code>{digest}</code></div>
        </div>
        <div onClick={() => set(versionIndex + 1)} style={mediaButtonStyle}>▶️</div>
        <div onClick={() => set(versions.length - 1)} style={mediaButtonStyle}>▶️▶️</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,auto)',
        alignItems: 'center',
        justifyItems: 'center',
        justifyContent: 'space-between'
      }}
      >
        <span>Content Addressing:</span>
        <span>
          <input type='radio' name='choice' value='choice-1' id='choice-1' checked />
          <label for='choice-1'>by Name</label>
        </span>
        <span>
          <input type='radio' name='choice' value='choice-2' id='choice-2' />
          <label for='choice-2'>by Digest</label>
        </span>
        <span>
          <input type='radio' disabled name='choice' value='choice-2' id='choice-2' />
          <label for='choice-2' style={{ textDecoration: 'line-through' }}>by CID (IPFS)</label>
        </span>
      </div>
    </div>

  )
}

function Table ({ data, dataUrl = '' }) {
  const { data: provinces } = data
  return (
    <div className={styles.card}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto'
      }}
      >
        <div style={{ fontWeight: 'bold' }}>Name</div>
        <div style={{ fontWeight: 'bold' }}>Joined</div>
        {provinces.map(({ name, joined, type }) => {
          const star = (type === 'territory') ? '*' : ''
          return (
            <>
              <div>{name}{star}</div>
              <div>{joined}</div>
            </>
          )
        })}
      </div>
      <div style={{ marginTop: '1rem' }}><em>*</em> denotes a territory</div>
    </div>
  )
}

function Json ({ data }) {
  return (
    <div className={styles.card}>
      <h3>JSON &rarr;</h3>
      <pre className={styles.code}>
        {JSON.stringify(data, null, 2)}
        <pre />
      </pre>
    </div>
  )
}
/* global fetch */
async function getUrl (dataUrl) {
  const res = await fetch(dataUrl)
  return await res.json()
}
