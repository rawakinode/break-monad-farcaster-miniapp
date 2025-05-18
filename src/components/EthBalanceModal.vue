<template>
  <div v-if="show" class="eth-modal-overlay" @click.self="close">
    <div class="eth-modal-content">
      <button class="close-button" @click="close">×</button>
      
      <div class="modal-header">
        <img class="eth-icon-lg" src="/public/mon_logo.svg" alt="">
        <h3>Wallet</h3>
      </div>

      <div class="address-section">
        <span class="address">{{ truncatedAddress }}</span>
        <button class="copy-button" @click="copyAddress">
          <svg class="copy-icon" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
      </div>

      <div class="balance-section">
        <span class="balance">{{ ethBalance }}</span>
        <span class="currency">MON</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  ethAddress: String,
  ethBalance: String
})

const emit = defineEmits(['close'])

const truncatedAddress = computed(() => {
  return props.ethAddress 
    ? `${props.ethAddress.slice(0, 6)}...${props.ethAddress.slice(-4)}`
    : ''
})

const copyAddress = () => {
  navigator.clipboard.writeText(props.ethAddress)
  emit('close')
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.eth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.eth-modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  max-width: 270px;
  width: 100%;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0rem;
}

.eth-icon-lg {
  width: 32px;
  height: 32px;
}

.address-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.address {
  font-family: monospace;
  font-size: 0.9rem;
  color: #64748b;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #64748b;
}

.copy-icon {
  width: 18px;
  height: 18px;
}

.balance-section {
  text-align: center;
}

.balance {
  font-size: 2rem;
  font-weight: bold;
  margin-right: 0.5rem;
}

.currency {
  font-size: 1.5rem;
  color: #64748b;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}
</style>