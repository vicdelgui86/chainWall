import crypto from 'crypto';

export function computeHash(data) {
  const h = crypto.createHash('blake2b512').update(data).digest();
  return h.slice(0, 8); // first 8 bytes
}

export function encodeHeader(prevHash, payload) {
  const payloadBuf = Buffer.from(payload);
  const hash = computeHash(payloadBuf);
  const header = Buffer.alloc(16);
  hash.copy(header, 0);
  prevHash.copy(header, 8);
  return Buffer.concat([header, payloadBuf]);
}

export function decodeHeader(buf) {
  const hash = buf.slice(0, 8);
  const prev = buf.slice(8, 16);
  const payload = buf.slice(16);
  return { hash, prev, payload };
}

export function verifyHeader(buf, expectedPrev) {
  const { hash, prev, payload } = decodeHeader(buf);
  const recalc = computeHash(payload);
  const validHash = recalc.equals(hash);
  const validPrev = prev.equals(expectedPrev);
  return { validHash, validPrev, hash, prev };
}
