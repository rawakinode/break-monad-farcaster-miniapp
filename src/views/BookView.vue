<template>
  <div class="book-view">
    <FilterDropdown v-model:selected="selectedFilter" />
    
    <div v-if="articlesx.length > 0" class="content">
      <div v-for="article in articlesx" :key="article.article_id" class="article-card">
        <div class="article-content">
          <div class="meta-header">
            <router-link class="author-info clickable-area" :to="{ name: 'author', params: { id: article.account_id } }">
              <img :src="article?.profile" class="author-logo" alt="author" />
              <span class="author-name">{{ article?.display_name }}</span>
            
            </router-link>
            
            <div class="total-tip"><img src="/public/mon_logo.svg" alt="" height="10px"> {{ article.tip_earned }} MON</div>
          </div>

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
              <button :disabled="address == article.wallet_address" class="tip-button" @click="handleTip(article.article_id)">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tip Me
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!limitReached">
        <button class="load-more-button" @click="loadMore" v-if="!loadingMore">
          Load More
        </button>
        <div v-else class="loader2"></div>
      </div>
    </div>
  </div>

   <TipModal 
    :show="showTipModal" 
    :showState="showTipModalState"
    @close="showTipModal = false"
    @send="handleSendTip"
  />

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FilterDropdown from '../components/FilterDropdown.vue'
import TipModal from '../components/TipModal.vue'
import { useWriteContract, useBalance, useAccount } from '@wagmi/vue'
import abi from "../contracts/abi";
import { CONTRACT_ADDRESS } from "../contracts/contract";
import axios from 'axios'
import { formatEther, parseEther } from "viem";

const { address } = useAccount()
const balanceParams = computed(() => ({address: address.value}))
const { data: balance } = useBalance(balanceParams)

const showTipModal = ref(false)
const showTipModalState = ref({ status: 'input', nonce: 0 , message: ''})
const selectedArticleId = ref(null)

const { writeContractAsync } = useWriteContract();

const limitReached = ref(false)
const loadingMore = ref(false)
const selectedFilter = ref('Newest')
const offset = ref(0)
const limit = ref(5)

const articlesx = ref([])

onMounted(async () => {
  await getArticle()
})

watch(selectedFilter, async () => {
  await getArticle(true)
})

const getArticle = async (reset = false) => {
  try {
    if (reset) {
      offset.value = 0
      articlesx.value = []
    }

    const resultData = await axios.get(`https://api.rawaki.xyz/articles?offset=${offset.value}&limit=${limit.value}&orderBy=${selectedFilter.value}`);

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

const handleTip = (articleId) => {
  selectedArticleId.value = articleId
  showTipModal.value = true
}

const handleSendTip = async (amount) => {
  try {

    const getBal = balance.value.value ? Number(formatEther(balance.value.value)) : 0
    console.log(getBal);
    console.log(Number(amount));
    
    
    if ( Number(amount) > getBal) {
      showTipModalState.value = { status: 'error', nonce: Date.now(),  message: 'insufficient balance!'}
      return;
    }

    console.log('Send', amount, 'Tip to id article: ', selectedArticleId.value)
    
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "tipArticle",
      args: [Number(selectedArticleId.value)],
      value: parseEther(amount.toString()),
    });

    showTipModalState.value = { status: 'success', nonce: Date.now(), message: 'Transaction complete.'}

  } catch (error) {
    showTipModalState.value = { status: 'error', nonce: Date.now(),  message: 'Transaction rejected!'}
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}


</script>

<style>

</style>