'use strict';
const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;
const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <style type="text/css">
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 2rem;
      }

      th {
        text-align: right;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>`;

const HTML_END = `
        </tbody>
      </table>
    </article>
  </body>
</html>`;

function calculateMonthlyPayment(amount, duration) {
  const APR = 5;
  const MONTHS_IN_YR = 12;
  const MONTHLY_RATE = (APR / 100) / MONTHS_IN_YR;

  return (amount * (MONTHLY_RATE / (1 - Math.pow(
    (1 + MONTHLY_RATE), (-(duration * MONTHS_IN_YR)))))).toFixed(2);
}

function getLoanFigures(amount, duration) {
  const APR = 5;
  amount = Number(amount);
  duration = Number(duration);
  let monthlyPayment = calculateMonthlyPayment(amount, duration);

  return HTML_START + `\n<tr><th>Amount:</th><td>
      <a href='/?amount=${amount - 100}&duration=${duration}'>- $100</a>
    </td><td>$${amount}</td><td>
      <a href='/?amount=${amount + 100}&duration=${duration}'>+ $100</a></td></tr>
  <tr><th>Duration:</th><td>
      <a href='/?amount=${amount}&duration=${duration - 1}'>- 1 year</a>
    </td><td>${duration} years</td><td>
      <a href='/?amount=${amount}&duration=${duration + 1}'>+ 1 year</a></td></tr>
  <tr><th>APR:</th><td colspan='3'>${APR}%</td></tr>
  <tr><th>Monthly payment:</th><td colspan='3'>$${monthlyPayment}</td>
  </tr>\n` + HTML_END;
}

function getLoanParams(path) {
  let myURL = new URL(path, `http://localhost:${PORT}`);
  let params = myURL.searchParams;
  return [params.get('amount'), params.get('duration')];
}

const SERVER = HTTP.createServer((req, res) => {
  let path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    let content = getLoanFigures(...getLoanParams(path));
    res.write(content);

    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});