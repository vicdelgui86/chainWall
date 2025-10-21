import {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  AnchorMode,
  PostConditionMode
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const NETWORK = new StacksTestnet();
const CONTRACT_ADDRESS = process.env.CW_CONTRACT_ADDRESS;
const CONTRACT_NAME = process.env.CW_CONTRACT_NAME;
const SENDER_PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY;

export async function anchorEvent(hashBuf) {
  if (!SENDER_PRIVATE_KEY) throw new Error('Missing key');
  const hashHex = hashBuf.toString('hex');
  const hashUint = uintCV(BigInt('0x' + hashHex));
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'anchor',
    functionArgs: [hashUint],
    senderKey: SENDER_PRIVATE_KEY,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
  const tx = await makeContractCall(txOptions);
  const res = await broadcastTransaction(tx, NETWORK);
  return res.txid;
}
