<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>
      
      <div v-if="state === 'input'">
        <h3>Send Tip</h3>
        <div class="input-group">
          <input
            type="number"
            v-model="ethAmount"
            placeholder="0.01"
            step="0.01"
            min="0.01"
            class="eth-input"
          />
          <span class="eth-symbol">MON</span>
        </div>
        <button 
          class="send-button"
          @click="handleSend"
          :disabled="!isValidAmount"
        >
          Send
        </button>
      </div>

      <div v-if="state === 'loading'" class="loading-state">
        <div class="spinner"></div>
        <p>Sending transaction...</p>
      </div>

      <div v-if="state === 'success'" class="success-state">
        <div class="checkmark">✓</div>
        <p>{{ stateMessage }}</p>
        <button class="close-success" @click="closeModal">Close</button>
      </div>

      <div v-if="state === 'error'" class="success-state">
        <div class="errormark"><XMarkIcon style="height: 4rem; margin-top: 2rem; margin-bottom: -1rem;"/></div>
        <p>{{ stateMessage }}</p>
        <button class="close-success" @click="closeModal" style="background-color: red;">Close</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  showState: String
})

const emit = defineEmits(['close', 'send'])

const ethAmount = ref('')
const state = ref(props.showState.status)
const stateMessage = ref(props.showState.message)

watch(() => props.showState, (newVal) => {
  state.value = newVal.status,
  stateMessage.value = newVal.message
})

const isValidAmount = computed(() => {
  return ethAmount.value >= 0.01
})

const handleSend = () => {
  state.value = 'loading'
  emit('send', ethAmount.value)
}

const closeModal = () => {
  ethAmount.value = ''
  state.value = 'input'
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
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

.modal-content {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  max-width: 400px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.input-group {
  margin: 1.5rem 0;
  position: relative;
}

.eth-input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  padding-right: 60px;
}

.eth-symbol {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.send-button {
  width: 100%;
  padding: 1rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.send-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #48bb78;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-state {
  text-align: center;
}

.checkmark {
  font-size: 3rem;
  color: #48bb78;
  margin-bottom: 1rem;
}

.errormark {
  font-size: 3rem;
  color: #df0000;
  margin-bottom: 1rem;
}

.close-success {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>