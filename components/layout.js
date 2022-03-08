import Head from 'next/head'

export default function Layout({ children }) {
    return (
        <div>
            <Head>
                <title>Pokemon</title>
                <meta name="description" content="Orion Desgin System"/>
                <link rel="icon" href=""/>
             </Head>
            <main>{ children }</main>
        </div>
    )
}