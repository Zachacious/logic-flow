<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
// import * as lf from 'logic-flow'
// console.log(lf)
// import  from 'logic-flow'
import { LogicFlowViewport } from 'logic-flow-vue'
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="w-full h-full">
      <LogicFlowViewport grid-size="20" grid-bg-color="#888" class="vp"></LogicFlowViewport>
    </div>
  </main>
</template>

<style>
/* html {
  width: 100vw;
  height: 100vh;
}
body {
  background-color: #333;
  width: 100%;
  height: 100vh;
}

main {
  width: 100%;
  height: 100vh;
}

wrapper {
  width: 500px;
  height: 500px;
  background-color: #000;
} */

/* .vp {
  width: 500px;
  height: 500px;
} */
</style>
