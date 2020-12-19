module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/camelcase": ["off"],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase"],
        leadingUnderscore: "allow"
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE"],
        leadingUnderscore: "allow"
      },

      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"]
      },
      {
        selector: "property",
        format: ["camelCase", "PascalCase", "snake_case"],
        leadingUnderscore: "allow"
      }
    ],
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "generic"
      }
    ],
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "explicit"
      }
    ],
    "@typescript-eslint/indent": [
      "error",
      2
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        }
      }
    ],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-magic-numbers": [
      "error",
      {
        "ignoreEnums": true,
        "ignoreReadonlyClassProperties": true,
        "ignore": [1, 0, -1]
      }
    ],
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/quotes": [
      "error",
      "double"
    ],
    "@typescript-eslint/semi": [
      "error",
      "always"
    ],
    "@typescript-eslint/type-annotation-spacing": "error",
    "arrow-parens": [
      "error",
      "always"
    ],
    "brace-style": [
      "error",
      "1tbs"
    ],
    "comma-dangle": "error",
    "complexity": "error",
    "constructor-super": "error",
    "curly": "error",
    "eqeqeq": [
      "error",
      "smart"
    ],
    "guard-for-in": "error",
    "id-blacklist": [
      "error",
      "any",
      "Number",
      "number",
      "String",
      "string",
      "Boolean",
      "boolean",
      "Undefined",
      "undefined"
    ],
    "id-match": "error",
    "sort-imports": "error",
    "max-classes-per-file": [
      "error",
      1
    ],
    "max-len": [
      "error",
      {
        "code": 140
      }
    ],
    "max-lines": [
      "error",
      900
    ],
    "new-parens": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-irregular-whitespace": "error",
    "no-multiple-empty-lines": "error",
    "no-redeclare": "error",
    "no-trailing-spaces": "error",
    "no-underscore-dangle": "error",
    "no-unsafe-finally": "error",
    "no-var": "error",
    "one-var": [
      "error",
      "never"
    ],
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      }
    ],
    "prefer-arrow/prefer-arrow-functions": "off",
    "quote-props": [
      "error",
      "as-needed"
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        "markers": [
          "/"
        ]
      }
    ]
  }
};
