import { ChangeEvent, useState } from 'react';
import S from './index.module.css';

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
      <Preview />
    </div>
  );
}

function Preview() {
  return <iframe src='/preview' />;
}
