<script setup lang="ts">
import { LogicFlowViewport } from 'logic-flow-vue'
</script>

<template>
  <LogicFlowViewport v-bind="$attrs">
    <template #content>
      <div class="viewport-content">
        <slot></slot>
      </div>
    </template>
  </LogicFlowViewport>
</template>
