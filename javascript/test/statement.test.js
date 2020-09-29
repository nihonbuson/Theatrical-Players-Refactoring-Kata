const statement = require('../src/statement');
const fs=require('fs');

test('example statement', () => {
    const invoice = JSON.parse(fs.readFileSync('test/invoice.json', 'utf8'));
    const plays = JSON.parse(fs.readFileSync('test/plays.json', 'utf8'));
    const expected = '';
    expect(statement(invoice, plays)).toBe(expected);
});
