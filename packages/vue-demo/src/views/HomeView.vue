<script setup lang="ts">
import ImageNode from '@/components/ImageNode.vue'
// import LFViewport from '@/components/LFViewport.vue'
import { LogicFlowViewport } from 'logic-flow-vue'
import { ref, shallowRef, triggerRef } from 'vue'
// import { HTMLLogicFlowViewportElement } from 'logic-flow-vue'

type node = {
  position: { x: number; y: number }
  type: typeof ImageNode
}

const viewport = ref<HTMLLogicFlowViewportElement | null>(null)

const snapToGrid = ref(false)
const gridType = ref<'line' | 'dot' | 'none'>('line')

const nodes = shallowRef<node[]>([])

const nodeDragStart = (e: DragEvent, type: string) => {
  e.dataTransfer?.setData('text', type)
}

const viewportDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const viewportDrop = async (e: DragEvent) => {
  e.preventDefault()

  const pointerCoords = {
    x: e.clientX,
    y: e.clientY
  }

  const type = e.dataTransfer?.getData('text')
  if (type === 'ImageNode') {
    const worldCoords = await viewport.value?.screenToWorldCoords(pointerCoords)
    nodes.value.push({
      position: {
        x: worldCoords.x,
        y: worldCoords.y
      },
      type: ImageNode
    } as node)
  }

  requestAnimationFrame(() => {
    triggerRef(nodes)
  })
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
          ref="viewport"
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
            <component :is="node.type" :start-x="node.position.x" :start-y="node.position.y" />
          </template>
        </logic-flow-viewport>

        <div
          class="absolute top-20 left-10 min-w-[100px] bg-[#333] text-white p-4 rounded-md shadow-lg z-40 flex flex-col gap-4"
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

    <div id="debug" class="debug"></div>
    <div id="debug2" class="debug"></div>
  </main>
</template>

<style scoped>
.debug {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  border: 2px solid #ffffff;
  border-radius: 5px;
  color: white;
  pointer-events: none;
}
</style>
