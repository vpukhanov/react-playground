import { useEffect, useState } from 'react';
import { makeJsonDecoder } from '@urlpack/json';

const decoder = makeJsonDecoder();

export default function Preview() {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (window.location.hash) {
      const encoded = window.location.hash.slice(1);
      const decoded = decoder.decode(encoded) as any;
      setCode(decoded.code);
    }
  }, []);

  return <div>{code}</div>;
}
