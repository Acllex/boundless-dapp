<template>
  <el-card shadow="always" :body-style="{ padding: '0px' }">
    <el-skeleton class="w-full h-full" animated>
      <template #template>
        <el-skeleton-item variant="image" class="w-full h-0 pb-[100%]" />
      </template>
    </el-skeleton>
  </el-card>
</template>
