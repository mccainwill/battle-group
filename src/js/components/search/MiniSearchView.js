var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var dispatcher = require('../router/dispatcher.js');
var searchForName = require('../utils/utils.js');
var cache = require('../cache/characterCache.js');
var utils = require('../utils/utils.js');



var HeroChildView = Backbone.View.extend({

    tagName: 'li',
    className: 'hero-item',

    events: {
        'click': 'onClick',
    },

    template: _.template(require('./battleSearchItem.html')),

    initialize: function (options) {
        this.searchView = options.searchView;
        this.listenTo(this.model, 'sync', this.render);                
    },

    onClick: function () {
        this.searchView.trigger('pick', this.model);
    },

    render: function () {
        this.$el.html(this.template(this.model));
    }

});

var MiniSearchView = Backbone.View.extend({


    template: _.template(require('./MiniSearchView.html')),
    

    events: {
        'click button': 'onClick',
        'keyup': 'onKeyUp'
    },

    remove: function () {
        this.children.forEach(function (child) {
            child.remove();  
        });
        Backbone.View.prototype.remove.call(this);           

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
        }
        
        $('.searchresults').addClass('active');

        var list = utils.searchForName($('.search-mini').val());
        list.forEach(function (current) {
            var currentModel = cache.getCharacter(current);
            if (count < 10) {
                _this.children[ count ] = new HeroChildView({model: currentModel, searchView: _this});
                $('.searchView').append(_this.children[count].$el);
                _this.children[count].render();
                count++;
            }
        });
    },

    initialize: function () {

        this.children = [];
    },

    render: function () {
        this.$el.html(this.template());
    }
});

module.exports = MiniSearchView;