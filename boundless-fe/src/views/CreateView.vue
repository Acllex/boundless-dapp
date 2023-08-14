<script lang="ts" setup>
import { NFTStorage } from 'nft.storage'
import { UploadFilled } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
import type {
  FormInstance,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile
} from 'element-plus'
import { ipfsToHttps } from '@/utils'

const NFT_STORAGE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRGNzE1YTJkMDRGNGJGNWJEMUVEODRiNmUzY2IwOWY3N0ZCN0RGM0UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5MTg1ODM4MTgzNSwibmFtZSI6Im5mdCJ9.1cHnblNzTINKYKSDy4qBDTbOx5SrY7_vbIe2COZ17Z4'
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
const formRef = ref<FormInstance>()
const upload = ref<UploadInstance>()
const isSwitch = ref(false)
const rules = reactive({
  name: [
    { required: true, message: '请输入NFT名称', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
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
  if (!formEl) return
  console.log(formEl)

  const isSubmit = await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      return true
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
  if (!isSubmit) return
  // const img: any = await fileToBlob(sizeForm.image[0].raw as File)
  // const cid = await client.storeBlob(img)
  const metadata = await client.store({
    name: ruleForm.name,
    description: ruleForm.desc,
    image: ruleForm.image[0].raw as File
  })
  console.log(metadata)
  const data = await (await fetch(ipfsToHttps(metadata.url))).json()
  console.log(data)
}
</script>
<template>
  <main class="flex justify-between max-w-7xl bg-white mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div>
      <div>
        <span>是否已经创建元数据？</span>
        <el-switch v-model="isSwitch" />
      </div>
    </div>
    <el-form
      ref="formRef"
      class="w-7/12"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      label-position="top"
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
          <!-- <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template> -->
        </el-upload>
      </el-form-item>
      <div class="w-full flex justify-between">
        <el-form-item label="生命值">
          <el-input v-model="ruleForm.health" placeholder="生命值" />
        </el-form-item>
        <el-form-item label="攻击力">
          <el-input v-model="ruleForm.attack" placeholder="攻击力" />
        </el-form-item>
        <el-form-item label="防御力">
          <el-input v-model="ruleForm.defense" placeholder="防御力" />
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">创建</el-button>
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>
  </main>
</template>

<style>
.el-radio-group {
  margin-right: 12px;
}
</style>