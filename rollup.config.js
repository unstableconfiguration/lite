import copy from 'rollup-plugin-copy'

export default [
    {
        input: 'src/lite.js',
        output: {
            file: 'dist/lite.js',
            format: 'es'
        }
    },
    {
        input : 'tests/tests-index.js',
        output : {
            file : 'gh-pages/scripts/lite-tests.js',
            format : 'es'
        },
        plugins: [
            copy({
                targets: [
                    { src: 'tests/lite-test/*', dest: 'gh-pages/scripts/lite-test' },
                    { src: 'tests/xhr-test/*', dest: 'gh-pages/scripts/xhr-test' }     
                ]
            })
        ]
    }
];