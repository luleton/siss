var mws = module.exports = {
    __init__: function(){
        var _this = this;
        mws.myLib = _this.load('index', _this.Me);

    }
    ,'post':function(req, res, next){
        mws.json({packName: 'Test SISS'}, res);
    }

    ,'get':function(req, res, next){
        mws.json({packName: 'Test SISS'}, res);
    }
    ,'put':function(req, res, next){
        mws.json({packName: 'Test SISS'}, res);
    }
    ,'delete':function(req, res, next){
        mws.json({packName: 'Test SISS'}, res);
    }

};