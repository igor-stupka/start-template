module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        'airbnb-base'
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    rules: {
        // semi: [2, 'never'], // set ;
        'no-tabs': 0,
        indent: [2],
        'comma-dangle': ['error', {
            "arrays": "never",
            "objects": "never",
            "imports": "never",
            "exports": "never",
            "functions": "never"
        }],
        'object-curly-spacing': ['error', 'always', {
            objectsInObjects: true
        }],
        'import/no-unresolved': 'off',
        strict: 0,
        'no-plusplus': 0
    }
};