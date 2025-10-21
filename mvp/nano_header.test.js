import assert from 'assert';
import { encodeHeader, decodeHeader, verifyHeader } from '../src/nano_header.js';

const prev = Buffer.alloc(8, 0x01);
const payload = 'test-event';
const packet = encodeHeader(prev, payload);
const { hash, prev: pv, payload: pl } = decodeHeader(packet);
assert(pv.equals(prev));
const res = verifyHeader(packet, prev);
assert(res.validHash && res.validPrev);
console.log('nano_header tests passed');
