// pages/_app.tsx
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@/css/media.css';
import "@/css/style.css";
import "@/css/satoshi.css";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    // Wraps the entire application with the SessionProvider and pass the session prop
    <SessionProvider session={session}>

      <Component {...pageProps} />

    </SessionProvider>
  );
}

export default MyApp;
