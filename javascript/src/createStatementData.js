'use strict';

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalCredit = totalVolumeCredits(statementData);
    return statementData;
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
                return thisAmount;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                return thisAmount;
            default:
                throw new Error(`unknown type: ${(perf.play.type)}`);
        }
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

module.exports = createStatementData;