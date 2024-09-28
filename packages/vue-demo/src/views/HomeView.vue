<script setup lang="ts">
import { LogicFlowViewport } from 'logic-flow-vue'
import { ref } from 'vue'

const snapToGrid = ref(false)
const gridSize = ref(20)
const gridType = ref<'line' | 'dot' | 'none'>('line')
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="w-full h-full flex flex-col">
      <div class="w-full h-[50] bg-[#333] shadow-lg z-40 p-4 flex justify-between">
        <div class="">Logic Flow - Vue Demo</div>
        <div class="flex items-center space-x-4">
          <div
            class="px-4 bg-[#555] rounded-md cursor-pointer transition-colors duration-300"
            :class="snapToGrid === true ? 'bg-gray-900' : ''"
            @click.stop.prevent="snapToGrid = !snapToGrid"
          >
            Snap To Grid
          </div>

          <div class="flex items-center justify-center">
            <div
              class="px-4 bg-[#555] rounded-l-md cursor-pointer transition-colors duration-300"
              :class="gridType === 'line' ? 'bg-gray-900' : ''"
              @click.stop.prevent="gridType = 'line'"
            >
              line
            </div>
            <div
              class="px-4 bg-[#555] cursor-pointer transition-colors duration-300"
              :class="gridType === 'dot' ? 'bg-gray-900' : ''"
              @click.stop.prevent="gridType = 'dot'"
            >
              Dot
            </div>
            <div
              class="px-4 bg-[#555] rounded-r-md cursor-pointer transition-colors duration-300"
              :class="gridType === 'none' ? 'bg-gray-900' : ''"
              @click.stop.prevent="gridType = 'none'"
            >
              None
            </div>
          </div>
        </div>
      </div>
      <div class="w-full grow">
        <LogicFlowViewport
          grid-size="20"
          grid-bg-color="#888"
          class="vp"
          :show-grid="gridType === 'line' || gridType === 'dot'"
          :grid-type="gridType"
        ></LogicFlowViewport>
      </div>
    </div>
  </main>
</template>
