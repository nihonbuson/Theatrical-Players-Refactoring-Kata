'use strict';

function statement (invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;

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

    function appleSauce() {
        let totalAmount = 0;
        for (let perf of invoice.performances) {
            totalAmount += amountFor(perf);
        }
        return totalAmount;
    }

    let totalAmount = appleSauce();

    for (let perf of invoice.performances) {
        // print line for this order
        result += ` ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} seats)\n`;
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }

    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;
}

module.exports = statement;
