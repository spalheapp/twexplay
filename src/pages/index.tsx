import WavmanPlayer from "./WavmanPlayer";
import RelayProvider from "@/nostr/relayProvider";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Wavman</title>
        <meta name="description" content="Wavman" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid-row">
        <RelayProvider url="wss://relay.wavlake.com/">
          <WavmanPlayer />
        </RelayProvider>
      </main>
    </>
  );
}
