module.exports = function(mws){

    return {
        'get': [mws.get]
        ,'post': [mws.post]
        ,'put': [mws.put]
        ,'delete': [mws.delete]
    }
};