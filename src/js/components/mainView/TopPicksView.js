var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var dispatcher = require('../router/dispatcher.js');
var cache = require('../cache/characterCache.js');
var utils = require('../utils/utils.js');

// This view, will generate the Top Picks sub view,
// it'll have 3 children views, which will be the last 3
// battles.  The models for these children views, will
// come from a collection, containing the battle results,
// initially, these three will be randomly generated:

var TopPicksView = Backbone.View.extend({

    className: 'topPicksView',

    template: _.template(require('./topPicks.html')),

    events: {
        'click .first-hero':'onFirstHeroClick',
        'click .second-hero':'onSecondHeroClick',
        'click .third-hero':'onThirdHeroClick',
        'click .fourth-hero':'onFourthHeroClick',
        'click .fifth-hero':'onFifthHeroClick',
        'click .sixth-hero':'onSixthHeroClick'
    },

    onFirstHeroClick: function () {
        window.location.hash = ('singleHero/' + this.model1.get('id'));
    },

    onSecondHeroClick: function () {
        window.location.hash = ('singleHero/' + this.model2.get('id'));
        
    },

    onThirdHeroClick: function () {
        window.location.hash = ('singleHero/' + this.model3.get('id'));
        
    },

    onFourthHeroClick: function () {
        window.location.hash = ('singleHero/' + this.model4.get('id'));
        
    }, 
    onFifthHeroClick: function () {
        window.location.hash = ('singleHero/' + this.model5.get('id'));
        
    },
    onSixthHeroClick: function () {
        window.location.hash = ('singleHero/' + this.model6.get('id'));
        
    },        

    initialize: function (options) {

        var _this = this;

        this.$el.html(this.template());

        $.ajax({
            url:'/api/topPicks',
            data:{limit:6},
            method:'GET',
            success: processResult
        });

        function processResult(data) {
            console.log("in top picks init.");
            console.log(data);
            console.log(data[0].id);

            _this.model1 = cache.getCharacter( utils.searchForId(data[0].id));
            _this.model2 = cache.getCharacter( utils.searchForId(data[1].id));
            _this.model3 = cache.getCharacter( utils.searchForId(data[2].id));
            _this.model4 = cache.getCharacter( utils.searchForId(data[3].id));
            _this.model5 = cache.getCharacter( utils.searchForId(data[4].id));
            _this.model6 = cache.getCharacter( utils.searchForId(data[5].id));

            _this.listenTo(_this.model1,'sync', _this.show);
            _this.listenTo(_this.model2,'sync', _this.show);
            _this.listenTo(_this.model3,'sync', _this.show);
            _this.listenTo(_this.model4,'sync', _this.show);
            _this.listenTo(_this.model5,'sync', _this.show);
            _this.listenTo(_this.model6,'sync', _this.show);

            _this.show();
        }

    },

    show: function () {
            this.$el.find('.first-hero img').attr('src',
                (this.model1.get('thumbnail')
                + '/landscape_amazing'   
                + '.' + this.model1.get('extension')));

            this.$el.find('.second-hero img').attr('src',
                (this.model2.get('thumbnail')
                + '/landscape_amazing'   
                + '.' + this.model2.get('extension')));    

            this.$el.find('.third-hero img').attr('src',
                (this.model3.get('thumbnail')
                + '/landscape_amazing'   
                + '.' + this.model3.get('extension')));

            this.$el.find('.fourth-hero img').attr('src',
                (this.model4.get('thumbnail')
                + '/landscape_amazing'   
                + '.' + this.model4.get('extension')));

            this.$el.find('.fifth-hero img').attr('src',
                (this.model5.get('thumbnail')
                + '/landscape_amazing'   
                + '.' + this.model5.get('extension')));

            this.$el.find('.sixth-hero img').attr('src',
                (this.model6.get('thumbnail')
                + '/landscape_amazing'   
                + '.' + this.model6.get('extension')));


            this.$el.find('.first-hero p').html(this.model1.get('name'));
            this.$el.find('.second-hero p').html(this.model2.get('name'));
            this.$el.find('.third-hero p').html(this.model3.get('name'));
            this.$el.find('.fourth-hero p').html(this.model4.get('name'));
            this.$el.find('.fifth-hero p').html(this.model5.get('name'));
            this.$el.find('.sixth-hero p').html(this.model6.get('name'));


    },


    render: function () {
    }
});

module.exports = TopPicksView;