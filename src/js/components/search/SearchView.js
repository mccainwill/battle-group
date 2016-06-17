var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var utils = require('../utils/utils.js');
var SingleHeroModel = require('../singleHero/SingleHeroModel.js');
var SearchItemView = require('../search/SearchItemView.js');
var cache = require('../cache/characterCache.js');

var SearchView = Backbone.View.extend({

    className: 'wrapper',

    template: _.template(require('./SearchView.html')),
   
    events: {
        'click button': 'onClick',
        'keyup'     : 'onKeyUp',
        'click .first-hero':'onFirstHeroClick',
        'click .second-hero':'onSecondHeroClick',
        'click .third-hero':'onThirdHeroClick'
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
    onKeyUp: function (e) {
        console.log('keyup event in SearchView');
        if (e.which === 13) {

            this.onClick();
        };
    },

    onClick: function () {
        var count = 0;
        var _this = this;

        for (var i = 0; i < _this.children.length; i++) {

            this.children[i].remove();
        };

        $('.searchresults').attr('id', 'active');
        
        var list = utils.searchForName($('input').val());

        list.forEach(function (current) {
            var currentModel = cache.getCharacter(current);
            if (count < 10) {
                _this.children[ count ] = new SearchItemView({model:currentModel});
                $('.searchView').append(_this.children[count].$el);
                _this.children[count].render();
                count++;
            }
        });
    },

    initialize: function () {
        this.children = [];
        var _this = this;

        $.ajax({
            url:'/api/topPicks',
            data:{limit:5},
            method:'GET',
            success: processResult
        });

        function processResult(data) {

            _this.model1 = cache.getCharacter( utils.searchForId(data[0].id));
            _this.model2 = cache.getCharacter( utils.searchForId(data[1].id));
            _this.model3 = cache.getCharacter( utils.searchForId(data[2].id));

            _this.listenTo(_this.model1,'sync', _this.show);
            _this.listenTo(_this.model2,'sync', _this.show);
            _this.listenTo(_this.model3,'sync', _this.show);

            _this.show();   
        };        
    },

    show: function () {
            this.$el.find('.first-hero img').attr('src',
                (this.model1.get('thumbnail')
                + '/portrait_uncanny'   
                + '.' + this.model1.get('extension')));

            this.$el.find('.second-hero img').attr('src',
                (this.model2.get('thumbnail')
                + '/portrait_uncanny'   
                + '.' + this.model2.get('extension')));    

            this.$el.find('.third-hero img').attr('src',
                (this.model3.get('thumbnail')
                + '/portrait_uncanny'   
                + '.' + this.model3.get('extension')));

            this.$el.find('.first-hero h2').html(this.model1.get('name'));
            this.$el.find('.second-hero h2').html(this.model2.get('name'));
            this.$el.find('.third-hero h2').html(this.model3.get('name'));

    },


    render: function () {
        this.$el.html(this.template());
    }

 
});

module.exports = SearchView;