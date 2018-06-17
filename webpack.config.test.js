import path from 'path';
import debug from './webpack.config.debug';
// coverage
// debug.node = {
//   fs: 'empty'
// };
debug.target = 'node';
debug.module.rules.unshift({
  test: /\.(js|ts)/,
  include: path.resolve( 'src' ), // instrument only testing sources with Istanbul, after ts-loader runs
  loader: 'istanbul-instrumenter-loader'
});
export default debug;
