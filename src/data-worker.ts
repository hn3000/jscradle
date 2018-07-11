
/*
(self as any).addEventListener('fetch', function(ev: FetchEventInit) {
  console.log(`--> request ${ev.request.url}`);
  return fetch(ev.request).then( response => {
    console.log(`<== response ${response.url}`);
    return response;
  });
});
*/

import { prefix } from './data-worker-api';

(self as any).addEventListener('fetch', function(ev: FetchEventInit) {
  let { request } = ev;
  console.log("--> request "+ev.request.url);
  var url = new URL(request.url);
  var path = url.pathname;
  var data = path.substring(prefix.length);
  var parts = /^([^;,]+)(;base64)?,(.*)$/.exec(data);
  if (parts) {
    var isBase64 = !!parts[2]
    var mimeType = parts[1]

    var result = isBase64 ? atob(parts[3]) : decodeURI(parts[3]);

    return Promise.resolve(new Response(result, { headers: [['content-type', mimeType]] }));
  }
  return Promise.resolve(new Response('Not found: '+request.url, { status: 404 }));
});
