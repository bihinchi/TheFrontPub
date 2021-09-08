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


        //this.updateScores(score, link)
        //this.allScores = [];
        //this.counts = [];

        console.log("Addresses");
        Object.entries(this.addresses).forEach(([a, v]) => {
            console.log(a, ':', [...v]);
        })
        console.log("\n");


        for (const [address, scores] of Object.entries(this.addresses)) {
            
            const count = scores.length;
            const total = scores.reduce((prev, cur) => prev + cur);


            this.updater(this.allScores, total, link, address, true);
            this.updater(this.counts, count, link, address, true);



            /* if (this.allScores.length < TOP_NUM) this.allScores.push(total);
            else {
                for (let i = 0; i < TOP_NUM; i++) {
                    if (this.allScores[i].score < total) {
                        const temp = this.allScores[i];
                        
                        for (let j = i+1; j < TOP_NUM; j++)
                            let anotherTemp = this.allScores[j];
                            this.allScores[i] 
                    }
                }
            }

            if (this.counts.length < TOP_NUM) this.counts.push(count);
            else {} */

        }

        console.log("scores:",[...this.scores]);
        console.log("total:",[...this.allScores]);
        console.log("counts:",[...this.counts]);
        console.log("\n\n");

        leaderboard.update(lb => lb = {
            scores : this.scores,
            allScores : this.allScores,
            counts : this.counts,
        })



    }



} 