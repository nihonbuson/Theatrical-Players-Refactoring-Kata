'use strict';

function statement (invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalCredit = totalVolumeCredits(statementData);
    return renderPlainText(statementData);

    function enrichPerformance(aPerformance) {
        const resultEnrichPerformance = Object.assign({}, aPerformance);
        resultEnrichPerformance.play = playFor(resultEnrichPerformance);
        resultEnrichPerformance.amount = amountFor(resultEnrichPerformance);
        resultEnrichPerformance.volumeCredit = volumeCreditsFor(resultEnrichPerformance);
        return resultEnrichPerformance;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function amountFor(perf) {
        let thisAmount = 0;
        switch (perf.play.type) {
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

    function volumeCreditsFor(perf) {
        let resultVolumeCredit = 0;
        // add volume credits
        resultVolumeCredit += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === perf.play.type) resultVolumeCredit += Math.floor(perf.audience / 5);
        return resultVolumeCredit;
    }

    function totalAmount(data) {
        let resultTotalAmount = 0;
        for (let perf of data.performances) {
            resultTotalAmount += perf.amount;
        }
        return resultTotalAmount;
    }

    function totalVolumeCredits(data) {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += perf.volumeCredit;
        }
        return volumeCredits;
    }
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
