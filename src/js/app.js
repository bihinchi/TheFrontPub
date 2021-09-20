import * as AbiFile from '../contracts/build/Publication.json'
import { currentPub, history } from './stores.js';
import { Leaderboard } from './leaderboard';


import Web3 from "./web3.min";


const MIN5 = 900
const SMALL_DIFF = 0.000001;


const networks = {
  1 : "0x2db6D9a1d7D1304E380CFBbeE0896E46F2573625",
  3 : "0x657f9AD6ec2D3F147F37d56700a4b5ef3468a08c",
  4 : "0x657f9ad6ec2d3f147f37d56700a4b5ef3468a08c",
}



export class Dapp {

  constructor() {
    this.web3Provider = null;
    this.account = '';
    this.networkId = 1;
    this.reset();
  }


  reset() {
    this.publications = {};
    this.topPub = {};
    this.minShowTime = 0;
    this.firstTime = true;
    this.connected = false;//(typeof ethereum !== 'undefined') && ethereum.isConnected();
    currentPub.set({});
    history.set([]);
  }


  init() {
    return new Promise((resolve, reject) => 
      this.initWeb3()
      .then(() => this.initPublications())
      .then(() => resolve())
      .catch(e => reject(e))
    )
  }


  async initWeb3() {

    const updateNetwork = (netId) => {

      if (this.networkId !== netId) {
        this.networkId = netId;
        this.reset();
        this.initPublications()
        .catch(e => console.log(e));
      }
    }

    if (typeof ethereum !== 'undefined') {

      this.web3Provider = ethereum;
      web3 = new Web3(this.web3Provider);
      await ethereum.request({ method: 'eth_requestAccounts' })

      ethereum.on('disconnect', e => this.connected = false );
      ethereum.on('chainChanged', id => updateNetwork(Number(id.substring(2))) )

    } else {

      this.web3Provider = new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/402dfb58b389421e9d9ce1f4461ca598');
      window.web3 = new Web3(this.web3Provider);

      if (!(await web3.eth.net.isListening())) {

        const text = "Couldn\'t connect to an Ethereum node. This dapp supports injecting by MetaMask and a gateway provided by Infura."

        currentPub.set({
          link: "https://ethereum.org/en/developers/docs/nodes-and-clients/",
          type: "link",
          extra: { linkText : text }
        })

        throw new Error(text);
      
      }

      setInterval(() => { 
        web3.eth.getChainId()
        .then((id) => updateNetwork(id))
        .catch(console.error)
      }, 1800);
    }

    const accounts = await web3.eth.getAccounts(); 
    this.networkId = await web3.eth.getChainId()

    this.account = accounts[0];
    this.connected = true;
  
  };


  async initPublications() {
    return this.initContract()
    .then(() => this.getEvents())
    .then(() => this.initScores())
  }


  async initContract() {

    if (!networks[this.networkId]) {

      const text = "The contract address couldn\'t be found on the current network"

      currentPub.set({
        link: "https://ethereum.org/en/developers/docs/networks/",
        type: "link",
        extra: { linkText : text }
      })

      throw new Error(text);
    }

    this.Publication = new web3.eth.Contract(AbiFile.abi, networks[this.networkId]);    
    this.Publication.setProvider(this.web3Provider);    
  }

  processEvent(event) {

    const score = parseFloat(web3.utils.fromWei(event.returnValues._score));

    if (!(event.returnValues._link in this.publications)) this.publications[event.returnValues._link] = {
        link : event.returnValues._link,
        type : event.returnValues._type,
        extra: event.returnValues._extra.length > 30 ? JSON.parse(event.returnValues._extra) : {},
        time : web3.utils.toNumber(event.returnValues._time),
        maxPublishedFor: reverseScore(score),
        initialScore : score,
        score : score,
        lastShownTime : 0,
        publishedFor: 0,
    }

    Leaderboard.processRecord(event.returnValues._sender, score, 
                event.returnValues._link, event.returnValues._type) 

  }


  async getEvents() {

    // get all passed
    const events = await this.Publication.getPastEvents('newPublished', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    events.forEach(e => this.processEvent(e))

    // listen for new
    this.Publication.events.newPublished({
      fromBlock: 'latest',
    }, e => {
      this.processEvent(e);
      this.initScores();
    })
  }

  initScores () {

    const pubs = this.publications;

    if (Object.keys(pubs).length === 0) return;
    
    const now = Date.now() / 1000;

    if (!this.topPub) this.topPub = Object.values(pubs).find(elem => elem.lastShownTime === 0);
    
    let timeDiff = 0;
  
    while (this.minShowTime < now) {

      const keys = Object.keys(pubs);
      
      this.minShowTime = Math.max(this.minShowTime, 
        Math.min(...Object.values(pubs).map(pub => pub.time)))
      
      if (keys.length == 1) {

          const pub = pubs[keys[0]];

          if (pub !== this.topPub) {
            if (this.topPub.lastShownTime) 
            this.topPub.lastShownTime = 0
          };

          this.topPub = pub

          timeDiff = Math.min(now - this.minShowTime, pub.maxPublishedFor - pub.publishedFor)

          this.minShowTime += timeDiff;
          pub.lastShownTime += timeDiff;
          pub.publishedFor += timeDiff;

          let newScore = pub.publishedFor < pub.maxPublishedFor 
                ? pub.initialScore - scoreReduction(pub.publishedFor) : 0;
          

          history.update(h => h = addToHistory(
            h,
            pub,
            newScore,
            this.minShowTime,
            timeDiff
          ))
          
          pub.score = newScore

          if (pub.score <= 0) {
              delete pubs[keys[0]];
              this.topPub = {}
          }
          break

      } else {
          // more than 1 event

          let sortedRecent = sortedKeys(pubs, this.minShowTime );

          if (sortedRecent.length == 0) { 
            this.minShowTime = Math.min(...Object.values(pubs).map(pub => pub.time));
            sortedRecent = sortedKeys(pubs, this.minShowTime)
          }

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
              timeDiff = 1 < minTimeDiff && minTimeDiff < Infinity ? minTimeDiff : 5; 

          }

          timeDiff = Math.min(timeDiff, topScorePub.maxPublishedFor - topScorePub.publishedFor, now - this.minShowTime)

          this.minShowTime += timeDiff
          topScorePub.publishedFor += timeDiff;
          topScorePub.lastShownTime += timeDiff;


          let newScore;

          if (topScorePub.publishedFor >= topScorePub.maxPublishedFor) {

            newScore = 0

          } else {

            newScore = topScorePub.initialScore - scoreReduction(topScorePub.publishedFor);
  
            // in case of small score diff in results, make sure,
            // that the old pub value is smaller to avoid
            // small score diff calculation the next round
            if (Math.abs(newScore - calcTargetPub.score) < SMALL_DIFF) newScore = calcTargetPub.score - SMALL_DIFF;

          }

          history.update(h => h = addToHistory(
            h,
            topScorePub,
            newScore,
            this.minShowTime,
            timeDiff
          ))


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
    setTimeout(this.initScores.bind(this), this.minShowTime);
  }

  publishNew(link, type, extra, stake) {

    return this.Publication.methods.publish(link, type, extra).send( 
      { from: this.account, 
        value:  web3.utils.toWei(stake, "ether"),
        gas: 360000
      })
  }

}





function scoreReduction(s) {
  const time = s / 3600;
  if (time <= 1) return 0.05*time;
  return 0.00014038530109067304 * time * time + 0.03779471529884403935 * time + 0.01206489939977473114
}


function reverseScore(price) {

  // linear
  if (price <= 0.05) return 3600*price / 0.05

  //squared
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




function addToHistory(history, pub, newScore, startTime, length) {

  const last = history[history.length - 1];
  
  if (history.length > 0 && last.pub.link === pub.link) {
    last.endTime = (startTime + length) * 1000;
    last.scoreEnd = newScore;
    last.length += length;
  } else {
    history.push({
      pub: pub, 
      scoreStart: pub.score, 
      scoreEnd: newScore, 
      length: length,
      startTime : startTime * 1000,
      endTime : (startTime + length) * 1000
    })
  }
  return history;
}

// 18:22