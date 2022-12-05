import { useEffect, useMemo, useRef, useState } from 'react';
import { makeJsonEncoder, makeJsonDecoder } from '@urlpack/json';
import Editor, { useMonaco } from '@monaco-editor/react';
import Head from 'next/head';

import S from './index.module.css';

const encoder = makeJsonEncoder();
const decoder = makeJsonDecoder();

const initialCodeString = `
import React from 'react';

export default function App() {
  return (
    <div>
      <h1>Hello Playground</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

export default function Index() {
  const [code, setCode] = useState(initialCodeString);
  const monaco = useMonaco();

  const onCodeChange = (value: string | undefined) => setCode(value ?? '');

  const onShareUrl = () => {
    const message = encoder.encode({ code });
    const shareUrl = window.location.href.replace(/#.*/, '') + '#' + message;
    navigator.clipboard.writeText(shareUrl);
    window.location.href = shareUrl;
  };

  useEffect(() => {
    if (!monaco) {
      return;
    }
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
    });
  }, [monaco]);

  useEffect(() => {
    if (window.location.hash) {
      const encoded = window.location.hash.slice(1);
      const decoded = decoder.decode(encoded) as any;
      setCode(decoded.code);
    }
  }, []);

  return (
    <div className={S.grid}>
      <Head>
        <title>React Playground</title>
      </Head>
      <Editor
        value={code}
        onChange={onCodeChange}
        defaultLanguage='javascript'
        defaultPath='index.jsx'
        theme='vs-dark'
        options={{
          minimap: { enabled: false },
          lineNumbers: 'off',
          padding: { top: 16 },
        }}
      />
      <Preview code={code} />
      <button className={S.share} onClick={onShareUrl}>
        Copy Playground URL
      </button>
    </div>
  );
}

function Preview({ code }: { code: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const message = useMemo(() => encoder.encode({ code }), [code]);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({
      type: 'preview',
      message,
    });
  }, [message]);

  return (
    <iframe ref={frameRef} src={`/preview#${message}`} className={S.iframe} />
  );
}
