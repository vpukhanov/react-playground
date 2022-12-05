import React, { useEffect, useState } from 'react';
import { makeJsonDecoder } from '@urlpack/json';
import { executeCode } from '../lib/code-utils';

const decoder = makeJsonDecoder();

export default function Preview() {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<React.ReactNode>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (window.location.hash) {
      const encoded = window.location.hash.slice(1);
      const decoded = decoder.decode(encoded) as any;
      setCode(decoded.code);
    }
  }, []);

  useEffect(() => {
    if (!code) {
      return;
    }

    setError('');
    setLoading(true);

    executeCode(code, { react: React })
      .then((defaultExport) => {
        const CompiledPreview = defaultExport as React.ComponentType;
        return setPreview(<CompiledPreview />);
      })
      .catch((error) => setError(error.toString()))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <>
      {error}
      {loading ? 'Loading preview...' : preview}
    </>
  );
}
