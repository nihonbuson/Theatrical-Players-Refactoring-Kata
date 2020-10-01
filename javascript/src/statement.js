'use strict';
const createStatementData = require('./createStatementData');

function statement (invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
    for (let perf of data.performances) {
        // print line for this order
        result += ` ${perf.play.name}: ${format(perf.amount / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${format(data.totalAmount / 100)}\n`;
    result += `You earned ${data.totalCredit} credits\n`;
    return result;
}

module.exports = statement;
