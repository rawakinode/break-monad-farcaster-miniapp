<template>
    <div class="filter-container">
      <div class="filter-box" @click.stop="toggleDropdown">
        <span>{{ selectedOption }}</span>
        <ChevronDownIcon class="chevron" :class="{ 'rotate-180': isOpen }" />
        <div v-if="isOpen" class="dropdown">
          <div 
            v-for="option in options" 
            :key="option"
            class="dropdown-item"
            @click.stop="selectOption(option)"
          >
            {{ option }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { ChevronDownIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    selected: {
      type: String,
      default: 'Newest'
    }
  })
  
  const emit = defineEmits(['update:selected'])
  
  const options = ['Newest', 'Oldest']
  const isOpen = ref(false)
  const selectedOption = ref(props.selected)
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const selectOption = (option) => {
    selectedOption.value = option
    isOpen.value = false
    emit('update:selected', option)
  }
  
  // Tambahkan handler klik di luar
  const clickOutsideHandler = (event) => {
    if (!event.target.closest('.filter-box')) {
      isOpen.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', clickOutsideHandler)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', clickOutsideHandler)
  })
  </script>
  
  <style scoped>
  .filter-container {
    position: fixed;
    top: 64px; /* Sesuaikan dengan tinggi header */
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    backdrop-filter: blur(8px);
    font-size: 14px;
  }
  
  .filter-box {
    position: relative;
    background: rgba(255, 255, 255, 0.7);
    width: 100%;
    border: 1px solid #e2e8f0;
    padding: 0.75rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: space-between;
  }
  
  .chevron {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s;
  }
  
  .filter-box:hover .chevron {
    transform: rotate(180deg);
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    margin-top: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  
  .dropdown-item {
    padding: 0.75rem 1rem;
    transition: background 0.2s;
  }
  
  .dropdown-item:hover {
    background: #f8fafc;
  }
  
  .dropdown-item:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  .dropdown-item:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  </style>