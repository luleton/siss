
var mws = module.exports = {
    __init__: function(){
        var _this = this;
        mws.myLib = _this.load('index', _this.Me);

    }
    ,'get':function(req, res, next){
        var opts = {"layout":false,packName:'webPack'};
        mws.render(mws.Me.path.view+"/index.hbs",opts,res);
    }

};
