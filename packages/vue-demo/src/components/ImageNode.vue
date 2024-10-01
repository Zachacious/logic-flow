<script setup lang="ts">
import { LogicFlowNode } from 'logic-flow-vue'
</script>

<template>
  <LogicFlowNode v-bind="$attrs">
    <div class="w-[150px] p-2">
      <img src="https://via.placeholder.com/150" alt="Placeholder" class="pointer-events-none" />
    </div>

    <logic-flow-connector class="text-md">Url Input</logic-flow-connector>
    <logic-flow-connector type="output">output</logic-flow-connector>
  </LogicFlowNode>
</template>
