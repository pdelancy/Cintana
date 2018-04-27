import http from "k6/http";
import uuidv4 from "./uuid.js";
import { sleep } from "k6";

export default function() {
  const host = 'http://127.0.0.1:3001';

  const UserAgents = [
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
  ];

  const pathname = [
    '/test/server.test.js',
    '/k6script',
    '/app.js',
    '/othertest.js'
  ];

  const uuid = uuidv4();
  // const start = new Date(Date.now() - 1).toISOString();
  // const now = new Date(Math.floor(Math.random()*Date.now())).toISOString();
  const now = new Date().toISOString();

  const rand = Math.floor(Math.random() * 3);
  const rand2 = Math.floor(Math.random() * 4);

  const useragent = UserAgents[rand];
  const pathQuery = 'path=' + encodeURIComponent(pathname[rand2]);
  const url = host + '/api/log/visit/' + uuid + '?timestamp=' + now + '&' + pathQuery;

  http.get(url, {
    headers: { 'User-Agent': useragent },
  });
  sleep(1);
};
