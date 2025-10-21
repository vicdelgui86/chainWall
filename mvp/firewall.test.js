import { startReceiver, sendEvent } from '../src/firewall.js';

(async () => {
  startReceiver();
  await sendEvent('hello-world', false);
  // manual visual confirmation or extend to event capturing
  console.log('firewall basic test done');
})();
