/**
 * Created by Daniel on 11/06/2017.
 */

var getJSON = function(url, callback, dataType) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response, dataType);
        } else {
            callback(status);
        }
    };
    xhr.send();
};

function titleCase(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
function last(str){return str.substring(0, str.length - 1);}

var getData = function(get, callback){
    getJSON('http://www.clashapi.xyz/api/'+get, callback, get);
};


var getImg = function(x){
    x = encodeURI(x);
    return "http://www.clashapi.xyz/images/"+x+".png";
};






function ClashRoyale(elementId){
    this.elementId = elementId;
    this.dtypes = ["arenas", "cards", "chests", "leagues", "players"];
    this.stypes = ["splash", "loading", "menu"];
    this.mtypes = ["shop", "battle", "cards", "battle", "social", "tournaments"];

    this.extraAssets = ["level_star_overlay"];

    for(var i = 0; i < this.dtypes.length; i++){
        var dtype = this.dtypes[i];
        this[dtype] = [];
    }
}


ClashRoyale.prototype.assets = {};
ClashRoyale.prototype.Arena = function(arenaObj){
    this.arenaData = arenaObj;

    var arenaKeys = Object.keys(this.arenaData);

    for(var i = 0; i < arenaKeys.length; i++){
        var arenaKey = arenaKeys[i];
        this[arenaKey] = this.arenaData[arenaKey];
    }

    this.img = getImg("arenas/"+this.idName);

    delete this.arenaData;
};
ClashRoyale.prototype.Card = function(cardObj){
    this.cardData = cardObj;

    var cardKeys = Object.keys(this.cardData);

    for(var i = 0; i < cardKeys.length; i++){
        var cardKey = cardKeys[i];
        this[cardKey] = this.cardData[cardKey];
    }

    this.img = getImg("cards/"+this.idName);

    delete this.cardData;
};
ClashRoyale.prototype.Chest = function(chestObj){
    this.chestData = chestObj;

    var chestKeys = Object.keys(this.chestData);

    for(var i = 0; i < chestKeys.length; i++){
        var chestKey = chestKeys[i];
        this[chestKey] = this.chestData[chestKey];
    }

    var imgName = this.name.split(' ').join('-').toLowerCase();

    if(imgName!=="season-reward-chest"){
        this.img = getImg("chests/"+imgName);
    }
    delete this.chestData;
};
ClashRoyale.prototype.League = function(leagueObj){
    this.leagueData = leagueObj;

    var leagueKeys = Object.keys(this.leagueData);

    for(var i = 0; i < leagueKeys.length; i++){
        var leagueKey = leagueKeys[i];
        this[leagueKey] = this.leagueData[leagueKey];
    }

    this.img = getImg("leagues/"+this.idName);

    delete this.leagueData;
};
ClashRoyale.prototype.Player = function(playerObj){
    this.playerData = playerObj;

    var playerKeys = Object.keys(this.playerData);

    for(var i = 0; i < playerKeys.length; i++){
        var playerKey = playerKeys[i];
        this[playerKey] = this.playerData[playerKey];
    }

    //this.img = getImg("players/"+this.idName);

    delete this.playerData;
};
ClashRoyale.prototype.calculateArena = function(trophies){
    var suitables  = [];
    for (var i = 0; i < (this.arenas.length); i++) {
        var arena = this.arenas[i] || this.arenas[i-1];

        if(arena.minTrophies > trophies){
             suitables.push(this.arenas[i-1]);
        }

        if(trophies >= 3800){
            return this.arenas[11];
        }

    }

    return suitables[0];

};
ClashRoyale.prototype.calculateLeague = function(trophies){
    if(trophies < 3800){
        return false;
    }
    var suitables  = [];
    for (var i = 0; i < (this.leagues.length); i++) {
        var league = this.leagues[i] || this.leagues[i-1];

        if(league.minTrophies > trophies){
             suitables.push(this.leagues[i-1]);
        }

        if(trophies >= 6400){
            return this.leagues[9];
        }

    }

    return suitables[0];

};
ClashRoyale.prototype.calculateLevel = function(xp){

    for(var i = 0; i < this.players.length; i++){
        var player = this.players[i];

        if(player.maxExp > xp){
            return this.players[i+1];
        }

    }

};
ClashRoyale.prototype.frame__loading = function(frameTransparency, callback){
    var cr = this;
    tint(frameTransparency);
    image(cr.assets.loading, 0, 0);
    fill(255, frameTransparency);
    textSize(14);
    var loadedPercent = ceil(cr.loadedPercentage);
    var loadedPercentage =  loadedPercent + "%";
    textFont("ClashRoyale");
    text(loadedPercentage, (cr.canvas.width / 2) - 10, cr.canvas.height - 25);
    var loadedBarX = 2;
    var loadedBarY = 646;
    var loadedBarMaxW = 371;
    var loadedBarW  = map(loadedPercent, 0, 100, 0, loadedBarMaxW);
    var loadedBarH = 18;
    noStroke();
    fill(23, 111, 213, frameTransparency);
    rect(loadedBarX, loadedBarY, loadedBarW, loadedBarH);

    fill(124, 179, 243, frameTransparency);
    rect(loadedBarX, loadedBarY, loadedBarW, (loadedBarH / 7) * 3);

    if(loadedPercent===100){
        if(typeof callback==="function"){
            callback.bind(cr)();
        }
    }

    return cr;
};


ClashRoyale.prototype.frame__topStats = function(frameTransparency){
    var cr = this;
    var profile = cr.profile;

    textFont("ClashRoyale");
    var loadedBarX = 30;
    var loadedBarY = 8;
    var loadedBarMaxW = 92;
    var loadedBarW  = map(this.profile.xp, 0, this.profile.player.maxExp, 0, loadedBarMaxW);
    var loadedBarH = 20;
    noStroke();
    fill(14, 169, 255, frameTransparency);
    rect(loadedBarX, loadedBarY, loadedBarW, loadedBarH);

    fill(17, 243, 255, frameTransparency);
    rect(loadedBarX, loadedBarY, loadedBarW, (loadedBarH / 7) * 3);

    image(this.assets.level_star_overlay, 30, 8);
    fill(255, frameTransparency);





    //Level
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(profile.level, 23, 25);
    fill(255);
    textSize(12);
    text(profile.level, 23, 23);


    //XP
    fill(0);
    textSize(10);
    textAlign(CENTER);
    var xpText = this.profile.xp+"/"+this.profile.player.maxExp;
    text(xpText, 80, 25);
    fill(255);
    textSize(9);
    text(xpText, 80, 23);


    //Coins
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(profile.coins, 196, 26);
    fill(255);
    textSize(12);
    text(profile.coins, 196, 24);


    //Gems
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(profile.gems, 319, 26);
    fill(255);
    textSize(12);
    text(profile.gems, 319, 24);
};

ClashRoyale.prototype.frame__splash = function(frameTransparency){
    var cr = this;
    tint(frameTransparency);
    image(this.assets.splash, 0, 0);

    return cr;
};
ClashRoyale.prototype.frame__menu = function(frameTransparency, menuItemIndex){
    var cr = this;
    var menuItem = cr.mtypes[cr.mtypes.indexOf(menuItemIndex)];
    var profile = cr.profile;
    if(menuItem==="battle"){
        fill(255);
        textFont("ClashRoyale");


        tint(frameTransparency);
        image(this.assets.menu_battle, 0, 0);


        var arena_id = profile.arena["_id"];
        image(cr.assets[arena_id], 74, 126, 220, 256);

        if(cr.profile.league){
            var league_id = profile.league["_id"];
            image(cr.assets[league_id], 142, 174, 87, 105);
        }


        //Trophies
        fill(255,207,89);
        textSize(10);
        textAlign(CENTER);
        text(profile.trophies, 283, 66);


    }


    if(menuItem==="battle" || menuItem==="cards" || menuItem==="shop"){
        cr.frame__topStats(frameTransparency);
    }




    return cr;
};
ClashRoyale.prototype.frameTransparency = 255;
ClashRoyale.prototype.menuItem = "battle";
ClashRoyale.prototype.render = function(){
    var screen = this.stypes[this.screen];
    var frameTransparency = this.frameTransparency;
    clear();

    // if(screen!==this.oldScreen){
    //     console.log(this.oldScreen, screen);
    // }

    if(screen==="splash"){
        this.frame__splash(frameTransparency);
    }

    if(screen==="loading"){
        this.frame__loading(frameTransparency, function(){
            this.screen = 2;
        });
    }

    if(screen==="menu"){
        this.frame__menu(frameTransparency, this.menuItem);
    }

        this.oldScreen = screen;
};

ClashRoyale.prototype.touchMoved = function(){
        this.setProfile("trophies", floor(map(mouseX+mouseY, 0, width+height, 0, 10000)));
};

ClashRoyale.prototype.loadRestOfAssets = function(callback){
    var secondHalfAssets = [];
    for(var i = 0; i < cr.dtypes.length; i++){
        var assetBundle = cr[cr.dtypes[i]];
        for(var j = 0; j < assetBundle.length; j++){
            var len = assetBundle.length;
            var asset = assetBundle[j];
            if(asset.img){
                secondHalfAssets.push(asset);
            }
        }
    }
    var secondHalf = 0;
    for(var k = 0; k < secondHalfAssets.length; k++){
        var cur_asset = secondHalfAssets[k];
        cr.assets[cur_asset._id] = loadImage(cur_asset.img, function(){
            secondHalf++;
            cr.loadedPercentage = map(secondHalf, 0, secondHalfAssets.length, 50, 100);
            if(secondHalf===secondHalfAssets.length){
                if(typeof callback==="function"){
                    callback();
                }
            }
        }.bind(this));
    }
};
ClashRoyale.prototype.loadAssets = function(callback){
    var firstHalf = 0;
    var cr = this;
    var limit = (cr.stypes.length - 1) + cr.mtypes.length + (cr.extraAssets.length);
    for(var i = 0; i < cr.stypes.length; i++){
        var stype = cr.stypes[i];

        if(stype!=="menu"){
            cr.assets[stype] = loadImage("assets/"+stype+".png", function(){
                firstHalf++;
                if(firstHalf===limit){
                    if(typeof callback==="function"){
                        callback();
                    }
                }
            });
        }
    }
    for(var j = 0; j < cr.mtypes.length; j++){
        var mtype = cr.mtypes[j];

        cr.assets["menu_"+mtype] = loadImage("assets/"+mtype+".png", function(){
            firstHalf++;
            if(firstHalf===limit){
                if(typeof callback==="function"){
                    callback();
                }
            }
        });
    }
    for(var k = 0; k < cr.extraAssets.length; k++){
        var assetTo = cr.extraAssets[k];

        cr.assets[assetTo] = loadImage("assets/"+assetTo+".png", function(){
            firstHalf++;
            if(firstHalf===limit){
                if(typeof callback==="function"){
                    callback();
                }
            }
        });
    }
};
ClashRoyale.prototype.load = function(userId, password, callback){
    var cr = this;
    var cb = callback.bind(cr);

    var loaded = 0;
    cr.loadedPercentage = 0;

    window.setup = function() {
        cr.canvas = createCanvas(375, 667);
        cr.canvas.parent(cr.elementId);

        cr.loadAssets.bind(cr);

        cr.loadAssets(function(){
            setTimeout(function(){
                cr.screen = 1;
                for(var i = 0; i < cr.dtypes.length; i++){
                    var dataType = cr.dtypes[i];
                    getData(dataType, function(err, data, dataType) {
                        var objType = last(titleCase(dataType));
                        cr.loadedPercentage = map(loaded, 0, cr.dtypes.length - 1, 0, 50);

                        if (err !== null) {
                            console.log("couldn't load: "+dataType);
                            loaded++;
                            callit();
                        } else {
                            for(var j = 0; j < data.length; j++){
                                var itemObj = new ClashRoyale.prototype[objType](data[j]);
                                cr[dataType].push(itemObj);
                            }
                            loaded++;
                            callit();
                        }
                    });


                }
            }.bind(cr), 1000);
        });
    };
    cr.screen = 0;
    window.draw = cr.render.bind(cr);



    var value = 0;
    window.touchMoved = cr.touchMoved.bind(cr);

    var callit = function(){
        if(loaded===cr.dtypes.length && typeof cb==="function"){
            cr.profile = new cr.UserProfile();
            cr.profile.load(userId, password, function(){

                if(cr.profile.loaded){
                    cr.profile.update(cr);


                    cr.loadRestOfAssets(function(){
                        cb();
                    });
                } else{

                }

            });
        }
    };




};



ClashRoyale.prototype.get = function(path){
    path = path.toLowerCase();
    var p = path.split("/");
    var s = [
        {n:"elixir", fn: "sortCardsByElixir", t: "int"},
        {n:"arena",  fn: "sortCardsByArena",  t: "int"},
        {n:"rarity", fn: "sortCardsByRarity", t: "str"}
    ];
    var root = this[p[0]];
    if(root){
        if(p[0]==="cards"){


            for(var i = 0; i < s.length; i++){
                var v = s[i];
                if(p[1]===v.n){
                    var e = this[v.fn]();
                    if(e[p[2]]){
                        return e[p[2]];
                    } else{
                        return e;
                    }
                }
            }

        } else{
            if(typeof root==="function"){
                return root();
            } else{
                return root;
            }
        }
    }
};



ClashRoyale.prototype.getCardRarities = function(cards){
    var c = cards || this.cards;
    var rarities = {
        "common": {
            max_level: 13,
            count: 0
        },
        "rare": {
            max_level: 11,
            count: 0
        },
        "epic": {
            max_level: 8,
            count: 0
        },
        "legendary": {
            max_level: 5,
            count: 0
        }
    };


    for(var i = 0; i < c.length; i++){
        var r = c[i].rarity.toLowerCase();
        if(rarities[r]){
            rarities[r].order = Object.keys(rarities).indexOf(r);
            rarities[r].count++;
        } else{
            rarities[r] = {};
            rarities[r].count = 1;
        }
    }

    return rarities;
};
ClashRoyale.prototype.getArenaChests = function(arena){

};


ClashRoyale.prototype.sortCardsByRarity = function(cards){
    var c = cards || this.cards;
    var rarities = this.getCardRarities(c);

    for(var i = 0; i < c.length; i++){
        var r = c[i].rarity.toLowerCase();
        if(rarities[r].cards){
            rarities[r].cards.push(c[i]);
        } else{
            rarities[r].cards = [c[i]];
        }
    }

    return rarities;
};
ClashRoyale.prototype.sortCardsByArena = function(cards){
    var c = cards || this.cards;
    var arenas = {};

    for(var i = 0; i < c.length; i++){
        var a = c[i].arena;


        if(arenas[a]){
            arenas[a].count++;
        } else{
            arenas[a] = {};
            arenas[a].count = 1;
            arenas[a].order = a;
        }

        if(arenas[a].cards){
            arenas[a].cards.push(c[i]);
        } else{
            arenas[a].cards = [c[i]];
        }
    }

    return arenas;
};
ClashRoyale.prototype.sortCardsByElixir = function(cards){
    var c = cards || this.cards;
    var costs = {};

    for(var i = 0; i < c.length; i++){
        var e = c[i].elixirCost;


        if(costs[e]){
            costs[e].count++;
        } else{
            costs[e] = {};
            costs[e].count = 1;
            costs[e].order = e;
        }

        if(costs[e].cards){
            costs[e].cards.push(c[i]);
        } else{
            costs[e].cards = [c[i]];
        }
    }

    return costs;
};

ClashRoyale.prototype.UserProfile = function(){
    this.loaded = false;



    this.userId = false;
    this.displayName = "DanCell";

    this.xp = 2719;
    this.player = false;
    this.xpLeft = false;

    this.clan = 0;

    this.unlockedCards = [];
    this.unlockedCardCount = this.unlockedCards.length;


    this.chestSlots = [];
    this.trophies = 2271;
    this.arena = false;
    this.gems = 34;
    this.wins = 0;
    this.coins = 1000;
    this.level = 0;

    this.favCard = false;

};
ClashRoyale.prototype.UserProfile.prototype.update = function(cr){
    if(this.loaded===true){
        this.unlockedCardCount = this.unlockedCards.length;

        this.arena = cr.calculateArena(this.trophies);
        this.league = cr.calculateLeague(this.trophies);


        this.player = cr.calculateLevel(this.xp);
        this.level = this.player.level;
        this.xpLeft = this.player.maxExp-this.xp;
    } else{
        return false;
    }
};
ClashRoyale.prototype.UserProfile.prototype.load = function(userId, password, callback){
    this.userId = userId || false;


    if(password!=="daniel123"){
        var up = new ClashRoyale.prototype.UserProfile();
        var upk = Object.keys(up);

        for(var i = 0; i < upk.length; i++){
            var key = upk[i];
            delete this[key];
            this.loaded = false;
        }
        if(typeof callback==="function"){
            callback(this);
        }

    } else{


        this.loaded = true;
        if(typeof callback==="function"){
            callback(this);
        }
    }
};






ClashRoyale.prototype.setProfile = function(property, val){
    if(this.profile && this.profile[property]!==undefined){
        this.profile[property] = val;

        this.profile.update(this);
    }
    return this.profile;
};