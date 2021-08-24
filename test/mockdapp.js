const MIN5 = 300


class MockDapp {

    constructor(events=[], now=Date.now()/1000) {
      this.publications = {};
      this.topPub = {};
      this.minShowTime = 0;
      this.firstTime = true;
      this.events = events;
      this.now = now

      this.init()
  
    }
  
    init() {
        this.getEvents()
        this.initScores()
    }
  
  
    getEvents() {

      const events = this.events;

      for (const event of events) {
        if (!(event.link in this.publications)) this.publications[event.link] = {
            link : event.link,
            type : event.type,
            extra : event.extra,
            initialScore : event.score,
            time : event.time,
            score : event.score,
            lastShownTime : 0,
            publishedFor: 0,
          }
      }
    }
  
    initScores () {
      
        const pubs = this.publications;
        const now = this.now;

        if (Object.keys(pubs).length < 1) return;

        if (!this.topPub) this.topPub = Object.values(pubs).find(elem => elem.lastShownTime === 0);


        let timeDiff = 0;

        while (this.minShowTime < now) {

            const keys = Object.keys(pubs);

            const minTime = this.minShowTime || Math.min(...Object.values(pubs).map(pub => pub.time));
            this.minShowTime = minTime;


            const sorted = sortedKeys(pubs, this.minShowTime );

            if (sorted.length == 0) this.minShowTime += 5;

            else if (keys.length == 1) {

                const pub = pubs[keys[0]];
                this.topPub = pub

                pub.publishedFor += now - (this.minShowTime || pub.time);
                pub.score = pub.initialScore - scoreReduction(pub.publishedFor);
                if (pub.score <= 0) {
                    delete pubs[keys[0]];
                    this.topPub = {}
                }
                break

            } else {

                const sortedRecent = sorted

                // Advance 5 sec forward if there are no pubs yet
                if (!sortedRecent.length) {
                    this.minShowTime += 5;
                    continue
                }

                let topScorePub = pubs[sortedRecent[0]]

                // If topPub changed, reset its last published timer
                if (topScorePub !== this.topPub) this.topPub.lastShownTime = 0;


                // instantiate secondTopPub with first pub that is not topPub
                let secondTopScorePub = pubs[keys[0]] === topScorePub ? pubs[keys[1]] : pubs[keys[0]];  


                let minTimeDiff = Infinity;

                for (const [key, pub] of Object.entries(pubs)) {
                    const scoreSmaller = pub.score < topScorePub.score, notInRecent = !sortedRecent.includes(key);
                    if (pub === topScorePub || ( scoreSmaller ) ) continue;

                    const tempTimeDiff = !scoreSmaller && notInRecent ? (pub.time - this.minShowTime) 
                                                                        : reverseScore(topScorePub.score - pub.score)

                    if (minTimeDiff > tempTimeDiff) {
                        minTimeDiff = tempTimeDiff;
                        secondTopScorePub = pub;
                    }

                }

                timeDiff = minTimeDiff;


                if (timeDiff < MIN5 && topScorePub.lastShownTime < MIN5) timeDiff = MIN5 - topScorePub.lastShownTime;
                if (timeDiff < 0) timeDiff = 20;        
                if (this.minShowTime + timeDiff > now) timeDiff = now - this.minShowTime;

                topScorePub.publishedFor += timeDiff;
                topScorePub.lastShownTime += timeDiff;

                let newScore = topScorePub.initialScore - scoreReduction(topScorePub.publishedFor);
                if (Math.abs(newScore - secondTopScorePub.score) < 0.000001) newScore = secondTopScorePub.score - 0.000001;

                if (newScore <= 0) {
                    topScorePub = secondTopScorePub;
                    delete pubs[sorted[0]];
                } else {
                    topScorePub.score = newScore;
                }

                this.minShowTime += timeDiff
                this.topPub = topScorePub;
            }

        }
    }

  
    publishNew(link, type, extra, stake) {
      return new Promise((resolve, reject) => {
        if (2+2 == 3) return reject({ status: "error", reason: "yo mama is too big"})
        return resolve({ status: "sucess", receiptName: "super receipt" });
      })
  }
    
}

function scoreReduction(s) {
    const time = s / 3600;
    return 0.00014038530109067304 * time * time + 0.03779471529884403935 * time + 0.01206489939977473114
}
  
  
function reverseScore(price) {
    const a = 0.00014038530109067304;
    const b = 0.03779471529884403935;
    const c = 0.01206489939977473114 - price;
    return 3600 * (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
}
  
  
  
function sortedKeys(ads, minShowTime=Infinity) {
    return Object.keys(ads).slice().filter((elem) => ads[elem].time <= minShowTime).sort((a, b) => {
        const first = ads[a];
        const second = ads[b];
        if (first.score < second.score) return 1;
        else if (first.score > second.score) return -1
        else {
            if (first.time < second.time) return 1
            else return (first.time > second.time) ? -1 : 0; 
        }   
    });
}
  

module.exports = MockDapp