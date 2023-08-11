<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
const { userInfo, networkInfo } = storeToRefs(usersStore)
const { getUserInfo } = usersStore
const activeIndex = ref('/')
const router = useRouter()
const currentRoute = router.currentRoute
const onLogin = () => {
  getUserInfo()
}
watch(
  () => currentRoute.value.path,
  (n) => {
    activeIndex.value = n
  }
)
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="min-w-full bg-white sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="false">
          <el-menu-item index="/"> Home </el-menu-item>
          <el-menu-item index="/about"> 创造 </el-menu-item>
          <div class="flex-1"></div>
          <div class="flex items-center">
            <el-tag class="font-bold"
              >• {{ networkInfo.isLoading === true ? '加载中...' : networkInfo.name }}</el-tag
            >
          </div>
          <el-menu-item>
            <div class="h-full box-border">
              <el-popover v-if="userInfo?.accounts" placement="bottom-end" trigger="click">
                <template #reference>
                  <el-avatar class="mb-1.5" src="" />
                </template>
                <div>
                  <div class="text-sm text-gray-400">
                    {{ userInfo?.accounts.slice(0, 5) }}****{{ userInfo?.accounts.slice(-4) }}
                  </div>
                </div>
              </el-popover>
              <el-button v-else type="primary" size="small" @click="onLogin" round>
                登录
              </el-button>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>

    <div class="py-8 min-w-full overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>
