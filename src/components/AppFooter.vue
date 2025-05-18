<template>
    <footer class="footer">
      <nav class="nav">
        <ul class="nav-list">
          <router-link 
            v-for="(route, index) in routes" 
            :key="index" 
            :to="route.path" 
            v-slot="{ isActive }"
          >
            <li class="nav-item" :class="{'active': isActive}">
              <component :is="route.icon" class="icon" />
            </li>
          </router-link>
        </ul>
      </nav>
    </footer>
  </template>
  
  <script setup>
  import { BookOpenIcon, UserIcon, PencilIcon, SparklesIcon } from '@heroicons/vue/24/outline'
  
  const routes = [
    { path: '/', icon: SparklesIcon },
    { path: '/myarticle', icon: BookOpenIcon },
    { path: '/create', icon: PencilIcon },
    // { path: '/profile', icon: UserIcon }
  ]
  </script>
  
  <style scoped>
  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  </style>