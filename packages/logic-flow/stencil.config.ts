import { Config } from '@stencil/core';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'logic-flow',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      collectionDir: 'dist/components',
      isPrimaryPackageOutputTarget: true,
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
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
