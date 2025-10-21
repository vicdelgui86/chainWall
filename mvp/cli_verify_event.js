import fs from 'fs';
import { decodeHeader, computeHash } from '../src/nano_header.js';
import { getStoredPrev } from '../src/verifier.js';

(async () => {
  const [,, packetFile] = process.argv;
  if (!packetFile) {
    console.error('Usage: node verify_event.js <packet.bin>');
    process.exit(1);
  }
  const buf = fs.readFileSync(packetFile);
  const { hash, prev, payload } = decodeHeader(buf);
  const onChainPrevCV = await getStoredPrev(hash);
  console.log('Payload hash:', hash.toString('hex'));
  console.log('On-chain prev:', onChainPrevCV.value.toString());
  console.log('Local prev:', prev.toString('hex'));
})();
