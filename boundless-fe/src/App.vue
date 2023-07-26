<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {ref} from 'vue'

const activeIndex = ref('/')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class=" max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8">
    <el-menu
        :default-active="activeIndex"
        :router="true"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
    >

      <el-menu-item index="/">
        Home
      </el-menu-item>
      <el-menu-item index="/about">
        About
      </el-menu-item>
      <div class=" flex-1"></div>
      <el-menu-item index="2">
        <div class="h-full box-border">
          <el-avatar class=" mb-1.5" src=""/>
        </div>
      </el-menu-item>
    </el-menu>
  </div>

  <div class=" py-16 bg-gray-50 overflow-hidden min-h-screen">
    <div class="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
      <RouterView/>
    </div>
  </div>
</template>
