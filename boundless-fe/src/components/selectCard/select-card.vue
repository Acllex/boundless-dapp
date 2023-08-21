<script setup lang="ts">
import { ipfsToHttps } from '@/utils'
import { ref, watch, onMounted } from 'vue'
type CombatMap = {
  [k: string]: [string, string]
}
const combatMap: CombatMap = {
  attack: ['danger', '攻击'],
  defense: ['warning', '防御'],
  health: ['success', '生命']
}
const props = defineProps({
  itemInfo: {
    type: Object,
    required: true,
    default() {
      return { tokenId: '', image: '', name: '', price: '', description: '' }
    }
  }
})
const isFront = ref(false)
onMounted(() => {
  setTimeout(() => {
    isFront.value = true
  }, 500)
})
watch(
  () => props.itemInfo,
  (val) => {
    if (val) {
      isFront.value = false
      setTimeout(() => {
        isFront.value = true
      }, 500)
    }
  }
)
</script>

<template>
  <div class="relative w-full h-0 pb-[140%] box-border">
    <div
      class="w-full h-full absolute top-0 left-0 bv-hidden bg-center bg-no-repeat transition-all rounded bg-[url('@/assets/card-back.jpg')]"
      :class="{ 'rotate-y-180': isFront }"
    ></div>
    <div
      class="w-full h-full absolute top-0 left-0 bv-hidden bg-white bg-no-repeat transition-all -rotate-y-180 rounded p-5"
      :class="{ 'rotate-y-0': isFront }"
    >
      <div class="w-full h-0 pb-[100%] relative">
        <img
          class="w-full h-full absolute top-0 left-0 object-scale-down"
          :src="ipfsToHttps(itemInfo.image)"
          :alt="`${itemInfo.name}#${itemInfo.tokenId}`"
        />
      </div>
      <div class="w-full">
        <div class="text-base font-semibold">{{ itemInfo.name }} #{{ itemInfo.tokenId }}</div>
        <p class="line-clamp-2 text-gray-400">{{ itemInfo.description || '暂无介绍' }}</p>
        <div v-if="itemInfo?.combat" class="mt-2">
          <el-text size="large" tag="b">战斗数值</el-text>
          <div class="grid grid-cols-3 mt-1">
            <div
              v-for="(value, key) in itemInfo?.combat"
              :key="key"
              class="text-center grid grid-rows-2"
            >
              <el-text tag="b">{{ value }}</el-text>
              <el-text :type="combatMap[key][0]">{{ combatMap[key][1] }}</el-text>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>
