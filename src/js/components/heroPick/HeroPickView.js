var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var utils = require('../utils/utils.js');
var cache = require('../cache/characterCache.js');
var MiniSearchView = require('../search/MiniSearchView.js');
var searchController = require('./searchController.js');
var dispatcher = require('../router/dispatcher.js');

var HeroPickView = Backbone.View.extend({

    className: 'hero-pick',

    tagName: 'div',

    events: {
        'click': 'onClick'
    },

    template: _.template(require('./HeroPickView.html')),

    onClick: function () {
        console.log('onclick works');
        //    We will listen for the 'pick' event now.  It is
        //  important to listen now and stop listening later, 
        //  because there is another view that uses the 
        //  same event.
        //    This event is triggered when the user picks
        //  a character to fight from the search results.
        // this.listenTo(dispatcher, 'pick', this.show);

        if ((searchController.holdOff() === false) && (this.withHero === false)) {
            searchController.disable();
            this.searchView = new MiniSearchView();
            this.searchView.render();
            $('.search-dock').addClass('active');
            $('.search-dock').append(this.searchView.$el);
            this.listenTo(this.searchView,'pick', this.show);
            $('input').focus();
        }


        // Pull up the search View

    },

    initialize: function (options) {
        console.log("options", options)
        this.$el.html(this.template());
        this.listenTo(this.model, 'sync', this.render);
        if (options) {
            this.withHero = true;
            console.log("with hero");
            console.log(this.model);
            this.$el.find('.picked > img').attr('src', (this.model.get('thumbnail')
                    + '.' + this.model.get('extension')));

        } else {
            this.withHero = false;
        }

    },


    render: function () {
           
        console.log('in the render function');
        console.log(this.model);
        this.show(this.model);       
    },
    getBarPercent: function (stat) {
        return parseInt(stat) * 14.3 + '%';
    },

    show: function (model) {

        $('.search-dock').removeClass('active');

        console.log("show inside the pick", model);
        // this.stopListening('pick');
        //  show the current character.
        //INCOMPLETE!!! Set the message here.
        // this.model = cache.getCharacter(heroId);
        this.stopListening('pick');
        
        if (model) {
            this.model = model;
            this.withHero = true;
            
            if (this.searchView) {
                this.searchView.remove();
            };
            
            // // the original:
            // this.$el.find('.picked > img').attr('src', (this.model.get('thumbnail')
            //         + '.' + this.model.get('extension'))); 


            this.$el.find('.name-of').html(this.model.get('name')); 


            this.$el.find('.picked').css({
            'background-image': "url('" + this.model.get('thumbnail') +
            '.' + this.model.get('extension') + "')" });

            $('.power_rating').removeClass('hidden'); 
            $('.power_rating').addClass('active');            

            var stats = utils.getStats(this.model.get('id'));
            var strength     = this.getBarPercent(stats.strength);
            var speed        = this.getBarPercent(stats.speed);
            var fighting     = this.getBarPercent(stats.fighting);
            var durability   = this.getBarPercent(stats.durability);
            var intelligence = this.getBarPercent(stats.intelligence);
            var energy       = this.getBarPercent(stats.energy);
            this.$el.find('.strength > div').css({'width': strength});
            this.$el.find('.speed > div').css({'width': speed});
            this.$el.find('.fighting > div').css({'width': fighting});
            this.$el.find('.durability > div').css({'width': durability});
            this.$el.find('.intelligence > div').css({'width': intelligence});
            this.$el.find('.energy > div').css({'width': energy});



        };

        searchController.enable();
     
    }

});

module.exports = HeroPickView;