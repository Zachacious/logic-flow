<script setup lang="ts">
import { LogicFlowNode } from 'logic-flow-vue'
</script>

<template>
  <LogicFlowNode v-bind="$attrs">
    <div class="text-md font-bold p-2">Url</div>

    <logic-flow-connector type="output"
      ><div class="">
        <input
          type="text"
          placeholder="Enter URL"
          class="px-2 border border-gray-800 rounded-md text-gray-800 text-md"
        /></div
    ></logic-flow-connector>
  </LogicFlowNode>
</template>
