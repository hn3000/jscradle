
declare function require(name: string) : any;

require('./styles.css');

import init, { IPreviewRunner, MimeType} from './init';

init();


/*
if (module.hot) {
  module.hot.accept('./init.js', function() {
    console.log('updated module', arguments);
    const body = document.getElementsByTagName('body')[0];
    for (const x of body.children) {
      body.removeChild(x)
    }
    init();
  });
}
*/
