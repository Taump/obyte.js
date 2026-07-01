// Browser-only drop-in for the native `secp256k1` package. webpack maps `secp256k1`
// to this file via resolve.alias, so the browser bundle uses pure-JS @noble/curves
// instead of secp256k1's elliptic + bn.js fallback (~200 KiB). Node keeps the native
// module. Only the three functions src/internal.js needs are implemented, with the
// same shapes (ecdsaSign returns { signature, recid }; outputs are Uint8Array).
// eslint-disable-next-line import/no-extraneous-dependencies
import { secp256k1 } from '@noble/curves/secp256k1';

export function ecdsaSign(message, privateKey) {
  const sig = secp256k1.sign(message, privateKey); // deterministic RFC6979, low-S
  return { signature: sig.toCompactRawBytes(), recid: sig.recovery };
}

export function ecdsaVerify(signature, message, publicKey) {
  return secp256k1.verify(signature, message, publicKey);
}

export function publicKeyCreate(privateKey, compressed = true) {
  return secp256k1.getPublicKey(privateKey, compressed);
}

export default { ecdsaSign, ecdsaVerify, publicKeyCreate };
