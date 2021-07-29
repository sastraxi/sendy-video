import 'reflect-metadata'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import { ChakraProvider } from "@chakra-ui/react"

import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

// only initialize when in the browser
if (typeof window !== 'undefined') {
  LogRocket.init('a1zphg/sendy-video');
  // plugins should also only be initialized when in the browser
  setupLogRocketReact(LogRocket);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session} >
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
};

export default MyApp;
