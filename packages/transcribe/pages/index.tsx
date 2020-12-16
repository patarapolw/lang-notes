import { useEffect, useState } from 'react'

import Head from 'next/head'
import XRegexp from 'xregexp'
import styles from '~/styles/styles.module.css'

const Home = () => {
  const [q, setQ] = useState('')
  const [re, setRe] = useState('')
  const [lang, setLang] = useState('')

  const [langChoice, setLangChoice] = useState(
    // eslint-disable-next-line no-undef
    () => [] as SpeechSynthesisVoice[]
  )

  useEffect(() => {
    if (window.speechSynthesis) {
      setLangChoice(speechSynthesis.getVoices())

      speechSynthesis.onvoiceschanged = () => {
        setLangChoice(speechSynthesis.getVoices())
      }
    }
  }, [0])

  return (
    <div className={styles.container}>
      <Head>
        <title>Transcribe and speak engine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Transcribe and speak engine</h1>

        <p className={styles.description}>Choose a language and press speak.</p>

        <textarea
          rows={10}
          value={q}
          onInput={(ev) => setQ((ev.target as HTMLTextAreaElement).value)}
        ></textarea>

        <input
          type="text"
          placeholder="Filter with XRegExp"
          value={re}
          onInput={(ev) => setRe((ev.target as HTMLInputElement).value)}
        />

        <select value={lang} onChange={(ev) => setLang(ev.target.value)}>
          {langChoice.map((it) => (
            <option value={it.name} key={it.name} selected={it.default}>
              {`${it.lang} (${it.name})`}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            let txt = q
            if (re.trim()) {
              const m = XRegexp(re).exec(q)
              if (m) {
                txt = m[0]
              }
            }

            const u = new SpeechSynthesisUtterance(txt)
            u.voice = langChoice.find((it) => it.name === lang)
            speechSynthesis.speak(u)
          }}
        >
          Speak
        </button>

        <style jsx>{`
          textarea {
            width: 100%;
          }

          textarea,
          input,
          select {
            margin-bottom: 1em;
            background-color: rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </main>
    </div>
  )
}

export default Home
