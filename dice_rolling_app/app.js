const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

function dieRoll(res, rolls, sides) {
   while (rolls > 0) {
    let currRoll = Math.floor((Math.random() * sides) + 1);
    res.write(`${currRoll}\n`);
    rolls -= 1;
  }
};

function getRollParams(path) {
  let myURL = new URL(path, `http://localhost:3000`);
  let params = myURL.searchParams;
  return [params.get('rolls'), params.get('sides')];
};

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;
  
  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    dieRoll(res, ...getRollParams(path));
    res.write(`${method} ${path}\n`);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});