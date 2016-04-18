//all messages must follow this format
//you may add additional messages to each array, but don't break the format
//in each array the '0' is the attacker, and '1', is the defender
//feel free to fix typos and such

var messages = {
    round : {
        full : [
            [ "The two combatants stumble back, weary from battle. ", 0, " crouches in anticipation for the next attack. ", 1, " takes a fighting stance." ],
            [ "Both fighters step back, breathing heavily. 'You can't win', says ", 0, ". 'We'll see about that', replies ", 1, " through gritted teeth."  ]
        ],
        partial : [
            [ 1, " tumbles to the ground, unconscious and defeated. ", 0, " raises a fist to the sky, crying, 'Victory is mine!' ", 0, " wins!" ],
            [ "After the final blow, ", 0, " is weary, but standing. ", 1, " lies unmoving and defeated. ", 0, " wins!" ],
            [ "'No more...' says ", 1, "'You win.' ", 0, " gazes down at ", 1, ", pitiless and victorious. ", 0, " wins!" ],
            [ "As the dust settles around both combatants, ", 0, " kneels. The day is won and ", 1, " is finally defeated. ", 0, " wins!" ],
            [ 0, " throws ", 1, "'s limp body into the street, where it tumbles to a stop in the gutter. 'You asked for this...' ", 0, " says. ", 1, " groans in pain. ", 0, " wins!" ]
        ],
        draw : [
            [ "The combatants stare across the broken and devistated landscape. They have found to a standstill. 'This isn't over', says ", 0, ". ", 1, " nods and turns away, teeth gritted in frustration. 'I'll get you next time.' The fight is a draw!"  ],
            [ "Damaged and beaten, ", 0, " and ", 1, " have fought until neither combatant can continue. The fight is a draw!" ],
            [ "Neither fighter thought that the fight would last this long. ", 0, " glares across the battlefield at ", 1, ". 'I've finally met my match' ", 0, " says. The fight is a draw!" ]
        ]
    },
    shoot : {
        failed : {
            hit : [
                [ 0, " peels off an attack from a distance, narrowly missing ", 1 ],
                [ "Off balance, ", 0, "attacks at range, missing ", 1, "as the fighter stumbles over debree." ],
                [ "Jumpy with anticipation, ", 0, " fires from a distance, narrowly missing ", 1 ],
                [ 0, " slips on the uneven terrain, shooting wide and missing ", 1 ],
                [ "The sun is in ", 0, "'s eyes. Squinting in the light, ", 0, " fires. Missing ", 1, " by a wide margin." ]
            ],
            blocked : [
                [ 0, " launches a devistating blow, but ", 1, " deftly parries it." ],
                [ "Though, ", 0, " lands the ranged attack, ", 1, " withstands it and dives away, taking no damage." ],
                [ 1, " moves like a viper, dodging ", 0, "'s powerful ranged attack" ],
                [ "Shielded by the fallen debris of a nearby, demolished building, ", 1, " blocks ", 0, "'s attack." ],
                [ 1, " dives to the ground, ducking", 0, "'s attack and rolling to safety" ]
            ]
        },
        success : [
            [ 0, " launches a devistating salvo of attacks against ", 1 ],
            [ "Suddenly, ", 0, " blasts a long range attack, catching ", 1, " off balance and knocking the fighter back." ],
            [ "Faster than ", 1, " can react, ", 0, " fires a ranged attack that cannot be dodged." ],
            [ 1, " is knocked back by force of ", 0, "'s attack, stumbling to the ground." ],
            [ "Unable to evade ", 0, "'s attack, ", 1, " tries to block the blow, but the force is too great to withstand." ]
        ]
    },
    assault : {
        failed : {
            hit : [
                [ "Lunging forward ", 0, " strikes at ", 1, " but swings wide, missing ", 1, " by a mile." ],
                [ "Enraged and desperate, ", 0, " lashes out at random.", 1, " dodges it easily." ],
                [ "Furious and fumbling", 0, " dives in to assault ", 1, " clumsily missing." ],
                [ 0, " stumbles while charging forward. Thrown off balance, ", 0, " is unable to land a blow to, ", 1, "." ],
                [ 0, " assaults repeatedly in close range, but", 1, " dodges it all." ]
            ],
            blocked : [
                [ "As ", 0, " steps forward to assault, ", 1, " steps forward to block, anticipating the attack and stopping it before its begun." ],
                [ 0, " charges in, but the blow landed is blocked, by ", 1, "." ],
                [ 0, "'s blows lack the force to damage ", 1, ". ", 1, " parries them easily with one hand." ],
                [ 1, " stands firm, blocking all attacks by", 0, ". " ],
                [ 0, " Sees ", 1, "'s blow coming just in time to block it and dodge away." ]
            ]
        },
        success : [
            [ 0, " lunges forward and lashes out at close range. Caught off guard, ", 1, " stumbles as the blow lands." ],
            [ "Dodging into close range, ", 0, "lands a blow, knocking ", 1, " to the ground." ],
            [ 0, " smashes into ", 1 ],
            [ 0, " delivers a crushing punch to ", 1, "'s jaw." ],
            [ 0, "Rips a manhole cover from the road, swinging it wildly and smashing it into", 1, "'s face." ]
        ]
    }
};