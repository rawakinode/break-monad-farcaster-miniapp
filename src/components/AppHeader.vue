<template>
  <div>
    <header class="header" :class="{ 'scrolled': isScrolled }">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon"><img  class="logo-icon" src="/public/moneticle_logo.jpg" alt=""></div>
          <span>Moneticle</span>
        </div>
        <div class="eth-balance" @click="showModal = true">
          <span style="margin-right: 0.5rem;">{{ walletData.balance }}</span>
          <img src="/public/mon_logo.svg" alt="MON" class="eth-balance-icon">
        </div>
      </div>
    </header>

    <EthBalanceModal 
      :show="showModal"
      :eth-address="walletData.address"
      :eth-balance="walletData.balance"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
defineProps({
  isScrolled: Boolean,
  walletData: Object,
})

import { ref } from 'vue'
import EthBalanceModal from './EthBalanceModal.vue'

const showModal = ref(false)

</script>

<style scoped>
.logo-icon {
  width: 2rem;
  height: 2rem;
  background-color: #3b82f6;
  border-radius: 0.5rem;
}
</style>