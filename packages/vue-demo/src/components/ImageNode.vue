<script setup lang="ts">
import { LogicFlowNode } from 'logic-flow-vue'
import { onMounted, ref } from 'vue'

const inputConnector = ref<HTMLLogicFlowConnectorElement | null>(null)
const url = ref<string>('')

onMounted(async () => {
  const node = await inputConnector?.value?.getNode()
  if (!node || !inputConnector.value) {
    return
  }
  inputConnector.value.onConnection = async (src: HTMLLogicFlowConnectorElement) => {
    const sourceNode = await src?.getNode()

    if (sourceNode.type !== 'url-node') {
      console.log('Invalid connection')
      return false
    }
  }

  inputConnector.value.onDisconnection = async (src: HTMLLogicFlowConnectorElement) => {
    console.log('Disconnected', src)
  }

  // inputConnector.value.onUpdateFromConnectedNode = async (
  //   connector: HTMLLogicFlowConnectorElement,
  //   node: HTMLLogicFlowNodeElement,
  //   data: any
  // ) => {
  //   url.value = data.data.url || ''
  // }
})
</script>

<template>
  <LogicFlowNode v-bind="$attrs" type="image-node">
    <div class="w-[150px] p-2">
      <img
        :src="url || 'https://via.placeholder.com/150'"
        alt="Placeholder"
        class="pointer-events-none"
      />
    </div>

    <logic-flow-connector ref="inputConnector" class="text-md">Url Input</logic-flow-connector>
    <logic-flow-connector type="output">output</logic-flow-connector>
  </LogicFlowNode>
</template>
