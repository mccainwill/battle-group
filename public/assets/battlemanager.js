var BattleManager = ( function( window, undefined ){

    //UTILITY FUNCTIONS, PRIVATE

    //adds tiny jitter to a number scaled by the maximum
    //size of the number
    var jitter = function jitter( num, size ){

            var s = size || 0.1,
                s2 = s * 2;

            return num + s - Math.random() * s2;
        },
        //nonlinear, scales lower numbers aggressively
        ramp = function ramp( x ){

            return 15 * x / ( 5 + x );
        },
        //nonlinear, scales higher numbers agressively
        scale = function scale( x ){

            return x * x / ( x / 2 + 5 );
        },

        //maps a number in one range to anther range
        //both ranges start with 0
        remap = function( x, range, newrange ){

            return newrange * ( x / range );
        },
        //returns sub array of elements that return true when
        //passed to func
        filter = function filter( arr, func ){

            var arr2 = [];

            for( var i = 0, len = arr.length; i < len; i++ ){

                if( func( arr[ i ], i, arr ) ){ arr2.push( arr[ i ] ); }  
            }

            return arr2;
        },
        //runs func for each element in arr
        //returns an array of results from func
        each = function each( arr, func ){

            var arr2 = [];

            for( var i = 0, len = arr.length; i < len; i++ ){

                arr2.push( func( arr[ i ], i, arr ) );
            }

            return arr2;
        },
        //iterates over an array and adds up all of the
        //elements of the array, non-standard reduce
        reduce = function reduce( arr, func, init ){

            var sum = init != undefined ? init : 0,
                f   = func || function( val, sum ){ return sum + val; };

            for( var i = 0, len = arr.length; i < len; i++ ){

                sum = f( arr[ i ], sum );
            }

            return sum;
        },
        //keeps a number within a certain range
        clamp = function clamp( num, min, max ){

            if( min >= max ){
                throw "clamp: invalid range, min = " + min + ", max = " + max;
            }

            if( num < min ){ return min; }
            if( num > max ){ return max; }

            return num;
        },
        //random element from an array
        random = function random( arr ){

            return arr[ Math.floor( Math.random() * arr.length ) ];
        };

    //dic rolls
    var dice = {
            //one dice roll
            roll : function diceroll( sides ){

                return Math.floor( Math.random() * ( sides || 6 ) + 1 );
            },
            //returns an array of dice rolls
            toss : function dicethrow( count, sides ){

                var rolls = [];

                for( var i = 0; i < ( count || 1 ); i++ ){

                    rolls.push( this.roll( sides ) );
                }

                return rolls;
            }
        };


    //constructor function for fighter objects
    //used by BattleManager to reconstruct fighter stats for use by the manager
    var Fighter = function Fighter( stats ){

            this.name = stats.name;
            this.id   = stats.id;
            this.x    = 0;

            this.__type = "Fighter";

            this.source = {
                durability   : jitter( remap( stats.durability, 7, 6 ),   0.25 ),
                energy       : jitter( remap( stats.energy, 7, 6 ),       0.25 ) ,
                fighting     : jitter( remap( stats.fighting, 7, 6 ),     0.25 ),
                intelligence : jitter( remap( stats.intelligence, 7, 6 ), 0.25 ),
                speed        : jitter( remap( stats.speed, 7, 6 ),        0.25 ),
                strength     : jitter( remap( stats.strength, 7, 6 ),     0.25 )
            };

            this.armor = 5 - remap( 0.3 * this.source.durability + 0.1 * this.source.fighting + 0.3 * this.source.speed + 0.3 * this.source.strength, 6, 5 );

            if( this.armor < 0 ){ this.armor = 0; }
            this.armor = Math.floor( this.armor + 2 );
            
            this.assaultStrength = 0.6 * this.source.strength + 0.4 * this.source.speed;
            this.assaultSkill    = ramp( 0.7 * this.source.fighting + 0.3 * this.source.speed );
            this.toughness       = 0.3 * this.source.strength + 0.7 * this.source.durability;
            this.initiative      = 0.8 * this.source.speed + 0.2 * this.source.intelligence;
            this.attacks           = 1 + Math.floor( ( 0.2 * this.source.fighting + 0.8 * this.source.speed ) * 0.6 );
            this.wounds            = Math.floor( 10 * ramp( remap( this.source.durability, 6, 10 ) ) );
            this.ballisticStrength = 0.9 * this.source.energy + 0.1 * this.source.intelligence;
            this.ballisticSkill    = ramp( 0.8 * this.source.energy + 0.1 * this.source.fighting + 0.1 * this.source.intelligence ); 
        };

    //simple messenger object that manages the fight messages by type
    var messenger = {

        hasMessages : false,

        message : function message( type, attacker, defender ){

            if( !this.hasMessages ){ throw "messenger.message: Messages not added to messenger. Use BattleManager.addMessages( messages )" }

            return reduce( random( this.get( type ) ), function( val, sum ){

                return sum += ( val === 0 ? attacker.name : ( val === 1 ? defender.name : val ) );
            }, "" );
        },

        get : function( type ){

            var typeArray = type.split( ":" ),
                len       = typeArray.length,
                messages  = this.messages;

            for( var i = 0; i < len; i++ ){

                if( messages[ typeArray[ i ] ] != undefined ){

                    messages = messages[ typeArray[ i ] ];
                }
                else{
                    throw "messenger.get( type ): requested message type does not exist.";
                }
            }

            return messages;
        },

        messages : {}
    };


    var BattleManager = {

            fightdata : [],

            //should the fight continue?
            //Are both combatants still breathing?
            shouldContinue : function shouldContinue( c1, c2 ){

                return c2.wounds > 0 && c1.wounds > 0;
            },
            //initiate the fight.
            battle : function battle( fighter1, fighter2 ){

                var count = 0,
                    isDraw = false,
                    //who attacks first in close combat?
                    ix  = fighter1.initiative > fighter2.initiative,

                    //whomever is faster is c1,
                    //and will always attack first
                    c1  = ix ? fighter1 : fighter2,
                    c2  = ix ? fighter2 : fighter1;
                
                //holds all of the messages and data from the battle
                this.fightdata = [];

                //while both combatants are active and the fight hasn't gone on too long
                //keep fighting, turn by turn fighting
                while( this.shouldContinue( c1, c2 ) && count < 10 ){

                    //run a turn for the first combatant
                    this.characterTurn( c1, c2 );

                    //if someone has won, break out of the loop
                    if( !this.shouldContinue( c1, c2 ) ){ break; }

                    //run a turn for the second combatant
                    this.characterTurn( c2, c1 );

                    //if someone has won, break out of the loop
                    if( !this.shouldContinue( c1, c2 ) ){ break; }

                    //issue a round completion message
                    this.message( "round:full", c1, c2 );

                    //iterate the count
                    count++;
                }

                //if the fight is a draw issue a message
                if( count === 10 ){

                    this.message( "round:draw", c1, c2 );
                    isDraw = true;
                }
                else{
                    //if the fight has ended, calculate the winner and loser
                    if( c1.wounds > c2.wounds ){
                        //issue the winner message
                        this.message( "round:partial", c1, c2 );
                    }else{
                        //issue the winner message
                        this.message( "round:partial", c2, c1 );
                    }
                }

                //return the fight data
                return {
                    fightData : this.fightdata,
                    rounds    : count,
                    winner    : isDraw ? "draw" : c1.wounds > c2.wounds ? c1 : c2,
                    loser     : isDraw ? "draw" : c1.wounds > c2.wounds ? c2 : c1
                };
            },
            //runs shooting and assault for one character, c1
            characterTurn : function characterTurn( c1, c2 ){

                //shooting phase
                this.takeDamage( c2, this.shoot( c1, c2 ) );
                // //assault phase
                this.takeDamage( c2, this.assault( c1, c2 ) );
            },

            //assigns damage to defender character
            takeDamage : function takeDamage( defender, damage ){

                if( damage === 0 || damage === undefined ){ return false; }
                
                defender.wounds -= damage;
                return true;
            },

            shoot : function shoot( attacker, defender ){

                var hits, damage;

                //returns the number of successful hits by the attacker against the defender
                //depends solely on the attackers ballistic skill
                hits = this.ballisticHitsRoll( attacker, 6 );

                //if no hits, issue a message and return 0 damage
                if( hits <= 0 ){
                    this.message( "shoot:failed:hit", attacker, defender );
                    return 0;
                }

                //returns the total damage inflicted by the attacker against the defender
                damage = this.armorSaveRoll( hits, attacker, defender, 6 );

                //if all hits are blocked, issue a message and return 0 damage
                if( damage <= 0 ){
                    this.message( "shoot:failed:blocked", attacker, defender );
                    return 0;
                }

                damage *= attacker.ballisticStrength * 3;
                this.message( "shoot:success", attacker, defender, damage );

                //returns the total damage inflicted by the attacker against the defender
                return damage;
            },

            //rolls to hit, to wound and armor saves to determine the final damage against a defender
            assault : function assault( attacker, defender ){

                var hits, damage;

                //returns the number of successful hits by the attacker against the defender
                hits = this.assaultHitsRoll( attacker, defender, 6 );
                
                //if no hits, issue a message and return 0 damage
                if( hits <= 0 ){
                    this.message( "assault:failed:hit", attacker, defender );
                    return 0;
                }

                damage = this.armorSaveRoll( hits, attacker, defender, 6 );

                //if all hits are blocked, issue a message and return 0 damage
                if( damage <= 0 ){
                    this.message( "assault:failed:blocked", attacker, defender );
                    return 0;
                }

                //if some hits are unblocked, calculate the damage done and issue a message
                damage *= attacker.assaultStrength * 3;
                this.message( "assault:success", attacker, defender, damage );

                //return the total damage inflicted by the attacker against the defender
                return damage;
            },

            //roll a number of dice equal to the number of attacks,
            //filter them by sucessful hits and return the number of hits
            //'attacker' is the Fighter object attacking, 'faces' is the number of faces on the dice rolled
            ballisticHitsRoll : function ballisticHitsRoll( attacker, faces ){

                
                return filter( dice.toss( attacker.attacks, faces ), function( thr, index, arr ){

                        return thr >= attacker.ballisticSkill;
                    } );
            },

            //rolls the attacker attacks against the defender
            //returns an array of successful attacks
            //'attacker' is the Fighter object attacking, 'faces' is the number of faces on the dice rolled
            overwatchHitsRoll : function overwatchHitsRoll( attacker, faces ){


                return filter( dice.toss( attacker.attacks, faces ), function( thr, index, arr ){

                        return thr >= 6;
                    } );
            },

            //rolls the attacker attacks against the defender
            //returns an array of successful attacks
            //'attacker' is the Fighter object attacking,
            //'defender' is the Figheter object being attacked,
            //'faces' is the number of faces on the dice rolled
            assaultHitsRoll : function assautlHitsRoll( attacker, defender, faces ){

                return filter( dice.toss( attacker.attacks, faces ), function( thr, index, arr ){

                        return thr >= clamp( 4 - ( attacker.assaultSkill - defender.assaultSkill ) / 2, 2, 6 );
                    } );
            },

            //rolls armor saves to stop damage from wounds inflicted by the attacker
            //returns an integer of damage unsaved
            //'wounds' is the number of dice rolls not blocked by the defender
            //'attacker' is the Fighter object attacking,
            //'defender' is the Figheter object being attacked,
            //'faces' is the number of faces on the saving dice rolled
            armorSaveRoll : function armorSaveRoll( wounds, attacker, defender, sides ){

                return reduce( each( dice.toss( wounds.length, sides ), function( thr, index, arr ){

                        return thr < defender.armor ? 1 : 0;
                    } ) );
            },

            //constructs the event object for each attack and defense
            //adds the object to the BattleManager data object
            message : function message( type, attacker, defender, wounds ){

                this.fightdata.push( {
                    "type"           : type,
                    "attacker"       : attacker,
                    "attackerName"   : attacker.name,
                    "attackerWounds" : attacker.wounds,
                    "defender"       : defender,
                    "defenderName"   : defender.name,
                    "defenderWounds" : defender.wounds,
                    "message"        : messenger.message( type, attacker, defender ),
                    "wounds"         : wounds || null
                } );
            }
        };

        return {
            narrativeBattle : function narrativeBattle( fighter1Stats, fighter2Stats ){

                var fighter1 = new Fighter( fighter1Stats ),
                    fighter2 = new Fighter( fighter2Stats );
                
                return BattleManager.battle( fighter1, fighter2 );
            },

            statBattle : function statBattle( fighter1Stats, fighter2Stats, count ){

                var sample,
                    returnObj = {
                        fighter1 : {
                            name : fighter1Stats.name,
                            wins : 0,
                            draws : 0
                        },
                        fighter2 : {
                            name : fighter2Stats.name,
                            wins : 0,
                            draws : 0
                        },
                        data : []
                    };

                for( var i = 0; i < count; i++ ){

                    sample = this.narrativeBattle( fighter1Stats, fighter2Stats );

                    if( sample.winner === "draw" ){

                        returnObj.fighter1.draws += 1;
                        returnObj.fighter2.draws += 1;
                    }
                    else{

                        returnObj[ sample.winner.name === returnObj.fighter1.name ? "fighter1" : "fighter2" ].wins += 1;
                    } 

                    returnObj.data.push( sample );
                }
                
                return returnObj;
            },

            addMessages : function( messages ){

                messenger.messages = messages;
                messenger.hasMessages = true;
            }
        };
    
} )( window, undefined );










