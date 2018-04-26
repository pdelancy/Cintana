const http = require("k6/http");
const { sleep } = require("k6");
const v4 = require('./uuid4.js');

const UserAgents = {
  WindowsPhone: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
  iOSSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  Chrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
};

const agentsArray = ['WindowsPhone', 'iOSSafari', 'Chrome'];
const host = "http://ec2-54-183-247-73.us-west-1.compute.amazonaws.com"
const pathname = '/k6script.js';
const pathQuery = 'path=' + encodeURIComponent(pathname);


export default function() {
  const uuid = v4();
  let agent = UserAgents[agentsArray[Math.floor( Math.random() * 3)]];
  let timestamp = new Date(Math.floor( Math.random() * Date.now()));
  http.get(host + '/api/log/visit/' + uuid + '?' + pathQuery + '&timestamp=' + timestamp.toISOString(), { headers: { "User-Agent": agent } });
  sleep(1);
};
