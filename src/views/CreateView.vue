<template>
  <div class="create-view">
    <div class="form-container">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="titleContent" class="form-input" maxlength="100" minlength="5"
          placeholder="Write a title ..." @input="validationTitle" />
        <p v-if="title_error" class="error">{{ title_error }}</p>
      </div>

      <div class="form-group">
        <Editor ref="editorContent" />
      </div>

      <div class="form-group">
        <label for="thumbnail">Thumbnail</label>
        <input style="font-family: inherit;" type="file" accept="image/png, image/jpeg" @change="handleFileUpload" ref="fileInput" />

        <div v-if="preview" style="margin-top: 1rem;">
          <img :src="preview" alt="Preview" style="max-width: 200px; max-height: 200px;" />
          <div>
            <button type="button" @click="removeImage" style="margin-top: 0.5rem;">Remove</button>
          </div>
        </div>
      </div>

      <button class="publish-button" @click="validateAll" :disabled="!isFormValid">
        Publish
      </button>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Publish</h3>
        <p>To prevent spam, you need <strong>1 MON</strong>. You can't <strong>edit</strong> or <strong>delete</strong> your article after published. Are you sure to continue ?</p>
        <div class="modal-actions">
          <button class="modal-button cancel" @click="showConfirmModal = false">Cancel</button>
          <button class="modal-button confirm" @click="handlePublish">Yes, Publish</button>
        </div>
      </div>
    </div>

    <div v-if="showLoadingModal" class="modal-overlay">
      <div class="modal-content loading">
        <div class="loader"></div>
        <p>{{ loading_message }}</p>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success">
        <div class="success-icon">✅</div>
        <h4>{{ modal_message }}</h4>
        <button class="close-button" @click="closeSuccessModal">Close</button>
      </div>
    </div>

    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal-content success">
        <div class="success-icon">❌</div>
        <h4>{{ modal_message }}</h4>
        <button class="close-button" @click="closeErrorModal">Close</button>
      </div>
    </div>

  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'
import { sdk } from '@farcaster/frame-sdk'
import { useSignMessage, useAccount, useWriteContract, useWaitForTransactionReceipt } from '@wagmi/vue'

import { generateRandomString, stripHTML } from "../utils/utility"
import Editor from "../components/Editor.vue"
import abi from "../contracts/abi"
import { CONTRACT_ADDRESS } from "../contracts/contract"


const router = useRouter()

const contractAddress = CONTRACT_ADDRESS;

const { address } = useAccount()
const { signMessage, data: signature, isSuccess } = useSignMessage()

const { writeContractAsync } = useWriteContract();

const hash = ref('');
const { isSuccess: isSuccessTx } = useWaitForTransactionReceipt({
  hash,
  query: {
    enabled: computed(() => !!hash.value),
  },
})

const titleContent = ref('')
const editorContent = ref(null)

const title_error = ref('')
const modal_message = ref('')
const loading_message = ref('')

const showConfirmModal = ref(false)
const showLoadingModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

const preview = ref(null)
const base64Image = ref(null)
const fileInput = ref(null)

const isFormValid = computed(() => {
  return titleContent.value.trim()
})

onMounted(async () => {
  await sdk.actions.ready()
})

const handlePublish = async () => {

  try {
    console.log(address.value);
  
    const domain = 'moneticle.rawaki.xyz'
    const nonce = generateRandomString(20);

    const wallet_message = `Sign this message to verify ownership of your wallet.
      Domain: ${domain}
      Address: ${address.value}
      Nonce: ${nonce}`;

    await signMessage({ message: wallet_message})

    while (!isSuccess.value) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // show loading
    loading_message.value = 'Uploading data ...'
    showConfirmModal.value = false
    showLoadingModal.value = true
    
    const getContent = editorContent.value?.getEditorContent()
    const response = await axios.post('https://api.rawaki.xyz/api/upload', {
      address: address.value,
      wallet_message: wallet_message,
      wallet_signature: signature.value,
      article: {
        title: titleContent.value,
        thumbnail: base64Image.value,
        content: getContent,
        description: stripHTML(getContent)
      }
    }, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    console.log(response.data);
    if (response.data.status != 'success') {
      showLoadingModal.value = false
      modal_message.value = 'Failed to upload data!'
      showErrorModal.value = true
      return;
    }

    loading_message.value = 'Confirming transaction ...'

    const ipfsHash = response.data.cid;
    const sendTx = await sendArticle(response.data.fid, titleContent.value, ipfsHash);
    console.log(sendTx);
    

    if (sendTx == false) {
      showLoadingModal.value = false
      modal_message.value = 'Transaction Error!'
      showErrorModal.value = true
      return;
    }

    modal_message.value = 'Publishing article successfully.'
    showLoadingModal.value = false
    showSuccessModal.value = true
    
  } catch (error) {
    showLoadingModal.value = false
    modal_message.value = 'Error! Failed to Publish.'
    showErrorModal.value = true
    return;
  }
}


const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/myarticle')
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

const validateAll = () => {

  const content = editorContent.value?.getEditorContent();
  const contentText = stripHTML(content)

  if (titleContent.value.length < 5){
    modal_message.value = 'Title is too short. Please enter at least 5 characters for clarity.'
    showErrorModal.value = true;
    return;
  }

  if (contentText.length < 100) {
    modal_message.value = 'Content is too short. Please write at least 100 characters to provide more detail.'
    showErrorModal.value = true;
    return;
  }

  if (!base64Image.value) {
    modal_message.value = 'Please add thubmnail.'
    showErrorModal.value = true;
    return
  }

  showConfirmModal.value = true
}

function validationTitle() {
  if (titleContent.value.length < 5) {
    title_error.value = 'Min 5 character'
  } else if (titleContent.value.length > 100) {
    title_error.value = 'Max 100 character'
  } else {
    title_error.value = ''
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]

  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 300
        const scaleFactor = MAX_WIDTH / img.width

        canvas.width = MAX_WIDTH
        canvas.height = img.height * scaleFactor

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.9) // 0.8 = quality

        preview.value = resizedBase64
        base64Image.value = resizedBase64

        console.log(base64Image.value);
        
      }
      img.src = e.target.result
    }

    reader.readAsDataURL(file)

  } else {
    modal_message.value = 'Please upload a valid JPG or PNG image.'
    showErrorModal.value = true;
    removeImage()
  }
}

function removeImage() {
  preview.value = null
  base64Image.value = null
  if (fileInput.value) {
    fileInput.value.value = '' // reset nilai input file
  }
}

const sendArticle = async (fid, title, ipfs) => {
  try {
    const txHash = await writeContractAsync({
      address: contractAddress,
      abi,
      functionName: "createArticle",
      args: [Number(fid), title, ipfs],
      value: BigInt(1e18),
    });

    hash.value = txHash;

    while (!isSuccessTx.value) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(hash.value);

    return txHash;
  } catch (error) {
    console.error("Failed send article:", error);
    return false;
  }
};


</script>

<style>
.create-view {
  margin-top: 4rem;
}

.form-container {
  background: none;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1a1a1a;
}

.form-input {
  width: calc(100% - 1.5rem);
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.content-editor {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
}

.publish-button {
  background: #48bb78;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.publish-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.publish-button:hover:not(:disabled) {
  background: #38a169;
}

/* Modal Styles */
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
  width: 70%;
  max-width: 400px;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.modal-button.confirm {
  background: #48bb78;
  color: white;
}

.modal-button.cancel {
  background: #f1f5f9;
  color: #64748b;
}

/* Loading Modal */
.loading {
  padding: 3rem 2rem;
}

/* Success Modal */
.success {
  padding: 1rem;
}

.success-icon {
  font-size: 48px;
  color: #48bb78;
  margin-bottom: 1rem;
}

.close-button {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
}
</style>