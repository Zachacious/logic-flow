import { Config } from '@stencil/core';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'logic-flow',

  extras: {
    experimentalSlotFixes: true,
  },

  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      collectionDir: 'dist/components',
      isPrimaryPackageOutputTarget: true,
      copy: [{ src: './styles', dest: 'styles' }],
    },
    // {
    //   type: 'dist-custom-elements',
    //   customElementsExportBehavior: 'auto-define-custom-elements',
    //   externalRuntime: false,
    //   generateTypeDeclarations: true,
    //   copy: [{ src: './styles', dest: 'styles' }],
    // },
    vueOutputTarget({
      componentCorePackage: 'logic-flow',
      proxiesFile: '../logic-flow-vue/lib/components.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
  globalStyle: 'src/styles/main.css',
};
