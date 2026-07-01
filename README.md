[![npm](https://img.shields.io/npm/v/obyte.svg)](https://www.npmjs.com/package/obyte)
![npm](https://img.shields.io/npm/dm/obyte.svg)
![CircleCI](https://img.shields.io/circleci/project/github/bonustrack/obyte.js.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/bonustrack/obyte.js/master/LICENSE)

# Obyte.js

A pure and powerful JavaScript Obyte library.

**[Documentation](https://obytejs.com)**

## Getting started

To install and run Obyte.js, follow this quick start guide

### Install

Obyte.js was designed to work both in the browser and in Node.js.

#### Node.js
To install Obyte.js on Node.js, open your terminal and run:
```
npm i obyte --save
```

#### Browser

You can create an index.html file and include Obyte.js with:

```html
<script src="https://cdn.jsdelivr.net/npm/obyte"></script>
```

### Usage

Ways to initiate WebSocket client:

```js
const obyte = require('obyte');

// Connect to mainnet official node 'wss://obyte.org/bb'
const client = new obyte.Client();

// Connect to a custom node
const client = new obyte.Client('wss://obyte.org/bb');

// Connect to testnet
const options = { testnet: true };
const client = new obyte.Client('wss://obyte.org/bb-test', options);
```

Close the client:
```js
client.close();
```

All API methods follow this pattern:
```js
// If the last argument is a function it is treated as a callback
client.api.getJoint('oj8yEksX9Ubq7lLc+p6F2uyHUuynugeVq4+ikT67X6E=', function(err, result) {
  console.log(err, result);
});

// If a callback is not provided, a Promise is returned
client.api.getJoint('oj8yEksX9Ubq7lLc+p6F2uyHUuynugeVq4+ikT67X6E=').then(function(result) {
  console.log(result);
});
```

### Transaction

To compose and post unit you need first to create a Obyte wallet and fund it with the native currency ‘bytes’. The generated WIF will be used on Obyte.js. Click on the link below to learn more:

[Generate a random address](https://obytejs.com/utils/generate-wallet)

Sending a payment:
```js
const wif = '5JBFvTeSY5...'; // WIF string generated (private key)

const params = {
  outputs: [
    {
      address: 'NX2BTV43XN6BOTCYZUUFU6TK7DVOC4LU', // The Obyte address of the recipient 
      amount: 1000 // The amount he receives
    }
  ]
};

client.post.payment(params, wif, function(err, result) {
  console.log(result); // The unit hash is returned
});
```

## Migration to 0.2.0

`0.2.0` modernizes the internals (updated dependencies, pure-JS crypto, a much smaller
browser bundle) and is **backward compatible for normal use** — addresses, signatures and
WIF keys are byte-for-byte identical, and messages signed by older versions still validate
(and vice-versa). There is **one** breaking change to watch for.

### `utils.fromWif().privateKey` is now a `Uint8Array` (was a `Buffer`)

The bytes are exactly the same — only the type changed, so `Buffer`-specific methods behave
differently:

```js
const { privateKey } = obyte.utils.fromWif(wif, false);

privateKey.toString('hex'); // ❌ 0.1.x: "42...42"  |  0.2.0: "66,66,...,66"
privateKey.equals(other);   // ❌ Uint8Array has no .equals()
```

If your code consumed the private key as a `Buffer`, wrap it once:

```js
const privateKey = Buffer.from(obyte.utils.fromWif(wif, false).privateKey);
// now .toString('hex'), .equals(), etc. work as before
```

Everything else is unchanged. `utils.toWif()` and `utils.signMessage({ privateKey })` still
accept **both** `Buffer` and `Uint8Array`, so passing a `Buffer` keeps working.

## License

[MIT](LICENSE).
