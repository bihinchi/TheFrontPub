import * as AbiFile from '../contracts/build/Publication.json'
import { currentPub } from './stores.js';
import { history } from './stores.js';


import Web3 from "./web3";

const MIN5 = 300

export class Dapp {

  constructor() {
    this.web3Provider = null;
    this.account = '0x0';
    this.publications = {};
    this.topPub = {};
    this.minShowTime = 0;
    this.firstTime = true;
    this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      this.initWeb3()
      .then(() => this.initContract())
      .then(() => this.getEvents())
      .then(() => resolve(this.initScores()))
      .catch(e => reject(e));
    })
  }

  async initWeb3() {
    if (typeof web3 == 'undefined') 
      this.web3Provider = web3.currentProvider;
    else 
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');

    web3 = new Web3(this.web3Provider);
    const accounts = await web3.eth.getAccounts();    
    this.account = accounts[0];
  }

  async initContract() {
    this.Publication = new web3.eth.Contract(AbiFile.abi, "0x9e4D6398b37A82BB78bf753793e189044379d8Fe");    
    this.Publication.setProvider(this.web3Provider);    
  }

  async getEvents() {
    const events = await this.Publication.getPastEvents('newPublished', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    for (const event of events) {
      if (!(event.returnValues._link in this.publications)) this.publications[event.returnValues._link] = {
          link : event.returnValues._link,
          type : event.returnValues._type,
          extra: event.returnValues._extra.length > 30 ? JSON.parse(event.returnValues._extra) : {},
          desc : event.returnValues._extra,
          initialScore : parseFloat(web3.utils.fromWei(event.returnValues._score)),
          time : web3.utils.toNumber(event.returnValues._time),
          score : parseFloat(web3.utils.fromWei(event.returnValues._score)),
          lastShownTime : 0,
          publishedFor: 0,
        }
    }

    //history.set([])
  }

  initScores () {

    const pubs = this.publications;
    const now = Date.now() / 1000;
    
    if (Object.keys(pubs).length < 1) return;

    if (!this.topPub) this.topPub = Object.values(pubs).find(elem => elem.lastShownTime === 0);
  
    
    let timeDiff = 0;
  
    while (this.minShowTime < now) {

      const keys = Object.keys(pubs);
      
      this.minShowTime = this.minShowTime || Math.min(...Object.values(pubs).map(pub => pub.time));

      if (keys.length == 1) {

          const pub = pubs[keys[0]];

          if (pub !== this.topPub) {
            if (this.topPub.lastShownTime) 
            //this.history.push({ pub: this.topPub, length: this.topPub.lastShownTime})
            this.topPub.lastShownTime = 0
          };

          this.topPub = pub


          timeDiff = now - this.minShowTime;

          this.minShowTime += timeDiff;
          pub.lastShownTime += timeDiff;
          pub.publishedFor += timeDiff;

          const newScore = pub.initialScore - scoreReduction(pub.publishedFor);
          
          history.update(h => h = [...h, { 
              pub: pub, 
              scoreStart: pub.score, 
              scoreEnd: newScore, 
              length: timeDiff,
              startTime : this.minShowTime * 1000,
              endTime : (this.minShowTime + timeDiff) * 1000
            }]
          )

          /* this.history.push({ 
            pub: pub, 
            scoreStart: pub.score, 
            scoreEnd: newScore, 
            length: timeDiff
          }) */
          
          
          pub.score = newScore

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

          if (topScorePub.publishedFor === 0 || topScorePub.lastShownTime < MIN5) {

              timeDiff = MIN5 - topScorePub.lastShownTime;

          } else {
              // the top pub was shown for at least 5 min

              let minTimeDiff = Infinity;

              let tempTimeDiff;

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

              // check if no time left
              timeDiff = Math.min(timeDiff, now - this.minShowTime)

          } // after top, calcTarget and timeDiff are calculated 

          if (this.minShowTime + timeDiff > now) timeDiff = now - this.minShowTime 

          this.minShowTime += timeDiff
          topScorePub.publishedFor += timeDiff;
          topScorePub.lastShownTime += timeDiff;

          let newScore = topScorePub.initialScore - scoreReduction(topScorePub.publishedFor);

          // in case of small score diff in results, make sure,
          // that the old pub value is smaller to avoid
          // small score diff calculation the next round
          if (Math.abs(newScore - calcTargetPub.score) < 0.000001) newScore = calcTargetPub.score - 0.000001;


          history.update(h => h = [...h, { 
              pub: topScorePub, 
              scoreStart: topScorePub.score, 
              scoreEnd: newScore, 
              length: timeDiff,
              startTime : this.minShowTime * 1000,
              endTime : (this.minShowTime + timeDiff) * 1000
            }]
          )

          /* this.history.push({ 
            pub: topScorePub, 
            scoreStart: topScorePub.score, 
            scoreEnd: newScore, 
            length: timeDiff
          }) */

          if (newScore <= 0) {

              topScorePub = calcTargetPub;
              delete pubs[sortedRecent[0]];

          } else {
              topScorePub.score = newScore;
          }

          this.topPub = topScorePub;

      }

    }

    currentPub.set(this.topPub);

    const newH = []
    
    let step = 0

    /* for (; step < this.history.length; step++) {
      const pub = this.history[step];

      const ph = { 
        link: pub.pub.link,
        length: pub.length,
        lengthTS: pub.length,
        scoreStart: pub.scoreStart,
        scoreEnd: pub.scoreEnd,
        total: new Date(1000 * reverseScore(pub.pub.initialScore)).toISOString().substr(11, 8)
      }

      ph.length = new Date(1000 * ph.length).toISOString().substr(11, 8);
      newH.push(ph);

    }

    this.history = [...this.history]
    this.history = this.history   */  


    /* for (const h of newH) {


      console.log(`Showed ${h.link} for ${h.length} (${h.lengthTS})`)
      console.log(`Score start: ${h.scoreStart}. Score end: ${h.scoreEnd} Total: ${h.total}`);
      console.log("\n");

    } */
    console.log("pubs:", this.publications);
    
  }

  publishNew(link, type, extra, stake) {
    /* return new Promise((resolve, reject) => {
      if (2+2 == 3) return reject({ status: "error", reason: "yo mama is too big"})
      return resolve({ status: "sucess", receiptName: "super receipt" });
    }) */

    return this.Publication.methods.publish(link, type, extra).send( 
      { from: this.account, 
        value:  web3.utils.toWei(stake, "ether"),
        gas: 3000000
      })
  }

}





function scoreReduction(s) {
  const time = s / 3600;
  //if (time <= 0.05) return 0;
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
