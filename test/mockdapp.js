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

            this.minShowTime = this.minShowTime || Math.min(...Object.values(pubs).map(pub => pub.time));

            if (keys.length == 1) {

                const pub = pubs[keys[0]];
                this.topPub = pub

                timeDiff = now - this.minShowTime;

                this.minShowTime += timeDiff;
                pub.lastShownTime += timeDiff;
                pub.publishedFor += timeDiff;

                pub.score = pub.initialScore - scoreReduction(pub.publishedFor);
                if (pub.score <= 0) {
                    delete pubs[keys[0]];
                    this.topPub = {}
                }
                break

            } else {
                // more than 1 event

                const sortedRecent = sortedKeys(pubs, this.minShowTime );

                let topScorePub = pubs[sortedRecent[0]]
                let calcTargetPub = pubs[keys[0]] === topScorePub ? pubs[keys[1]] : pubs[keys[0]];  


                // If topPub changed, reset its last published timer
                if (topScorePub !== this.topPub) this.topPub.lastShownTime = 0;

                if (this.topPub.lastShownTime < MIN5) {

                    if (topScorePub.lastShownTime + MIN5 <= now) timeDiff = MIN5 - this.topPub.lastShownTime;
                    else timeDiff = now - topScorePub.lastShownTime;

                } else {
                    // the top pub was shown for at least 5 min

                    let minTimeDiff = Infinity;

                    let tempTimeDiff;

                    if (this.minShowTime == 1630000660) {
                        console.log("debugger here");
                    }

                    for (const [key, pub] of Object.entries(pubs)) {

                        if (pub === topScorePub) continue;

                        tempTimeDiff =  sortedRecent.includes(key) ? reverseScore(topScorePub.score - pub.score)
                                                                       : pub.time - this.minShowTime
                     
                        if (tempTimeDiff > 0 && minTimeDiff > tempTimeDiff) {
                            minTimeDiff = tempTimeDiff;
                            calcTargetPub = pub;
                        }
                    }
                    
                    // progress 5 sec in case of error
                    timeDiff = 0 < minTimeDiff && minTimeDiff < Infinity ? minTimeDiff : 5; 

                } // after top, calcTarget and timeDiff are calculated 

        
                this.minShowTime += timeDiff
                topScorePub.publishedFor += timeDiff;
                topScorePub.lastShownTime += timeDiff;

                let newScore = topScorePub.initialScore - scoreReduction(topScorePub.publishedFor);

                // in case of small score diff in results, make sure,
                // that the old pub value is smaller to avoid
                // small score diff calculation the next round
                if (Math.abs(newScore - calcTargetPub.score) < 0.000001) newScore = calcTargetPub.score - 0.000001;

                if (newScore <= 0) {

                    topScorePub = calcTargetPub;
                    delete pubs[sortedRecent[0]];

                } else {
                    topScorePub.score = newScore;
                }

                this.topPub = topScorePub;
            }

        }

        //setTimeout(this.initScores.bind(this), this.minShowTime - now);

    }

  
    publishNew(link, type, extra, stake) {
      return new Promise((resolve, reject) => {
        if (2+2 == 3) return reject({ status: "error", reason: "yo mama is too big"})
        return resolve({ status: "sucess", receiptName: "super receipt" });
      })
    }

    addEvent(event, now=null) {
        this.publications[event.link] = {
            link : event.link,
            type : event.type,
            extra : event.extra,
            initialScore : event.score,
            time : event.time,
            score : event.score,
            lastShownTime : 0,
            publishedFor: 0,
        }

        this.now = now || (event.time + 1)

        this.initScores();
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