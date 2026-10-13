import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'HeyBox Community Refined',
    description: 'Reversible reading-layout refinements for HeyBox BBS.',
    permissions: ['storage'],
  },
});
