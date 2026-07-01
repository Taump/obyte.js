import crypto from 'crypto';
import shim from '../src/secp256k1-browser';

// The browser bundle swaps native secp256k1 for this @noble/curves shim. These golden
// vectors (identical to the native ones in internal.spec) guarantee the browser build
// produces byte-identical signatures / public keys, so it stays compatible with Obyte.
describe('secp256k1 browser shim (@noble/curves)', () => {
  const priv = Buffer.from('o3QzctZnfJPw0u8z2Sj6j2gCOvf1L4+CtmSfdy/B4Gk=', 'base64');
  const hash = crypto.createHash('sha256').update('hello world', 'utf8').digest();

  it('ecdsaSign matches the native signature vector', () => {
    const { signature } = shim.ecdsaSign(hash, priv);
    expect(Buffer.from(signature).toString('base64')).toEqual(
      'ssCl6equnJZGgKzTSJqsRr3tDN8BzmriGdMYPrVHyhYy+E/KV6/cA+sYX5i7TJ9voYpfd23EAFAYQoGy905Jgg==',
    );
  });

  it('publicKeyCreate matches the native vector', () => {
    const priv2 = Buffer.from('PtEd3lkAsTmEhk4eIMrzda1DCDM0WyFellEZBawTZXg=', 'base64');
    expect(Buffer.from(shim.publicKeyCreate(priv2)).toString('base64')).toEqual(
      'A19xfW9UANOlhj9cK/13BdJCEgMJ2lH+iYvayv0FPLbN',
    );
  });

  it('ecdsaVerify roundtrips', () => {
    const { signature } = shim.ecdsaSign(hash, priv);
    expect(shim.ecdsaVerify(signature, hash, shim.publicKeyCreate(priv))).toBe(true);
  });
});
