import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
    input : 'index.js',
    output : {
        file : 'dist/lite.js',
        format : 'es'
    },
    plugins : [
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
}
