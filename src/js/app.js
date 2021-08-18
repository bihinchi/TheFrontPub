import * as AbiFile from '../contracts/build/Publication.json'

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

    // Temproral condition
    // TODO: inverse the equality in production
    
    if (typeof web3 == 'undefined') 
      Dapp.web3Provider = web3.currentProvider;
    else 
      Dapp.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    
    web3 = new Web3(Dapp.web3Provider);

    const accounts = await web3.eth.getAccounts();
    Dapp.account = accounts[0];

    console.log("Acc:", Dapp.account);

    return Dapp.initContract();
  },


  callContract: (method, params) => {
    const cal = "Dapp.Publication.methods" + method + ".call" + (params ? "('" + params + "')" : "()")
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
    Dapp.Publication = new web3.eth.Contract(AbiFile.abi, "0x9e4D6398b37A82BB78bf753793e189044379d8Fe");    
    Dapp.Publication.setProvider(Dapp.web3Provider);    
    return Dapp.listenForEvents()
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


    Dapp.Publication.getPastEvents('newPublished', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    .then(events => {

      for (const event of events) {

        console.log(event);

        if (!(event.returnValues._link in Dapp.publications)) Dapp.publications[event.returnValues._link] = {
            link : event.returnValues._link,
            type : event.returnValues._type,
            desc : event.returnValues._extra,
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
      //Dapp.render();

      
    });

    return Dapp;
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    let elem = Object.values(Dapp.publications)[0];

    console.log("elem:", elem);

    if (elem == undefined) elem = {
      link : "#",
      desc : "No ads"
    };

    $("#advLink").attr("href", elem.link)
    $("#advLink").text(elem.desc)

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        Dapp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      } 
    });


    /* Dapp.Publication.methods.topPublication().call()
    .then((topAds) => {
    }).catch((err) => console.error(err)) */

  },



  publishNewAds : function() {

      var link = "www.example.com" // $("#adlink").val();
      var extra = "Example" // $("#addescription").val();
      var price = "1" // $("#advalue").val() || 0.01;
      const pubType = "link"



      return Dapp.Publication.methods.publish(link, pubType, extra).send( 
        { from: Dapp.account, 
          value:  web3.utils.toWei(price, "ether"),
          gas: 3000000
        })
      .then((result) => console.log("recept:", result))
      .catch((error) => console.error(error));
  }

};



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
