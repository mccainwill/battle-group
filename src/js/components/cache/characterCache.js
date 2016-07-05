var SingleHeroModel = require('../singleHero/SingleHeroModel.js');

//  This is a file storage Utility only good for a single URL, 
//  but it works like saving to a file.  Will work across 
//  Laptop reboots, closing out of the browser, etc.

//  This may be implemented for any model, however now it's
//  hardcoded to use SingleHeroModel().

//  It is model-based (it stores models).

//  Anytime you wish to use the cache call getCharacter().
//  This function will return a model.  If the data is cached,
//  it will return the data from the cache.  If there is not
//  a pre-existing cached model, it will create an instance of 
//  the model and fetch from the API.

//  'cache' is the data Storage memory(an array of characters).

var cache = window.localStorage.characterCache
//  localStorage is a builtIn property on all browsers.  It can
//  only store strings, not objects.  JSON.parse is called to
//  turn this string into a JSON object that we can use.
    ? JSON.parse(window.localStorage.characterCache)
    : {};


//  Get a single character from the cache.
function get (id) {
    if (cache[id]) {
        return cache[id];
    }

    return false;
}

//  Save a character to the cache.
function set (id, model) {
    cache[id] = model.toJSON();
    window.localStorage.characterCache = JSON.stringify(cache);
}


//  This is the External function that the application code uses.
function getCharacter (heroData) {


    //  It will get a character from the cache and create a new 
    //  model.
    var cached = get(heroData.id);
    var model = new SingleHeroModel(heroData);

    if (!cached) {

        //  If the character wasn't in the cache, it will 
        //  fetch from the API and set it in the cache.
        model.fetch({
            success: function () {
                //set(heroData.id, model);
            }
        });
    } else {
        //  It was a cached character, return the model.
        model = new SingleHeroModel(cached);
    }

    return model;
}

module.exports = {

    get: get,

    set: set,

    getCharacter: getCharacter

};