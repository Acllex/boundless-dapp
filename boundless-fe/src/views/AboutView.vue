<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
const isSwitch = ref(false)
const sizeForm = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})

function onSubmit() {
  console.log('submit!')
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
    <el-form class="w-7/12" ref="form" :model="sizeForm" label-width="auto" label-position="top">
      <el-form-item label="名称">
        <el-input v-model="sizeForm.name" placeholder="我的NFT" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-input
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>
      <el-form-item label="Activity time">
        <el-upload class="w-full" drag action="" multiple>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <!-- <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template> -->
        </el-upload>
      </el-form-item>
      <div class="w-full flex justify-between">
        <el-form-item label="Activity type">
          <el-input v-model="sizeForm.name" placeholder="我的NFT" />
        </el-form-item>
        <el-form-item label="Activity type">
          <el-input v-model="sizeForm.name" placeholder="我的NFT" />
        </el-form-item>
        <el-form-item label="Resources">
          <el-input v-model="sizeForm.name" placeholder="我的NFT" />
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </main>
</template>

<style>
.el-radio-group {
  margin-right: 12px;
}
</style>
