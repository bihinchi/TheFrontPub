import { leaderboard } from "./stores";

const TOP_NUM = 3

export const Leaderboard = {
    scores: [], 
    allScores: [],
    counts: [], 
    addresses: {},


    updater: function(container, score, link, address, checkAddress=false, startIndex = 0) {

        if (checkAddress) {
            const found = container.find(el => el.address === address)
            if (found) {
                found.score = score;
                return;
            }
        }

        for (let i = startIndex; i < TOP_NUM; i++) {
            if (container[i] === undefined) {
                container[i] = {score, link, address}
                break
            }
            else if (container[i].score < score) {
                const prev = container[i];
                container[i] = {score, link, address}
                this.updater(container, prev.score, prev.link, address, checkAddress, i+1)
                break
            }
        }
    },


    processRecord : function(address, score, link, type) {

        if (address in this.addresses) 
            this.addresses[address].push(score)
        else
            this.addresses[address] = [ score ];
        

        this.updater(this.scores, score, link);


        for (const [address, scores] of Object.entries(this.addresses)) {
            
            const count = scores.length;
            const total = scores.reduce((prev, cur) => prev + cur);

            this.updater(this.allScores, total, link, address, true);
            this.updater(this.counts, count, link, address, true);
        }

        leaderboard.update(lb => lb = {
            scores : this.scores,
            allScores : this.allScores,
            counts : this.counts,
        })


    }



} 