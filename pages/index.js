import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Card } from '../components/Card'
export default function Home () {
  return (
    <div className={styles.container}>
      <Head>
        <title>PAD</title>
        <title>PAD</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href='/'>P.A.D.</a>!
        </h1>
        <h3 style={{ color: '#aaa' }}>published-authoritative-data</h3>

        <Card />
      </main>

      <footer className={styles.footer}>
        Daniel Lauzon
        <a
          href='https://twitter.com/daneroo'
          target='_blank'
          rel='noopener noreferrer'
        >@daneroo
        </a>
         &copy;2020{' '}
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
