// src/composables/useWallet.ts
import { config } from '../configs/wagmi-config';
import { connect, getAccount, disconnect } from '@wagmi/core';

export function useWallet() {
    
  const connectWallet = async () => {
    const result = await connect(config);
    return result;
  };

  const getWalletAccount = async () => {
    const acc = await getAccount(config);
    return acc;
  };

  const disconnectWallet = async () => {
    await disconnect(config);
  };

  return {
    connectWallet,
    getWalletAccount,
    disconnectWallet,
  };
}
