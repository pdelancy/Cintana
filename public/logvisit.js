"user strict";

(() => {

  function genUUID(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,genUUID)};

  let uuidKey = 'horizonsId';
  let uuid = localStorage.getItem(uuidKey);

  if(!uuid) {
    console.log("NEW USER");
    uuid = genUUID();
    localStorage.setItem(uuidKey, uuid);
  } else {
    console.log("RETURNING USER", uuid);
  }

  let path = location.pathname;
  console.log(`User ${uuid} path ${path}`);

  let url = 'http://localhost:3000/api/log/visit/'
     + encodeURIComponent(uuid)
     + '?path='
     + encodeURIComponent(path);

  let img = document.createElement('img');
  img.src = url;
  img.style = 'display: none';
  console.log(document.body);
  document.body.appendChild(img);

})();
