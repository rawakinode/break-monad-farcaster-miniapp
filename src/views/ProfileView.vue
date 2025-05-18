<template>
  <div class="profile-view">
    <!-- Box 1: Profil -->
    <div class="profile-box">
      <div class="profile-header">
        <img src="https://pbs.twimg.com/profile_images/1806348492362887168/excjCeXF_400x400.jpg" class="profile-pic" alt="Profile">
        <div class="profile-info">
          <h2 class="name">Blockchain Expert</h2>
          <p class="username">rawakinode</p>
        </div>
      </div>
    </div>

    <!-- Box 3: Tabs -->
    <div class="tabs-box">
      <div class="tabs-header">
        <button 
          class="tab-button" 
          :class="{ 'active': activeTab === 'article' }"
          @click="activeTab = 'article'"
        >
          Article
        </button>
        <button 
          class="tab-button"
          :class="{ 'active': activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          Activity
        </button>
      </div>
      
      <div class="tabs-content">
        <div v-if="activeTab === 'article'" class="tab-pane">
          <p class="no-data">No Data</p>
        </div>
        <div v-if="activeTab === 'activity'" class="tab-pane">
          <!-- Konten activity bisa ditambahkan disini -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('article')
</script>

<style>
.profile-view {
  padding: 0.5rem;
  max-width: 600px;
  margin: 3.3rem auto;
}

.profile-box {
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.profile-header {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  text-align: left;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin: 0;
  font-size: 1rem;
}

.username {
  color: #666;
  margin: 0.25rem 0;
  font-size: 0.8rem;
}

.eth-address {
  font-family: monospace;
  color: #666;
  font-size: 0.9rem;
  word-break: break-all;
}

.tabs-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
}

.tab-button.active {
  color: #48bb78;
  border-bottom: 2px solid #48bb78;
}

.tabs-content {
  padding: 1.5rem;
  min-height: 200px;
}

.no-data {
  text-align: center;
  color: #999;
  margin: 2rem 0;
}


/* Responsive Design */
@media (max-width: 480px) {
  
  .eth-address {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>