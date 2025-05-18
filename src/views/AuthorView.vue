<template>
  <div class="book-view">

    <div v-if="author.displayName" class="box1">
        <div class="meta-header" style="margin-bottom: 0rem;">
            <div class="author-info">
              <img :src="author?.pfp?.url" class="author-logo" alt="author" />
              <span class="author-name" style="font-weight: bold;">{{ author?.displayName }}</span>
            </div>
            
            <div class="total-tip" style="color: #878787;font-size: 12px;">#{{ author?.username }}</div>
          </div>
    </div>

    <div v-if="articlesx.length > 0" class="content" style="margin-top: 0rem;">
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
const offset = ref(0)
const limit = ref(5)

const articlesx = ref([])

const author = ref([]);

onMounted(async () => {
  await getAuthor()
  console.log(author.value);
  
  await getArticle()
})

const props = defineProps({
  id: String
})

const getAuthor = async () => {
    try {       
        const g = await axios.get(`https://api.rawaki.xyz/user?fid=${props.id}`)
        author.value = g.data.data
    } catch (error) {
        return null
    }
}

const getArticle = async (reset = false) => {
  try {
    if (reset) {
      offset.value = 0
      articlesx.value = []
    }

    const resultData = await axios.get(`https://api.rawaki.xyz/article_by_fid?offset=${offset.value}&limit=${limit.value}&fid=${props.id}`);

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
  await getArticle(false) // Ambil data selanjutnya
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