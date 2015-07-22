console.log("===Initilizing Profiler===");


module.exports = function(file){
    var file = file == true || file=="" ? "newrelic" : file;

    console.log("Loading: ", file);
    require("./"+file);
}


