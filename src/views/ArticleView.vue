<template>
  <div class="article-view">
    <button class="back-button" @click="$router.go(-1)">
      ← Back
    </button>
    
    <div v-if="isArticle == 'success'" class="article-content">
      <h1 class="title title-max-line" style="font-size: 1.8rem;">{{ article?.ipfs?.title }}</h1>
      
      <div class="meta-info">
        <router-link class="author-info clickable-area" :to="{ name: 'author', params: { id: article?.author?.result?.user?.fid } }">
          <img :src="article?.author?.result?.user?.pfp?.url" class="author-logo" />
          <span class="author-name">{{ article?.author?.result?.user?.displayName }}</span>
        </router-link>
        <span class="date" style="font-size: 0.7rem;">{{ formatDate(BigNumber.from(article?.data[7].hex).toNumber() * 1000) }}</span>
      </div>

      <div class="show-html-content" v-html="article?.ipfs?.content"></div>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ utils.formatEther((article?.data[6]))}} MON</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ BigNumber.from(article?.data[5].hex).toNumber() }} Tip</span>
        </div>
      </div>
    </div>
    <div v-if="isArticle == 'error'">Article not found</div>
    <div v-if="isArticle == 'loading'" class="loader2"></div>
  </div>
  

   <!-- Floating Action Buttons -->
    <div class="floating-buttons">
      <button style="font-size: 0.8rem;" class="floating-button tip-button" @click="handleTip(article.id)">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Tip Me
      </button>
      
      <button class="floating-button share-button" @click="handleShare">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        Share
      </button>
    </div>

  <TipModal 
    :show="showTipModal" 
    :showState="showTipModalState"
    @close="showTipModal = false"
    @send="handleSendTip"
  />

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TipModal from '../components/TipModal.vue'
import { useWriteContract, useBalance, useAccount } from '@wagmi/vue'
import abi from "../contracts/abi";
import { CONTRACT_ADDRESS } from "../contracts/contract";
import axios from 'axios'
import { formatEther, parseEther } from "viem";
import { BigNumber, utils } from 'ethers';

const { address } = useAccount()
const balanceParams = computed(() => ({address: address.value}))
const { data: balance } = useBalance(balanceParams)

const showTipModal = ref(false)
const showTipModalState = ref({ status: 'input', nonce: 0 , message: ''})
const selectedArticleId = ref(null)

const { writeContractAsync } = useWriteContract();

onMounted(async () => {
  try {
    await getArticle()
  } catch (error) {}
})

const handleTip = (articleId) => {
  selectedArticleId.value = articleId
  showTipModal.value = true
}

const handleShare = () => {
  const shareUrl = `https://warpcast.com/miniapps/OK8WN5G3Q-ZU/moneticle/article/${props.id}`
  const warpcastUrl = `https://warpcast.com/~/compose?text=I just read article on Moneticle. Check this out!.!&embeds[]=${shareUrl}`
  window.open(warpcastUrl, '_blank')
}

const props = defineProps({
  id: String
})

const article = ref({})
const isArticle = ref('loading')

const getArticle = async () => {
  try {
    const articleData = await axios.get(`https://api.rawaki.xyz/article?id=${props.id}`);
    article.value = articleData.data;
    isArticle.value = 'success'
  } catch (error) {
    isArticle.value = 'error'
    return null;
  }
}

const handleSendTip = async (amount) => {
  try {

    const getBal = balance.value.value ? Number(formatEther(balance.value.value)) : 0
    if ( Number(amount) > getBal) {
      showTipModalState.value = { status: 'error', nonce: Date.now(),  message: 'insufficient balance!'}
      return;
    }
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
.article-view {
  max-width: 800px;
  margin: 4rem auto;
  padding: 0 1rem;
}

.back-button {
  font-family: inherit;
  background: aliceblue;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.back-button:hover {
  background: #f1f5f9;
}

.floating-buttons {
  position: fixed;
  bottom: 87px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none;
  z-index: 999;
}

.floating-button {
  justify-content: center;
  pointer-events: auto;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.share-button {
  background: #3b82f6;
  color: white;
}

.share-button:hover {
  background: #2563eb;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.stats {
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 0.8rem;
  font-weight: 500;
  display: block;
  color: #3359c2;
  background: #ecf2fe;
  border-radius: 5px;
  padding: 2px 10px;
}

.stat-label {
  color: #64748b;
  font-size: 0.7rem;
}

.show-html-content > img {
    width: 100%;
}

.show-html-content {
  margin-top: 3rem;
}

.show-html-content > h1{
  font-size: 1.6rem;
}

.show-html-content > h2{
  font-size: 1.4rem;
}
.show-html-content > h3{
  font-size: 1.2rem;
}

.show-html-content > p,
.show-html-content > a {
  font-size: 0.9rem;
}
</style>