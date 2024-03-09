import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.mjs',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [typescript({ useTsconfigDeclarationDir: true }), terser()]
  },
  {
    input: 'dist/dts/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts(), del({ hook: 'buildEnd', targets: 'dist/dts' })]
  }
]
