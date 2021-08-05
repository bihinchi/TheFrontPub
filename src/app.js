import * as AbiFile from './Advertisement.json'

import Web3 from "./web3";


const MIN5 = 300

export const Dapp = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  publications: {},
  topAd: {},
  minShowTime: 0,
  firstTime: true,

  init: function() {
    return Dapp.initWeb3();
  },

  initWeb3: async function() {

    // TODO: refactor conditional
    if (typeof web3 == 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      Dapp.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      ethereum.enable()

    } else {
      // Specify default instance if no web3 instance provided
      Dapp.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(Dapp.web3Provider);

    }

    //console.log(web3);
    const accounts = await web3.eth.getAccounts();
    Dapp.account = accounts[0];

    return Dapp.initContract();
  },


  callContract: (method, params) => {
    const cal = "Dapp.Advertisement.methods" + method + ".call" + (params ? "('" + params + "')" : "()")
    return eval(cal);
  },


  topPublication: () => Dapp.callContract("topPublication")
                        .then(res => console.log(res))
  ,

  publication_to_show: () => Dapp.callContract("publication_to_show")
                        .then(res => console.log(res))
  ,


  checkScore: (link) =>  {Dapp.callContract("checkScore", link)
                        .then(res => console.log(res.toNumber()) )}
  ,


  initContract: function() {

    Dapp.Advertisement = new web3.eth.Contract(AbiFile.abi, "0x75985102e246302E887A2D4cA0e7D562190B0F1D");
    Dapp.Advertisement.setProvider(Dapp.web3Provider);
    Dapp.listenForEvents()
  },


  initScores: () => {

    const ads = Dapp.publications;
    const now = Date.now() / 1000;
    
    if (Object.keys(ads).length < 1) return;


    if (!Dapp.topAd) Dapp.topAd = Object.values(ads).find(elem => elem.lastShownTime === 0);
  
    
    let timeDiff = 0;
  
    while (Dapp.minShowTime < now) {

      const keys = Object.keys(ads);

      const minTime = Dapp.minShowTime || Math.min(...Object.values(ads).map(ad => ad.time));
      Dapp.minShowTime = minTime;

      //const sorted = sortedKeys(ads, minTime);
      

      const sorted = sortedKeys(ads, Dapp.minShowTime);

      if (sorted.length == 0) Dapp.minShowTime += 5;

      else if (keys.length == 1) {

        const ad = ads[keys[0]];
        ad.publishedFor += now - (Dapp.minShowTime || ad.time);
        ad.score = ad.initialScore - scoreReduction(ad.publishedFor);
        if (ad.score <= 0) delete ads[keys[0]];
        break

      } else {

        const sortedRecent = sorted//sorted.filter(key => ads[key].time <= Dapp.minShowTime);


        // Advance 5 sec forward if there are no ads yet
        if (!sortedRecent.length) {
          Dapp.minShowTime += 5;
          continue
        }


        const topScoreAd = ads[sortedRecent[0]]

        // If topAd changed, reset its last published timer
        if (topScoreAd !== Dapp.topAd) Dapp.topAd.lastShownTime = 0;


        // instantiate secondTopAd with first ad that is not topAd
        let secondTopScoreAd = ads[keys[0]] === topScoreAd ? ads[keys[1]] : ads[keys[0]];  



        let minTimeDiff = Infinity;

        for (const [key, ad] of Object.entries(ads)) {
          const scoreSmaller = ad.score <= topScoreAd.score, notInRecent = !sortedRecent.includes(key);
          if (ad === topScoreAd || ( scoreSmaller && notInRecent) ) continue;

          const tempTimeDiff = !scoreSmaller && notInRecent ? (ad.time - Dapp.minShowTime) 
                                                            : reverseScore(topScoreAd.score - ad.score)

          if (minTimeDiff > tempTimeDiff) {
            minTimeDiff = tempTimeDiff;
            secondTopScoreAd = ad;
          }

        }

        timeDiff = minTimeDiff;
        
        
  
        if (timeDiff < MIN5 && topScoreAd.lastShownTime < MIN5) timeDiff = MIN5 - topScoreAd.lastShownTime;
        if (timeDiff < 0) timeDiff = 20;        
        if (Dapp.minShowTime + timeDiff > now) timeDiff = now - Dapp.minShowTime;
        
        topScoreAd.publishedFor += timeDiff;
        topScoreAd.lastShownTime += timeDiff;
  
        let newScore = topScoreAd.initialScore - scoreReduction(topScoreAd.publishedFor);
        if (Math.abs(newScore - secondTopScoreAd.score) < 0.000001) newScore = secondTopScoreAd.score - 0.000001;
  
        if (newScore <= 0) {
          delete ads[sorted[0]];
        } else {
          topScoreAd.score = newScore;
        }
  
        Dapp.minShowTime += timeDiff
        Dapp.topAd = topScoreAd;
      }

    }
    
    console.log("loop break:", ads);

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {

    Dapp.Advertisement.getPastEvents('newPublished', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    .then(events => {
      
      for (const event of events) {

        if (!(event.returnValues._advLink in Dapp.publications)) Dapp.publications[event.returnValues._advLink] = {
            link : event.returnValues._advLink,
            desc : event.returnValues._description,
            initialScore : parseFloat(web3.utils.fromWei(event.returnValues._score)),
            time : web3.utils.toNumber(event.returnValues._time),
            score : parseFloat(web3.utils.fromWei(event.returnValues._score)),
            lastShownTime : 0,
            publishedFor: 0,
          }
      }

      console.log("before init", ...Object.values(Dapp.publications));
      Dapp.initScores();
      console.log("after init", ...Object.values(Dapp.publications));
      Dapp.render();

    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");


    $("#topAds").empty();

    console.log(Dapp.publications);
    Object.values(Dapp.publications).forEach(elem => {
      $("#topAds").append(
        "<li>" + elem.desc  + "</li>",
        "<li>" + elem.link  + "</li>",
        "<li>" + elem.score  + "</li>",
        "<br>"
      )
    })

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {

        Dapp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      } 
    });

    // Load contract data

    console.log(Dapp.Advertisement);

    const res = Dapp.Advertisement.methods.publication_to_show()

    console.log(res);

    res.call().then((publication) => {
      $("#advLink").attr("href", publication[0])
      $("#advLink").text(publication[1])
    })
    .catch((err) => console.error("Wababuba:", err))

    Dapp.Advertisement.methods.topPublication().call()
    .then((topAds) => {
    }).catch((err) => console.error(err))

  },



  publishNewAds : function() {

      var link = $("#adlink").val();
      var desc = $("#addescription").val();
      var price = $("#advalue").val() || 0.012;
      return Dapp.Advertisement.methods.publish(link, desc, 
        { from: Dapp.account, 
          value:  web3.toWei(price, "ether"),
          gas: 3000000
        })
      .then((result) => console.log("recept:", result))
      .catch((error) => console.error(error));
  }

};




/*
initScores: () => {

    const ads = Dapp.publications;
    const now = Date.now();

    if (Object.keys(ads).length < 1) return;
  
    let timeDiff = 0;
  
    while (Dapp.minShowTime < now) {
  
      let minTime = Dapp.minShowTime;

      let keys = Object.keys(ads);
  
      if (keys.length === 1) {
  
        const ad = ads[keys[0]];
        ad.publishedFor += now - (Dapp.minShowTime || ad.time);
        ad.score = ad.initialScore - scoreReduction(ad.publishedFor);
        if (ad.score <= 0) delete ads[keys[0]];
        return
      }
      else {
  
        if (Dapp.firstTime) {
  
          const ad = ads[keys[0]]; 
          const next = ads[keys[1]];
          timeDiff = (next.time - ad.time);
  
          if (timeDiff  < MIN5) timeDiff = MIN5;
          if (ad.time + timeDiff > now) timeDiff = (now - ad.time);

          ad.publishedFor += timeDiff;
          ad.score = ad.initialScore - scoreReduction(ad.publishedFor);
  
          Dapp.minShowTime = ad.time + timeDiff;
          //ad.lastShownTime = minShowTime;
  
          if (ad.score <= 0) {
            delete ads[keys[0]];
          } else {
            Dapp.topAd = ad;
          }
  
          Dapp.firstTime = false
          continue
        }
  
        const sorted = sortedKeys(ads, Dapp.minShowTime + MIN5);


        if (sorted.length == 1) {
          const ad = ads[keys[0]]; 
          const next = ads[keys[1]];
          timeDiff = (next.time - ad.time);
  
          if (timeDiff  < MIN5) timeDiff = MIN5;
          if (ad.time + timeDiff > now) timeDiff = (now - ad.time);

          ad.publishedFor += timeDiff;
          ad.score = ad.initialScore - scoreReduction(ad.publishedFor);
  
          Dapp.minShowTime = ad.time + timeDiff;
  
          if (ad.score <= 0) {
            delete ads[keys[0]];
          } else {
            Dapp.topAd = ad;
          }
        } else {

          const topScoreAd = ads[sorted[0]]
          const secondTopScoreAd = ads[sorted[1]];
  
          if (!secondTopScoreAd) {
            const a = 5;
          }
          
          if (!Dapp.topAd) Dapp.topAd = secondTopScoreAd;
          if (topScoreAd != Dapp.topAd) Dapp.topAd.lastShownTime = 0;
    
          const scoreDiff = topScoreAd.score - secondTopScoreAd.score;
          timeDiff = reverseScore(scoreDiff);
    
          if (timeDiff < MIN5 && topScoreAd.lastShownTime < MIN5) timeDiff = MIN5 - topScoreAd.lastShownTime;
          if (timeDiff < 0) timeDiff = 20;        
          if (Dapp.minShowTime + timeDiff > now) timeDiff = now - Dapp.minShowTime;
          
          topScoreAd.publishedFor += timeDiff;
          topScoreAd.lastShownTime += timeDiff;
    
          let newScore = topScoreAd.initialScore - scoreReduction(topScoreAd.publishedFor);
          if (Math.abs(newScore - secondTopScoreAd.score) < 0.000001) newScore = secondTopScoreAd.score - 0.000001;
    
          if (newScore <= 0) {
            delete ads[sorted[0]];
          } else {
            topScoreAd.score = newScore;
          }
    
          Dapp.minShowTime += timeDiff;
          Dapp.topAd = topScoreAd;

        }

      }
  
    }

    console.log("loop break:", ads);
  
  },
*/

/*
initScores: () => {

    const ads = Dapp.publications;
    const now = Date.now();

    if (Object.keys(ads).length < 1) return;
  
    let timeDiff = 0;
  
    while (Dapp.minShowTime < now) {
  

      let keys = Object.keys(ads);
  
      if (keys.length === 1) {
  
        const ad = ads[keys[0]];
        ad.publishedFor += now - (Dapp.minShowTime || ad.time);
        ad.score = ad.initialScore - scoreReduction(ad.publishedFor);
        if (ad.score <= 0) delete ads[keys[0]];
        return
      }
      else {
  
        // first time
        if (ads[keys[0]].publishedFor == 0) {
  
          const ad = ads[keys[0]]; 
          const next = ads[keys[1]];
          timeDiff = (next.time - ad.time);
  
          if (timeDiff  < MIN5) timeDiff = MIN5;
          if (ad.time + timeDiff > now) timeDiff = (now - ad.time);

          ad.publishedFor += timeDiff;
          ad.score = ad.initialScore - scoreReduction(ad.publishedFor);
  
          Dapp.minShowTime = ad.time + timeDiff;
          //ad.lastShownTime = minShowTime;
  
          if (ad.score <= 0) {
            delete ads[keys[0]];
          }
  
          Dapp.topAd = ad;
          //continue
        }
  
        const sorted = sortedKeys(ads);
  
        const topScoreAd = ads[sorted[0]]
        const secondTopScoreAd = ads[sorted[1]];
        
        //if (minShowTime == 0) minShowTime = topScoreAd.time;
        if (!Dapp.topAd) Dapp.topAd = secondTopScoreAd;
        if (topScoreAd != Dapp.topAd) Dapp.topAd.lastShownTime = 0;
  
        //topScoreAd.lastShownTime = minShowTime;
  
        const scoreDiff = topScoreAd.score - secondTopScoreAd.score;

        timeDiff = reversePrice(scoreDiff);
  
        if (timeDiff < MIN5 && topScoreAd.lastShownTime < MIN5) timeDiff = MIN5 - topScoreAd.lastShownTime;
        if (timeDiff < 0) timeDiff = 20;        
        if (Dapp.minShowTime + timeDiff > now) timeDiff = now - Dapp.minShowTime;
        
        topScoreAd.publishedFor += timeDiff;
        topScoreAd.lastShownTime += timeDiff;
  
        let newScore = topScoreAd.initialScore - scoreReduction(topScoreAd.publishedFor);
        if (Math.abs(newScore - secondTopScoreAd.score) < 0.000001) newScore = secondTopScoreAd.score - 0.000001;
  
        if (newScore <= 0) {
          timeDiff = reversePrice(topScoreAd.score);
          delete ads[sorted[0]];
        } else {
          topScoreAd.score = newScore;
        }
  
        Dapp.minShowTime += timeDiff;
        Dapp.topAd = topScoreAd;
        //minShowTime = topScoreAd.lastShownTime + timeDiff;
        //topScoreAd.lastShownTime = minShowTime; 
  
        //console.log("TD:", timeDiff);
        //if (index == 8) return;
        //index++;
      }
  
    }
  
  },
*/


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








function init(events) {
  const ads = {}
  for (const event of events) {
    ads[event.id] = { 
      initialScore : event.price,
      time: event.time,
      lastShownTime : 0, //event.time,
      score: event.price,
      publishedFor: 0,
    }
  }

  initScores(ads)
  Object.keys(ads).forEach((e) => console.log(ads[e]))
  console.log("\n\n\n");

  let sum = 0;
  Object.keys(ads).forEach(key => { sum += ads[key].publishedFor})
  console.log("TotalPublished:", sum);
  console.log("Diff:", now - 1100);
  console.log("\n");

  return ads
}
/* 
let now = 1138;

console.log("now:", now);
let events = [
  { id: 1, time: 1100, price: 2}, 
  { id: 2, time: 1104, price: 2.4 },
  { id: 3, time: 1113, price: 2.11 },
  { id: 4, time: 1126, price: 2.1 }, 
  { id: 5, time: 1138, price: 3.5 }, 
]

events = events.filter(e => { return e.time <= now});


//ads = Object.keys(ads).filter(e => ads[e].time <= now)

let ads = init(events)
//console.log("ads;", ads);
 */

/* const timer = setInterval(() => {  
  now += 1;
  console.log(Object.values(ads));
  initScores(ads)
  console.log("now:", now)
  console.log(Object.values(ads));
  //console.log("TotalPublished:", Object.values(ads).reduce((a, b) => { return (typeof a === 'object' ? a.publishedFor : a) + b.publishedFor; }));
  //console.log("Diff:", now - 1100);
  
  
  if (now - 1100 !== Math.round(Object.values(ads).reduce((a, b) => { return (typeof a === 'object' ? a.publishedFor : a) + b.publishedFor; }))) {
    console.log("TotalPublished:", Object.values(ads).reduce((a, b) => { return (typeof a === 'object' ? a.publishedFor : a) + b.publishedFor; }));
    console.log("Diff:", now - 1100);
  }

  console.log("\n");
  if (now == 1366) clearInterval(timer)
}, 4000)
 */


class LeaderBoard {

  constructor() {
    this.topAd = {};
    this.ads = [];

    this.topTimer = 0;
  }

  updateTop() {

    if (now - this.topTimer >= 5) {
      this.topAd.score -= this.topAd.price - scoreReduction(now - this.topAd.time)
      if (this.topAd.score <= 0) this.ads = this.ads.filter(ad => ad.score > 0);
      this.topAd = this.ads.reduce((a, b) => Math.max(a.score, b.score))
    } else {
      setTimeout(this.updateTop.bind(this), (now - this.topTimer) * 6000)
    }

  }


}





/* 
$(function() {
  $(window).load(function() {
    Dapp.init();
  });
});
 */