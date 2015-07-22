module.export = function(view, options, cb){
    this.renders = {
        html: require('./html')
        ,hbs: require('./hbs')
    };

    this.render =  function(){

    };
}