// types/case-sensitive-paths-webpack-plugin.d.ts
declare module 'case-sensitive-paths-webpack-plugin' {
  import type { WebpackPluginInstance, Compiler } from 'webpack';

  class CaseSensitivePathsPlugin implements WebpackPluginInstance {
    apply(compiler: Compiler): void;
  }

  export default CaseSensitivePathsPlugin;
}
