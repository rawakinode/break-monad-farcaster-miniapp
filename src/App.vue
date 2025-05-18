<script setup>
import { onMounted, onUnmounted, ref , computed, watch} from 'vue'
import { sdk } from '@farcaster/frame-sdk'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { parseEther, formatEther } from 'viem'
import { useAccount, useBalance, useSendTransaction, useSwitchChain  } from '@wagmi/vue'
import { login } from "./services/api";
import { generateRandomString } from "./utils/utility";

const { switchChain } = useSwitchChain()
const { address, chainId, isConnected } = useAccount()

watch(isConnected, async (connected) => {
  if (connected) {
    try {
      await switchChain({ chainId: 10143 })
    } catch (error) {
      console.error("Failed to switch chain:", error)
    }
  }
})

// Buat computed untuk parameter useBalance yang bergantung pada address
const balanceParams = computed(() => ({
  address: address.value // Akan otomatis update saat address tersedia
}))

// useBalance sekarang reaktif terhadap perubahan balanceParams
const { data: balanceData, status: balanceStatus } = useBalance(balanceParams)

console.log(address.value);

const { sendTransaction } = useSendTransaction()

const walletData = computed(() => ({
  address: address?.value,
  balance: balanceData?.value?.value ? Number(formatEther(balanceData.value.value)).toFixed(3) : '0.000'
}))


const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const username = ref([])
// const login = ref('');

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  try {
    await login();
    console.log(sessionStorage.getItem('token'));
    
    await sdk.actions.ready()
    switchChain({ chainId: 10143 })
    console.log("Chain ID: ", chainId.value)

    const currentChainId = await sdk.wallet.ethProvider.request({
      method: 'eth_chainId'
    })
    console.log(currentChainId);

    console.log("Chain ID 2: ", chainId.value)
  

    const accounts = await sdk.wallet.ethProvider.request({
      method: 'eth_requestAccounts',
    });

    console.log('Connected:', accounts);

    const user = await sdk.context.user;
    username.value = user.user;
    console.log('Frame berhasil ditambahkan ke Farcaster.')
  } catch (error) {
    console.error('Gagal menginisialisasi Farcaster frame:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <div class="app-container">
    <AppHeader :class="{'scrolled': isScrolled}" :walletData="walletData"/>
    
    <main class="main-content">      
      <router-view />
    </main>
    <AppFooter />
  </div>

</template>

<style scoped>
  .app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
