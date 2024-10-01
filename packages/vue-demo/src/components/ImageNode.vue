<script setup lang="ts">
import { LogicFlowNode } from 'logic-flow-vue'
import { onMounted, ref } from 'vue'

const inputConnector = ref<HTMLLogicFlowConnectorElement>(null)

onMounted(async () => {
  const node = await inputConnector?.value?.getNode()
  if (!node || !inputConnector.value) {
    return
  }
  inputConnector.value.onConnection = async (src) => {
    const sourceNode = await src?.getNode()
    if (sourceNode.type !== 'url-node') {
      console.log('Invalid connection')
      return false
    }
  }
})
</script>

<template>
  <LogicFlowNode v-bind="$attrs" type="image-node">
    <div class="w-[150px] p-2">
      <img src="https://via.placeholder.com/150" alt="Placeholder" class="pointer-events-none" />
    </div>

    <logic-flow-connector ref="inputConnector" class="text-md">Url Input</logic-flow-connector>
    <logic-flow-connector type="output">output</logic-flow-connector>
  </LogicFlowNode>
</template>
