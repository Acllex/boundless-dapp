<script lang="ts" setup>
import { NFTStorage } from 'nft.storage'
import { UploadFilled } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { genFileId, ElMessage } from 'element-plus'
import type {
  FormInstance,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile
} from 'element-plus'
import { ipfsToHttps } from '@/utils'
import { useUsersStore } from '@/stores/users'
import { useNftStore } from '@/stores/nft'
import { fetch } from 'nft.storage/src/platform.js'
import { useRouter } from 'vue-router'
const usersStore = useUsersStore()
const nftStore = useNftStore()
const { userInfo } = storeToRefs(usersStore)
const { addNft, getTokenURI, placeNftOnSale } = nftStore
const router = useRouter()
const currentRoute = router.currentRoute

onMounted(async () => {
  if (!userInfo.value.accounts) {
    ElMessage.error('请先登录')
    router.push('/login')
  }
  if (currentRoute.value.query?.id) {
    isSwitch.value = true
    uriForm.tokenURI = (await getTokenURI(currentRoute.value.query.id as string)) as string
    uriForm.tokenURI = uriForm.tokenURI.slice(8)
  }
})

const client = new NFTStorage({ token: import.meta.env.VITE_NFT_STORAGE_TOKEN })
const formRef = ref<FormInstance>()
const uriFormRef = ref<FormInstance>()
const upload = ref<UploadInstance>()
const isSwitch = ref(false)
const isLoading = ref(false)
const rules = reactive({
  name: [
    { required: true, message: '请输入NFT名称', trigger: 'blur' },
    { min: 3, max: 6, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
  health: [{ required: true, message: 'Please enter the health', trigger: 'blur' }],
  attack: [{ required: true, message: 'Please enter the attack', trigger: 'blur' }],
  defense: [{ required: true, message: 'Please enter the defense', trigger: 'blur' }]
})
const ruleForm = reactive({
  name: '',
  image: [] as UploadUserFile[],
  desc: '',
  health: '',
  attack: '',
  defense: ''
})
const uriRules = reactive({
  tokenURI: [{ required: true, message: '请输入tokenURI', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
})
const uriForm = reactive({
  tokenURI: '',
  price: ''
})
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg/png') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

async function onSubmit(formEl: FormInstance | undefined) {
  if (!userInfo.value.accounts) return
  if (!formEl) return

  const isSubmit = await formEl.validate((valid) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
  if (!isSubmit) return
  isLoading.value = true
  const metadata = await client.store({
    name: ruleForm.name,
    description: ruleForm.desc,
    image: ruleForm.image[0].raw as File,
    combat: {
      health: ruleForm.health,
      attack: ruleForm.attack,
      defense: ruleForm.defense
    }
  })
  if (!metadata) return
  uriForm.tokenURI = ipfsToHttps(metadata.url).slice(8)
  isLoading.value = false
  isSwitch.value = true
}
async function onSubmitUri(formEl: FormInstance | undefined) {
  if (!userInfo.value.accounts) return
  if (!formEl) return
  const isSubmit = await formEl.validate((valid) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
  if (!isSubmit) return
  isLoading.value = true
  try {
    const ntfData = await (await fetch('https://' + uriForm.tokenURI)).json()
    if (!ntfData?.name) {
      ElMessage.error('tokenURI不正确')
      return
    }
  } catch (error) {
    ElMessage.error('tokenURI不正确')
    console.log(error)
    return
  }
  if (currentRoute.value.query?.id) {
    await placeNftOnSale(currentRoute.value.query.id as string, uriForm.price)
    isLoading.value = false
    ElMessage.success('挂卖成功')
  } else {
    const res = await addNft(`https://${uriForm.tokenURI}`, uriForm.price)
    if (res) {
      setTimeout(() => {
        isLoading.value = false
        ElMessage.success('创建成功')
      }, 1000)
    }
  }
}
</script>
<template>
  <main
    class="grid sm:grid-cols-1 lg:grid-cols-2 max-w-7xl bg-white mx-auto px-4 py-8 sm:px-6 lg:px-8"
    v-loading="isLoading"
  >
    <div>
      <div>
        <span>是否已经创建元数据？</span>
        <el-switch v-model="isSwitch" />
      </div>
    </div>
    <el-form
      ref="formRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      label-position="top"
      v-if="!isSwitch"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="我的NFT" />
      </el-form-item>
      <el-form-item label="NFT介绍">
        <el-input
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          v-model="ruleForm.desc"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="图片上传" prop="image">
        <el-upload
          class="w-full"
          drag
          multiple
          v-model:file-list="ruleForm.image"
          :auto-upload="false"
          ref="upload"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">拖拽图片到这里或者 <em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <div class="w-full flex justify-between">
        <el-form-item label="生命值">
          <el-input type="number" v-model="ruleForm.health" placeholder="生命值" />
        </el-form-item>
        <el-form-item label="攻击力">
          <el-input type="number" v-model="ruleForm.attack" placeholder="攻击力" />
        </el-form-item>
        <el-form-item label="防御力">
          <el-input type="number" v-model="ruleForm.defense" placeholder="防御力" />
        </el-form-item>
      </div>

      <el-form-item>
        <div class="w-full flex justify-center">
          <el-button type="primary" @click="onSubmit(formRef)">创建URI</el-button>
          <el-button>清空</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form
      ref="uriFormRef"
      :model="uriForm"
      :rules="uriRules"
      label-width="auto"
      label-position="top"
      v-else
    >
      <el-form-item label="tokenURI" prop="tokenURI">
        <el-input v-model="uriForm.tokenURI" placeholder="nft的tokenURI">
          <template #prepend>https://</template>
        </el-input>
      </el-form-item>
      <el-form-item label="定价" prop="price">
        <el-input type="number" v-model="uriForm.price" placeholder="nft的定价">
          <template #append>ETH</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="w-full flex justify-center">
          <el-button type="primary" @click="onSubmitUri(uriFormRef)"
            >{{ currentRoute.query.id ? '挂卖' : '创建' }}CEOL</el-button
          >
          <el-button>清空</el-button>
        </div>
      </el-form-item>
    </el-form>
  </main>
</template>

<style>
.el-radio-group {
  margin-right: 12px;
}
</style>
