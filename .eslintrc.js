module.exports = {
    root: true,
    "env": { 
        "es6": true,
        "browser": true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },    
    "globals": {
        "$": true,        
    },
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        // "linebreak-style": ["error", "unix"],
        // "quotes": ["error", "double"],
        // "semi": ["error", "always"],

        // // override default options for rules from base configurations
        // "comma-dangle": ["error", "always"],
        // "no-cond-assign": ["error", "always"],
        // 'arrow-parents': 0,
        // // disable rules from base configurations
         "no-console": "off",
    }
}