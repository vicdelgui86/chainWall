import {
  callReadOnlyFunction,
  bufferCV,
  contractPrincipalCV
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const NETWORK = new StacksTestnet();

export async function getStoredPrev(hashBuf) {
  const hashBufCV = bufferCV(hashBuf);
  const options = {
    contractAddress: process.env.CW_CONTRACT_ADDRESS,
    contractName: process.env.CW_CONTRACT_NAME,
    functionName: 'get-prev',
    functionArgs: [hashBufCV],
    network: NETWORK,
    senderAddress: process.env.SENDER_ADDRESS,
  };
  const ret = await callReadOnlyFunction(options);
  return ret;  // interpret as u126
}
