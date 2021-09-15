const assert = require('assert');
const { now } = require('svelte/internal');

const MockDapp = require( "./mockdapp");
const mockData = require("./test_data")

describe('Init scores', function() {

    
    describe("should show right top publication", function() {
        
        for (const initScoreTest of mockData.initScoreTests) {

            it(initScoreTest.title, function() {

                const dapp = initScoreTest.now 
                            ? new MockDapp(initScoreTest.events, initScoreTest.now)
                            : new MockDapp(initScoreTest.events)
                
        
                assert.equal(dapp.topPub.link, initScoreTest.top)
            })

        }
    });

    describe("should show right scores", function() {
        
        for (const scoreCalcTest of mockData.scoreCalcTests) {

            it(scoreCalcTest.title, function() {

                const dapp = scoreCalcTest.now 
                            ? new MockDapp(scoreCalcTest.events, scoreCalcTest.now)
                            : new MockDapp(scoreCalcTest.events)
                
        
                assert.equal(dapp.topPub.score, scoreCalcTest.score)
            })

        }
    });



    describe("changes in what to show after some time", function() {

        for (const newEventTest of mockData.newEventTests) {

            it(newEventTest.title, function() {

                const dapp = new MockDapp(newEventTest.events, newEventTest.initTime)
                
                for (const event of newEventTest.newEvents)
                    dapp.addEvent(event)

                assert.equal(dapp.topPub.link, newEventTest.top)
            })

        }

    })
})