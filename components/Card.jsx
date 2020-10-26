import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export function Card ({ versionsUrl = '/data/versions.json' }) {
  const [mode, setMode] = useState('name')
  const [versions, setVersions] = useState([])
  const [versionIndex, setVersionIndex] = useState(null)
  const [data, setData] = useState({ version: 'Unknown', data: [] })

  useEffect(async () => {
    const versions = await getUrl(versionsUrl)
    setVersions(versions)
    if (!versions.length) return
    const versionIndex = versions.length - 1
    setVersionIndex(versionIndex)
  }, [versionsUrl])

  useEffect(async () => {
    if (!versions.length) return
    const dataUrl = dataUrlForMode(versions[versionIndex], mode)
    setData(await getUrl(dataUrl))
  }, [versionIndex, mode])

  return (
    <>
      <div className={styles.grid}>
        <VersionBar {...{ mode, setMode, versions, versionIndex, setVersionIndex }} />
        <Table data={data} />
        <Json data={data} />
      </div>
    </>
  )
}

function dataUrlForMode (version, mode) {
  return `/data/${{ name: 'byName', digest: 'byDigest', cid: 'byCID' }[mode]}/${version[mode]}.json`
}

function VersionBar ({ mode, setMode, versions, versionIndex, setVersionIndex }) {
  if (!versions || versionIndex === null) return <></>
  const modes = ['name', 'digest', 'cid']

  const { version } = versions[versionIndex]
  const dataUrl = dataUrlForMode(versions[versionIndex], mode)

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
        <div style={{ textAlign: 'center', minWidth: '45ex' }}>
          <div>Version: {version}</div>
          <div style={{ textAlign: 'center' }}>
            <a href={dataUrl} target='_blank' rel='noopener noreferrer'>
              <code>{versions[versionIndex][mode]}</code>
              <svg width='16px' height='16px' viewBox='0 0 24 24'><g id='external_link' class='icon_svg-stroke' stroke='#666' stroke-width='1.5' fill='none' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'><polyline points='17 13.5 17 19.5 5 19.5 5 7.5 11 7.5' /><path d='M14,4.5 L20,4.5 L20,10.5 M20,4.5 L11,13.5' /></g></svg>
            </a>
          </div>
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
        {modes.map(m => {
          return (
            <span key={m}>
              <input type='radio' name='mode' value={m} id={`choice-${m}`} onChange={() => setMode(m)} checked={mode === m} />
              <label htmlFor='choice-1'>by <span style={{ textTransform: 'capitalize' }}>{m}</span></label>
            </span>

          )
        })}
      </div>
    </div>

  )
}

function Table ({ data }) {
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
            <React.Fragment key={name}>
              <div>{name}{star}</div>
              <div>{joined}</div>
            </React.Fragment>
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
