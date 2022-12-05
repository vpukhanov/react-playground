let swc: typeof import('@swc/wasm-web') | null = null;

export async function transformCode(code: string) {
  if (swc === null) {
    const mod = await import('@swc/wasm-web');
    await mod.default();
    swc = mod;
  }
  return swc.transformSync(code, {
    filename: 'index.tsx',
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
    },
    module: {
      type: 'commonjs',
    },
  }).code;
}

export async function executeCode(
  codeString: string,
  dependencies: Record<string, unknown>
) {
  const transformedCode = await transformCode(codeString);
  const exports: Record<string, unknown> = {};
  const require = (path: string) => {
    if (dependencies[path]) {
      return dependencies[path];
    }
    throw Error(`Module not found: ${path}.`);
  };
  const result = new Function('exports', 'require', transformedCode);

  result(exports, require);

  return exports.default;
}
