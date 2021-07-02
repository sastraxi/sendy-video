import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';


export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          sendy 📷
        </h1>

        <p>
          Create magic links that let your friends
          record videos into your Google Drive.
        </p>

        <div>
          <Link href="/auth/login">
            <a>
              <h2>Get started</h2>
              <p>Sign in with Google to create a project</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}
