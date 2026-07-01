import {
  getBase64Hash,
  chashGetChash160,
  getUnitHashToSign,
  isChashValid,
} from '../src/internal';

// Characterization tests that pin the exact output of every hashing code path
// (sha256 + ripemd160). These golden values were produced by the create-hash
// implementation and MUST stay byte-identical if the hashing backend is swapped,
// otherwise addresses / unit hashes / signatures would diverge from the Obyte network.
describe('hashing (golden vectors)', () => {
  const obj = { foo: 'bar', arr: [1, 2, 3], nested: { z: 9, a: 'k' }, flag: true };
  const unit = {
    version: '3.0',
    signed_message: 'test',
    authors: [{ address: 'ABCDEF', definition: ['sig', { pubkey: 'Ag5xW' }] }],
  };

  describe('getBase64Hash (sha256)', () => {
    it('json-based source string', () => {
      expect(getBase64Hash(obj, true)).toEqual('7CmALEWiJDas7Ua2glrm46vi2Wr29B/78O3dXv/yIm0=');
    });
    it('prefixed source string', () => {
      expect(getBase64Hash(obj, false)).toEqual('R1MuDpvrdfF5UO7X/VIQBCjUuzBxof+yVjQ9heCSfGg=');
    });
  });

  describe('chashGetChash160 (ripemd160 + sha256 checksum)', () => {
    it('hashes "hello world"', () => {
      expect(chashGetChash160('hello world')).toEqual('EOGLS77CUSW5XICQX5S3L3TGAZG2S7AP');
    });
    it('hashes "a"', () => {
      expect(chashGetChash160('a')).toEqual('K23LB5PM62K6GY6L2N7J5YUTV3KHH376');
    });
    it('produces a valid c-hash', () => {
      expect(isChashValid(chashGetChash160('hello world'))).toEqual(true);
    });
  });

  describe('getUnitHashToSign (sha256 digest)', () => {
    it('returns the expected 32-byte digest', () => {
      const digest = getUnitHashToSign(unit);
      expect(Buffer.isBuffer(digest) || digest instanceof Uint8Array).toBe(true);
      expect(digest.length).toBe(32);
      expect(Buffer.from(digest).toString('hex')).toEqual(
        '5f5653c27fc18f8727ac5f7d158b07961e48c29a39bf8544958e27d19534faee',
      );
    });
  });

  describe('isChashValid', () => {
    it('accepts a valid address', () => {
      expect(isChashValid('5TROF7O466QKXR3N6AUYKYYQ2JCY24EJ')).toEqual(true);
    });
    it('rejects a corrupted address', () => {
      expect(isChashValid('5TROF7O466QKXR3N6AUYKYYQ2JCY24E0')).toEqual(false);
    });
  });
});
