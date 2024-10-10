<script setup lang="ts">
import { LogicFlowNode } from 'logic-flow-vue'
import { onMounted, ref } from 'vue'

const node = ref<HTMLLogicFlowNodeElement | null>(null)
const connector = ref<HTMLLogicFlowConnectorElement | null>(null)
const url = ref<string>('')

const onUpdate = async () => {
  if (!node.value) {
    return
  }

  // node.value.$el.notifyConnectedConnectors('both', {
  //   type: 'url-node',
  //   data: {
  //     url: url.value
  //   }
  // })
}

// onMounted(async () => {
//   connector.value.onConnection = async (src: HTMLLogicFlowConnectorElement) => {
//     console.log('Connected', src)
//     onUpdate()
//   }
// })
</script>

<template>
  <LogicFlowNode ref="node" v-bind="$attrs" type="url-node">
    <div class="text-md font-bold p-2">Url</div>

    <logic-flow-connector ref="connector" type="output"
      ><div class="">
        <input
          v-model="url"
          type="text"
          placeholder="Enter URL"
          class="px-2 border border-gray-800 rounded-md text-gray-800 text-md"
          @input="onUpdate"
        /></div
    ></logic-flow-connector>
  </LogicFlowNode>
</template>
