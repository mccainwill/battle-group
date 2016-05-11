var express = require('express');
var bodyParser = require('body-parser');
// making an instance of express
var app = express();
app.use(express.static(__dirname + '/public'));


// express.static will take a path to the files
// we want to serve publicly
// middleware = functions that get executed with the request and the response

var battleResultsIds = 0;


var battleResults = [{winner: 1009148, loser:1009146},
                     {winner: 1009149, loser: 1011334},                    
                     {winner: 1010903, loser: 1011266},                    
                     {winner: 1009149, loser: 1011334},                    
                     {winner: 1011334 , loser: 1009149},                    
                     {winner: 1011334 , loser: 1009149},                    
                     {winner: 1011334 , loser: 1009149},                    
                     {winner: 1011334 , loser: 1009149},                    
                     {winner: 1011334 , loser: 1009149},                    
                     {winner: 1009149, loser: 1011334},                    
                     {winner: 1009149, loser: 1011334},                    
                     {winner: 1009149, loser: 1011334},                    
                     {winner: 1009149, loser: 1011334},                    
                     {winner: 1009149, loser: 1011334},                    
                     {winner: 1009149, loser: 1011334}                    
                ];



function topPicks (arr) {

    //  Count up all the heros in battle.

    var found;
    var heroList = [];

    arr.forEach( function (current) {
        winnerFound = false;
        loserFound = false;
        heroList.forEach( function (inner) {
            if (current.winner  === inner.id) {
                inner.count++;
                winnerFound = true;
            };

            if ( current.loser === inner.id ) {
                    inner.count++;
                    loserFound = true;
            };
        });

        if ( winnerFound === false) {
            heroList.push({id:current.winner, count: 1});
        };

        if ( loserFound === false) {
            heroList.push({id:current.loser, count: 1});
        };     

    });

    heroList.sort (function (a, b) {
        if (a.count === b.count) {
            return 0;
        }

        if (a.count > b.count) {
            return 1;
        } else {
            return -1;
        }

    });

    heroList.reverse();

    return heroList;
}

function winsAndLosses ( id ) {

    var winCount = 0;
    var loseCount = 0;

    console.log(id);

    battleResults.forEach( function (current) {
        console.log(current);
        if (parseInt(current.winner) === parseInt(id)) {
        console.log(  'Add to winner');
            winCount++;
        };

        if (parseInt(current.loser) === parseInt(id)) {
            loseCount++;
        };

    });

    return { wins: winCount, losses: loseCount}
}


app.use(bodyParser());
// what bodyParser does is add a propery to the request, called body, that we can use

app.get('/api/battleResults', function (req, res) {
    // /api/battleResults?limit=5
    var result = battleResults.slice();

    if (req.query.order === 'desc') {
        result = result.sort(function (prev, next) {
            return next.id - prev.id;
        });
    }

    if (req.query.limit) {
        result = result.slice(0, req.query.limit);
    }

    res.json(result);
});

app.post('/api/battleResults', function (req, res) {
    req.body.id = battleResultsIds++;
    battleResults.push(req.body);
});

app.get('/api/topPicks', function (req, res) {
    var result = topPicks(battleResults);
    if (req.query.limit) {
        result = result.slice(0, req.query.limit);
    }
    res.json(result);
});

app.get('/api/winsAndLosses', function (req, res) {
 
    var result = winsAndLosses(req.query.hero);
    res.json(result);
    console.log(result);
});

app.listen(process.env.PORT || 8000);