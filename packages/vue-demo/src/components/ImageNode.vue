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
      // console.log('Invalid connection')
      return false
    }
  }

  inputConnector.value.onDisconnection = async (src: HTMLLogicFlowConnectorElement) => {
    url.value = ''
  }

  inputConnector.value.onDataUpdate = async (
    connector: HTMLLogicFlowConnectorElement,
    node: HTMLLogicFlowNodeElement,
    data: any
  ) => {
    url.value = data.data.url || ''
    // console.log('Data updated', data)
  }
})
</script>

<template>
  <LogicFlowNode v-bind="$attrs" type="image-node">
    <div class="w-[200px] h-[200px] p-2 overflow-hidden">
      <img
        :src="url || 'https://via.placeholder.com/200'"
        alt="Placeholder"
        class="pointer-events-none bg-no-repeat bg-cover bg-center rounded-md"
      />
    </div>

    <logic-flow-connector ref="inputConnector" class="text-md">Url Input</logic-flow-connector>
    <logic-flow-connector type="output">output</logic-flow-connector>
  </LogicFlowNode>
</template>
