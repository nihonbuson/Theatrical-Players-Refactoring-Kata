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

function htmlStatement(invoice, plays){
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
    let result = `<h1>Statement for ${data.customer}<h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
    for (let perf of data.performances){
        result += `  <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${format(perf.amount / 100)} </td></tr>`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${format(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalCredit}</em> credits</p>\n`;
    return result;
}


module.exports = {
    statement : statement,
    htmlStatement : htmlStatement
};
