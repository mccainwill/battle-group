var $ = require('jquery');
var Backbone = require('backbone');

var SingleHeroModel = Backbone.Model.extend({

    defaults: {
        thumbnail: "default for thumbnail",
        name: 'default for name'
    },

    initialize: function () {
        this.url = function () {
            
            var marvelKey = 'apikey=fedd59d6507d8fd892bb0a51b80b65ab';

            //var marvelKey = 'apikey=41f7d8754906d29d9b0dd03e19b6138a';

            return 'http://gateway.marvel.com/v1/public/characters/'
                 + this.id
                 + '?'
                 + marvelKey;


        };   
    },

    parse: function (obj) {
        var resultData = {
            name: obj.data.results[0].name,
            thumbnail: obj.data.results[0].thumbnail.path,
            extension: obj.data.results[0].thumbnail.extension,
            description: obj.data.results[0].description
        };

        if (resultData.description === '') {
            resultData.description = 'Description Not Available';
        }
        return resultData;
    }
});

module.exports = SingleHeroModel;