<script setup lang="ts">
import { LogicFlowViewport } from 'logic-flow-vue'
import { ref } from 'vue'

const snapToGrid = ref(false)
const gridSize = ref(20)
const gridType = ref('grid')
const gridTypeOptions = ['grid', 'dot', 'none']
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="w-full h-full flex flex-col">
      <div class="w-full h-[50] bg-[#333] shadow-lg z-40 p-4 flex justify-between">
        <div class="">Logic Flow - Vue Demo</div>
        <div class="flex items-center space-x-4">
          <div
            class="px-4 bg-[#555] rounded-md hover:bg-gray-600 cursor-pointer"
            :class="snapToGrid === true ? 'bg-gray-900' : ''"
            @click.stop.prevent="snapToGrid = !snapToGrid"
          >
            Snap To Grid
          </div>
        </div>
      </div>
      <div class="w-full grow">
        <LogicFlowViewport grid-size="20" grid-bg-color="#888" class="vp"></LogicFlowViewport>
      </div>
    </div>
  </main>
</template>
