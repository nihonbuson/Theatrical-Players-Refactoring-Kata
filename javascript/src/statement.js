'use strict';

function statement (invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) {
        const resultEnrichPerformance = Object.assign({}, aPerformance);
        resultEnrichPerformance.play = playFor(resultEnrichPerformance);
        return resultEnrichPerformance;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
    for (let perf of data.performances) {
        // print line for this order
        result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${format(totalAmount() / 100)}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;

    function amountFor(perf) {
        let thisAmount = 0;
        switch (playFor(perf).type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${playFor(perf).type}`);
        }
        return thisAmount;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function volumeCreditsFor(perf) {
        let resultVolumeCredit = 0;
        // add volume credits
        resultVolumeCredit += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(perf).type) resultVolumeCredit += Math.floor(perf.audience / 5);
        return resultVolumeCredit;
    }

    function totalAmount() {
        let resultTotalAmount = 0;
        for (let perf of data.performances) {
            resultTotalAmount += amountFor(perf);
        }
        return resultTotalAmount;
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }
}

module.exports = statement;
