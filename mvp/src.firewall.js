import dgram from 'dgram';
import { encodeHeader, verifyHeader } from './nano_header.js';
import { anchorEvent } from './anchor.js';

const PORT = process.env.CW_PORT || 6000;
const HOST = process.env.CW_HOST || '0.0.0.0';

let prevHash = Buffer.alloc(8, 0);

export function startReceiver() {
  const sock = dgram.createSocket('udp4');
  sock.on('message', (msg, rinfo) => {
    const { validHash, validPrev } = verifyHeader(msg, prevHash);
    if (validHash && validPrev) {
      console.log(`✔ Valid event from ${rinfo.address}`);
      prevHash = msg.slice(0,8);
    } else {
      console.warn(`✖ Invalid event`);
    }
  });
  sock.bind(PORT, HOST, () => {
    console.log(`Receiver listening on ${HOST}:${PORT}`);
  });
}

export async function sendEvent(payload, doAnchor = false) {
  const sock = dgram.createSocket('udp4');
  const packet = encodeHeader(prevHash, payload);
  return new Promise((resolve, reject) => {
    sock.send(packet, 0, packet.length, PORT, '127.0.0.1', async (err) => {
      if (err) return reject(err);
      const newHash = packet.slice(0,8);
      if (doAnchor) {
        try {
          const txid = await anchorEvent(newHash);
          console.log('Anchored event, txid =', txid);
        } catch (e) {
          console.error('Anchor failed:', e);
        }
      }
      prevHash = newHash;
      sock.close();
      resolve();
    });
  });
}
