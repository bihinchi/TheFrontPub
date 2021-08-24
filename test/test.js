const assert = require('assert');

const MockDapp = require( "./mockdapp");
const mockData = require("./test_data")

describe('Init scores', function() {

    const initScores = mockData.initScores;
    
    describe("should initialise scores of events and show right top", function() {
        
        for (const initScore of initScores) {

            it(initScore.title, function() {

                const dapp = initScore.now 
                            ? new MockDapp(initScore.events, initScore.now)
                            : new MockDapp(initScore.events)
                
        
                assert.equal(dapp.topPub.link, initScore.top)
            })

        }
    });
})