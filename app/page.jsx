'use client'
// import InstructionsComponent from '../components/instructionsComponent'
import BlockInsights from '../components/BlockInsights'
import './globals.css'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <InstructionsComponent></InstructionsComponent> */}
      <BlockInsights></BlockInsights>
    </main>
  )
}
