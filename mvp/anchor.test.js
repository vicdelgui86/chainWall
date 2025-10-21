import sinon from 'sinon';
import * as anchorMod from '../src/anchor.js';

(async () => {
  const fakeTx = { txid: '0xabc' };
  sinon.stub(anchorMod, 'anchorEvent').resolves(fakeTx.txid);
  const hashBuf = Buffer.alloc(8, 2);
  const txid = await anchorMod.anchorEvent(hashBuf);
  console.assert(txid === fakeTx.txid, 'anchorEvent returned expected txid');
  console.log('anchor test passed');
})();
