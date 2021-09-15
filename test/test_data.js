
const newEventTests = [

    {
        title: "new came less than 5 min after the initial",
        events : [ {
            link: 1,
            score: 1,
            time: 1630000000
        } ],

        newEvents : [ {
            link: 2,
            score: 1,
            time: 1630000200
        } ],

        top : 1,
        initTime: 1630000100,
    },

    {
        title: "new came more than 5 min after the initial",
        events : [ {
            link: 1,
            score: 1,
            time: 1630000000
        } ],

        newEvents : [ {
            link: 2,
            score: 1,
            time: 1630000350
        } ],

        top : 2,
        initTime: 1630000100,
    },

    {
        title: "initial, 5 min, the first new, less than 5 more minutes, the second new",
        events : [ {
            link: 1,
            score: 1,
            time: 1630000000
        } ],

        newEvents : [ {
            link: 2,
            score: 1,
            time: 1630000350
        }, {
            link: 3,
            score: 1,
            time: 1630000450
        } ],

        top : 2,
        initTime: 1630000100,
    },

    {
        title: "initial, 6 min, the first new, 5 more minutes, the second new",
        events : [ {
            link: 1,
            score: 1,
            time: 1630000000
        } ],

        newEvents : [ {
            link: 2,
            score: 1,
            time: 1630000360
        }, {
            link: 3,
            score: 1,
            time: 1630000661
        } ],

        top : 3,
        initTime: 1630000100,
    },

]

const initScoreTests = [
    {
        title: "one event fresh",
        events : [ {
            link: 1,
            score: 1,
            time: 1630000000
        } ],
        top : 1,
        now: 1630000005
    }, 

    {
        title: "one event old",
        events : [ {
            link: 1,
            score: 1,
            time: 1630000000
        } ],
        top : undefined,
        now: 1630100000
    },


    {
        title: "less than five minutes after first",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000100
            }, 
        ],
        top : 1,
        now: 1630000200
    },


    {
        title: "more than five minutes after first and before second",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000302
            }, 
        ],
        top : 1,
        now: 1630000301
    },

    {
        title: "more than five minutes after first and after second",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000299
            }, 
        ],
        top : 2,
        now: 1630000301
    },

    {
        title: "more than five minutes after first and second",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000301
            }, 
        ],
        top : 2,
        now: 1630000305
    },


    {
        title: "all 3 are less than 5 minutes old",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000060
            }, {
                link: 3,
                score: 1,
                time: 1630000120
            },             
        ],
        top : 1,
        now: 1630000180
    },

    {
        title: "5 min after first before others",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000360
            }, {
                link: 3,
                score: 1,
                time: 1630000380
            },             
        ],
        top : 1,
        now: 1630000301
    },

    {
        title: "more than 5 min after first before the third and after second",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000310
            }, {
                link: 3,
                score: 1,
                time: 1630000380
            },             
        ],
        top : 2,
        now: 1630000330
    },

    {
        title: "more than 5 min after first and second before the third ",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000050
            }, {
                link: 3,
                score: 1,
                time: 1630000380
            },             
        ],
        top : 2,
        now: 1630000351
    },

    {
        title: "more than 5 min after first, after the second and after the third ",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000250
            }, {
                link: 3,
                score: 1,
                time: 1630000301
            },             
        ],
        top : 2,
        now: 1630000303
    },

    {
        title: "1: 0, 2: +50, 3: +420, now: +450, (first until +300, second until +600)",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000050
            }, {
                link: 3,
                score: 1,
                time: 1630000420
            },             
        ],
        top : 2,
        now: 1630000450
    },

    {
        title: "1: 0, 2: +50, 3: +420, now: +601, (first until +300, second until +600)",
        events : [ {
                link: 1,
                score: 1,
                time: 1630000000
            }, {
                link: 2,
                score: 1,
                time: 1630000050
            }, {
                link: 3,
                score: 1,
                time: 1630000420
            },             
        ],
        top : 3,
        now: 1630000601
    }
]

const scoreCalcTests = []



module.exports = {
    initScoreTests,
    newEventTests,
    scoreCalcTests
}
