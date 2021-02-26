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
            file : 'dist/lite-tests.js',
            format : 'es'
        },
        plugins: [
            copy({
                targets: [
                    { src: 'tests/lite-test/*', dest: 'dist/lite-test' },
                    { src: 'tests/xhr-test/*', dest: 'dist/xhr-test' }     
                ]
            })
        ]
    }
];