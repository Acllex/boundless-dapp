<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const activeIndex = ref('/')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="min-w-full bg-white sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <el-menu
          :default-active="activeIndex"
          :router="true"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
        >
          <el-menu-item index="/"> Home </el-menu-item>
          <el-menu-item index="/about"> 创造 </el-menu-item>
          <div class="flex-1"></div>
          <el-menu-item index="2">
            <div class="h-full box-border">
              <el-avatar class="mb-1.5" src="" />
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>

    <div class="py-8 min-w-full overflow-hidden">
      <div class="max-w-7xl bg-white mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </div>
  </div>
</template>
