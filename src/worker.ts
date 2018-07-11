
(self as any).addEventListener('fetch', function(ev: FetchEventInit) {
  console.log(`--> request ${ev.request.url}`);
  return fetch(ev.request).then( response => {
    console.log(`<== response ${response.url}`);
    return response;
  });
});
