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

test('Tragedyのタイプで観客数が31人以上と30人以下の場合の検証', () => {
    const invoice = JSON.parse(fs.readFileSync('test/tragedy_invoice.json', 'utf8'));
    const plays = JSON.parse(fs.readFileSync('test/tragedy_plays.json', 'utf8'));
    const expected = 'Statement for Tragedy Test\n' +
        ' Hamlet: $400.00 (29 seats)\n' +
        ' Hamlet2: $400.00 (30 seats)\n' +
        ' Othello: $410.00 (31 seats)\n' +
        'Amount owed is $1,210.00\n' +
        'You earned 1 credits\n';
    expect(statement(invoice, plays)).toBe(expected);
});

test('Comedyのタイプで観客数が31人以上と30人以下の場合の検証', () => {
    const invoice = JSON.parse(fs.readFileSync('test/comedy_invoice.json', 'utf8'));
    const plays = JSON.parse(fs.readFileSync('test/comedy_plays.json', 'utf8'));
    const expected = 'Statement for Comedy Test\n' +
        ' As You Like It: $357.00 (19 seats)\n' +
        ' As You Like It 2: $360.00 (20 seats)\n' +
        ' As You Like It 3: $468.00 (21 seats)\n' +
        'Amount owed is $1,185.00\n' +
        'You earned 11 credits\n';
    expect(statement(invoice, plays)).toBe(expected);
});
