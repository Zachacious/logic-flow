<script setup lang="ts">
import { LogicFlowNode } from 'logic-flow-vue'
</script>

<template>
  <LogicFlowNode v-bind="$attrs">
    <div class="w-[150px] p-2">
      <img src="https://via.placeholder.com/150" alt="Placeholder" />
    </div>

    <logic-flow-connector>input</logic-flow-connector>
    <logic-flow-connector type="output">output</logic-flow-connector>
  </LogicFlowNode>
</template>
