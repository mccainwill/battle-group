var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var eStats = require('../utils/eStats.js');
var utils = require('../utils/utils.js');
var battleSetup = require('./BattleSetupView.js');

// 
// Child Views are BattleDisplayView
//    healthbar views
var BattleSpaceView = Backbone.View.extend({

    template1: _.template(require('./statsBattle.html')),

    template2: _.template(require('./turnByTurn.html')),

    events: {
        'click .rematchbutton': 'onRematch',
        'click .statbutton': 'onStatBattle'
    },

    onRematch: function () {
            
        window.location.reload();
        
    },

    onStatBattle: function(){

        window.location.hash = '/battleSpace/'
                + battleSetup.initialize.heroPick1.get('id') + '/'
                + options.initialize.heroPick2.get('id') + '/stats';


    },

    onTurnBattle: function(){

    },

    onNewBattle: function(){

    },

    onClick: function () {
 
        function timerCallback () {

        }; 

        setTimeout(timerCallback, 1000);
    },

    initialize: function (options) {

        if (options.type === 'stats')  {
            this.statBattle = true;
        } else {
            this.statBattle = false;
        };

        if (this.statBattle === true) {
            this.$el.append(this.template1());  
        } else {
            this.$el.append(this.template2());  
        }

        this.model1 = options.model1;
        this.model2 = options.model2;

        this.count = 0;
        this.listenTo(this.model1 ,'sync', this.show);
        this.listenTo(this.model2 ,'sync', this.show);

        this.show();

        // INCOMPLETE!!!!!   Store Results from the Battle.

    },


    show: function () {
        var result;
        var _this = this;
        // We need to wait for two 'sync' events.
        if(this.count++ === 2) {

            console.log("BattleSpace Show Event");
            
            this.$el.find('.combatant_one > .char_pic').attr('src', (this.model1.get('thumbnail')
                                            + '/detail'
                                            + '.' + this.model1.get('extension')));

            this.$el.find('.combatant_two > .char_pic').attr('src', (this.model2.get('thumbnail')
                                            + '/detail'
                                            + '.'+this.model2.get('extension')));

            this.$el.find('.combatant_one > p').html(this.model1.get('name'));
            this.$el.find('.combatant_two > p').html(this.model2.get('name')); 

            function appendLI () {
                // console.log("turn by turn loop");
                // console.log(result.fightData.length);

                _this.$el.find('.turns').prepend($('<li>').html(result.fightData[counter].message));

                var healthRight = ((result.fightData[counter].defenderWounds / result.fightData[0].defenderWounds) * 100).toFixed(0);
                
                $('.health_right .health').css('width', function(width){
                    
                    if(healthRight < 100){
                        width = (healthRight + "%");
                        return width;
                    }
                    else{
                        width = (100 + "%");
                        return width;
                    }
                });

                var healthLeft = ((result.fightData[counter].attackerWounds / result.fightData[0].attackerWounds) * 100).toFixed(0);

                $('.health_left .health').css('width', function(width){
                    
                    if(healthLeft < 100){
                        width = (healthLeft + "%");
                        return width;
                    }
                    else{
                        width = (100 + "%");
                        return width;
                    }
                });

                console.log();
                console.log(result.fightData[counter].defenderWounds);
                console.log(result.fightData[0].defenderWounds);

                // this.$el.find('.health_right')

                counter++;

                if ($('.turns').children().length > maxLength) {
                    //$('.turns li:last-child').remove();
                };

                if (counter < result.fightData.length) {
                    setTimeout(appendLI, 2500);
                    

                };

                
            }

            if (this.statBattle === true) {
                result = BattleManager.statBattle(utils.getStats(this.model1.get('id')),
                                                  utils.getStats(this.model2.get('id')), 15);
                $('.victories_left > .wins').html((15 - result.fighter2.wins));
                $('.victories_left > .percent').html(((15 -result.fighter2.wins) / .15).toFixed(0));
                $('.victories_right > .wins').html(result.fighter2.wins);
                $('.victories_right > .percent').html((result.fighter2.wins / .15).toFixed(0));
            } else {
                result = BattleManager.narrativeBattle(utils.getStats(this.model1.get('id')),
                                                       utils.getStats(this.model2.get('id')));
                console.log("Turn By Turn");
                console.log(result);
                console.log(this.model1.attributes);
                console.log(this.model2.attributes);
                console.log(result.fightData[0].attackerWounds);

                if (result.winner !== 'draw') {

                    $.ajax({
                        url: '/api/battleResults',
                        data: {winner: result.winner.id, loser: result.loser.id},
                        method: 'POST'
                    });
                }

                var counter = 0;
                var maxLength = 5;
                setTimeout(appendLI, 1000);

            }   
        }   
    },

    render: function () {


        
    }

});

module.exports = BattleSpaceView;