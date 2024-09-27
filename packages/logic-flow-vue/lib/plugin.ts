import { Plugin } from "vue";
import { defineCustomElements } from "logic-flow/loader";

export const ComponentLibrary: Plugin = {
  async install() {
    // applyPolyfills().then(() => {
    defineCustomElements();
    // });
  },
};
