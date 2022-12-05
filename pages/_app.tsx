import type { AppProps } from 'next/app';
import ErrorBoundary from '../lib/error-boundary';
import './_app.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
