/*
Pseudocode:
Expected input (use readline-sync): Total loan amount,
  Annual Percentage Rate, Loan Duration.
  Test the user input: 0, negative, non-number strings, NaN, undefined, etc.
  Ensure valid input with loops
loanMonthsLong = convert user input from years to months
Expected output: monthly payment with two decimal places.

Working from formula...
  monthlyPayment = loanAmount * (
    monthlyIntRate / (1 - Math.pow((1 + monthlyIntRate), (-loanMonthsLong))));

Output monthly payment, extra stuff might be fun, total interest, total cost
*/

let readline = require('readline-sync');

const MONTHS_IN_YEAR = 12;
const LOAN_MAX = 5000000;

function invalidEntry(numString) {
  let num = parseFloat(numString);
  return (Number.isNaN(num) || num <= 0);
}


function getLoanAmount() {
  let loanAmount = Math.round(parseFloat(readline.question('Please enter desired loan amount to the nearest dollar: $')));

  while (loanAmount > LOAN_MAX) {
    loanAmount = Math.round(parseFloat(readline.question(`You're barkin' up the wrong bank, try a lower amount: $`)));
  }
  while (invalidEntry(loanAmount) || loanAmount > LOAN_MAX) {
    loanAmount = Math.round(parseFloat(readline.question(`Please enter a valid loan amount: $`)));
  }

  return loanAmount;
}

function getAPR() {
  let APR = parseFloat(readline.question('Please enter the Annual Percentage Rate (APR) as a percent eg. 3.75%: '));

  while (invalidEntry(APR)) {
    APR = parseFloat(readline.question(`Please enter a valid interest rate: `));
  }
  APR /= 100;

  return APR;
}

function getLoanLengthYears() {
  let loanLength = parseFloat(readline.question('Please enter loan length in years: '));

  while (invalidEntry(loanLength) || !Number.isInteger(loanLength)) {
    loanLength = parseFloat(readline.question('Please enter valid whole number for the length of loan in years: '));
  }
  return loanLength;
}

console.log(`\nWelcome to Mortgage Loan Calculator!\n`);

let loanAmount = getLoanAmount();
let monthlyRate = getAPR() / MONTHS_IN_YEAR;
let loanLengthMonths = getLoanLengthYears() * MONTHS_IN_YEAR;


let monthlyPayment = (loanAmount * (monthlyRate / (1 - Math.pow(
  (1 + monthlyRate), (-loanLengthMonths))))).toFixed(2);

let totalInterest = ((monthlyPayment * loanLengthMonths) -
                    loanAmount).toFixed(2);


console.log(`\nLoan Calculation Results:\n
  Payment Every Month: $${monthlyPayment}\n
  Total of ${loanLengthMonths} Payments: $${(monthlyPayment * loanLengthMonths).toFixed(2)}\n
  Total Interest: $${totalInterest}`);