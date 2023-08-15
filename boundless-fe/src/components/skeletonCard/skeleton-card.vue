<template>
  <el-card shadow="always" :body-style="{ padding: '0px' }">
    <el-skeleton class="w-full h-full" animated>
      <template #template>
        <el-skeleton-item variant="image" class="w-full h-0 pb-[100%]" />
        <div class="p-[14px] w-full h-0 pb-[40%]">
          <el-skeleton-item variant="p" class="w-1/2" />
          <div class="flex items-center justify-between">
            <el-skeleton-item variant="text" class="mr-4" />
            <el-skeleton-item variant="text" class="w-[30%]" />
          </div>
          <el-skeleton-item variant="p" class="w-1/2 mt-2" />
        </div>
      </template>
    </el-skeleton>
  </el-card>
</template>
