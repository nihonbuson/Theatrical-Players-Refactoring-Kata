const statement = require('../src/statement');
const fs=require('fs');

test('example statement', () => {
    const invoice = JSON.parse(fs.readFileSync('test/invoice.json', 'utf8'));
    const plays = JSON.parse(fs.readFileSync('test/plays.json', 'utf8'));
    const expected = 'Statement for BigCo\n' +
        ' Hamlet: $650.00 (55 seats)\n' +
        ' As You Like It: $580.00 (35 seats)\n' +
        ' Othello: $500.00 (40 seats)\n' +
        'Amount owed is $1,730.00\n' +
        'You earned 47 credits\n';
    expect(statement(invoice, plays)).toBe(expected);
});
