import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { makeJsonEncoder } from '@urlpack/json';

import S from './index.module.css';

const encoder = makeJsonEncoder();

const initialCodeString = `
import React from 'react'

export default function App() {
 return (
   <div>
     <h1>Hello Playground</h1>
     <h2>Start editing to see some magic happen!</h2>
   </div>
 )
}
`.trim();

export default function Index() {
  const [code, setCode] = useState(initialCodeString);

  const onCodeChange = (ev: ChangeEvent<HTMLTextAreaElement>) =>
    setCode(ev.target.value);

  return (
    <div className={S.grid}>
      <textarea value={code} spellCheck={false} onChange={onCodeChange} />
      <Preview code={code} />
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

  return <iframe ref={frameRef} src={`/preview#${message}`} className={S.iframe} />;
}
