import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'flowy',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      collectionDir: 'dist/components',
      isPrimaryPackageOutputTarget: true,
    },
    // {
    //   type: 'dist-custom-elements',
    //   customElementsExportBehavior: 'auto-define-custom-elements',
    //   externalRuntime: false,
    // generateTypeDeclarations: true,
    // },
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
