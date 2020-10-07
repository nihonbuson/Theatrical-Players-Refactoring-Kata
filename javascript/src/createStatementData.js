'use strict';

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }
    get amount() {
        let thisAmount = 0;
        switch (this.play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (this.performance.audience > 30) {
                    thisAmount += 1000 * (this.performance.audience - 30);
                }
                return thisAmount;
            case "comedy":
                thisAmount = 30000;
                if (this.performance.audience > 20) {
                    thisAmount += 10000 + 500 * (this.performance.audience - 20);
                }
                thisAmount += 300 * this.performance.audience;
                return thisAmount;
            default:
                throw new Error(`unknown type: ${(this.play.type)}`);
        }
    }

    get volumeCredits() {
        let resultVolumeCredit = 0;
        // add volume credits
        resultVolumeCredit += Math.max(this.performance.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === this.play.type) resultVolumeCredit += Math.floor(this.performance.audience / 5);
        return resultVolumeCredit;
    }



}

class TragedyCalculator extends PerformanceCalculator{


}

class ComedyCalculator extends PerformanceCalculator{

}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type){
        case "tragedy" : return new TragedyCalculator(aPerformance, aPlay);
        case "comedy" : return new ComedyCalculator(aPerformance, aPlay);
        default : throw new Error(`未知の演劇の種類: ${(this.play.type)}`);
   }
}


function createPerformanceCalculator(aPerformance, aPlay) {
    return new PerformanceCalculator(aPerformance, aPlay);
}

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalCredit = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const resultEnrichPerformance = Object.assign({}, aPerformance);
        resultEnrichPerformance.play = calculator.play;
        resultEnrichPerformance.amount = calculator.amount;
        resultEnrichPerformance.volumeCredit = calculator.volumeCredits;
        return resultEnrichPerformance;
    }

    function playFor(perf) {
        return plays[perf.playID];
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