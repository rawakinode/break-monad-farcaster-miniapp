<template>
  <div class="book-view">
    <div class="content" style="margin-top: 3.6rem;">
        <h3 class="subpage">My Articles</h3>
        
      <div v-for="article in articlesx" :key="article.article_id" class="article-card">
        <div class="article-content">

          <router-link 
            :to="{ name: 'article', params: { id: article.article_id } }" 
            class="main-content-2 clickable-area"
          >
            <div class="text-content">
              <h2 class="title title-max-line">{{ article.title }}</h2>
              <p class="description description-max-line">{{ article.description }}</p>
            </div>
            <div class="cover-container">
              <img :src="article.thumbnail" :alt="article.title" class="cover-image" />
            </div>
          </router-link>

          <div class="action-bar">
            <span class="date">{{ formatDate(article.created_at_human) }}</span>
            <div class="tip-container">
              <span class="tip-count">{{ article.tip_count }} Tip</span>
              <div class="total-tip"><img src="/public/mon_logo.svg" alt="" height="10px"> {{ article.tip_earned }} MON</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!limitReached && articlesx.length > 0">
        <button class="load-more-button" @click="loadMore" v-if="!loadingMore">
          Load More
        </button>
        <div v-else class="loader2"></div>
      </div>

    </div>
  </div>

  <button 
    class="floating-edit-button"
    @click="goToCreate"
    aria-label="Create"
  >
  <PencilIcon/>
    </button>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { sdk } from '@farcaster/frame-sdk'

const router = useRouter()

const limitReached = ref(false)
const loadingMore = ref(false)
const offset = ref(0)
const limit = ref(5)
const articlesx = ref([])

onMounted(async () => {
  await getArticle()
})

const goToCreate = () => {
  router.push('/create')
}

const getArticle = async (reset = false) => {
  try {

    const userData = await sdk.context.user;
    console.log(userData);
    
    if (reset) {
      offset.value = 0
      articlesx.value = []
    }

    const resultData = await axios.get(`https://api.rawaki.xyz/article_by_fid?offset=${offset.value}&limit=${limit.value}&fid=${userData.user.fid}`);

    const newData = resultData?.data?.data || [];
    articlesx.value = [...articlesx.value, ...newData]

    if (newData.length > 0) {
      offset.value += limit.value
      if (newData.length <= limit.value) {
        limitReached.value = true;
      }
    }else{
      limitReached.value = true;
    }

  } catch (error) {
    return null;
  }
}

const loadMore = async () => {
  loadingMore.value = true
  await getArticle(false) 
  loadingMore.value = false
}


const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

</script>

<style>

.floating-edit-button {
  position: fixed;
  bottom: 6.5rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  padding: 1rem;
  border-radius: 50%;
  background: #ffffff;
  color: black;
  border: 1px solid #e2e2e2;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.floating-edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  background: #000000;
  color: white;
}

.floating-edit-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-icon {
  width: 1.5rem;
  height: 1.5rem;
}

</style>