<script setup lang="ts">
import ImageNode from '@/components/ImageNode.vue'
// import LFViewport from '@/components/LFViewport.vue'
// import { LogicFlowViewport } from 'logic-flow-vue'
import { nextTick, ref, shallowRef, triggerRef } from 'vue'

const snapToGrid = ref(false)
const gridSize = ref(20)
const gridType = ref<'line' | 'dot' | 'none'>('line')

const nodes = shallowRef<(typeof ImageNode)[]>([])

const nodeDragStart = (e: DragEvent, type: string) => {
  e.dataTransfer?.setData('text', type)
}

const viewportDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const viewportDrop = (e: DragEvent) => {
  e.preventDefault()
  const type = e.dataTransfer?.getData('text')
  if (type === 'ImageNode') {
    nodes.value.push(ImageNode)
  }

  requestAnimationFrame(() => {
    triggerRef(nodes)
  })
}

let count = 0
const getNextId = () => {
  return count++
}
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
        <logic-flow-viewport
          grid-size="20"
          grid-bg-color="#888"
          class="vp"
          :show-grid="gridType === 'line' || gridType === 'dot'"
          :grid-type="gridType"
          :snap-to-grid="snapToGrid"
          @dragover="viewportDragOver"
          @drop="viewportDrop"
        >
          <template v-for="(node, index) in nodes" :key="index">
            <component :is="node" />
          </template>
        </logic-flow-viewport>

        <div
          class="absolute top-20 left-10 min-w-[100px] min-h-[100px] bg-[#333] text-white p-4 rounded-md shadow-lg z-40 flex flex-col gap-4"
        >
          <div
            class="w-full p-2 bg-[#555] rounded-md cursor-pointer"
            draggable="true"
            @dragstart="(e) => nodeDragStart(e, 'ImageNode')"
          >
            Image Node
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
