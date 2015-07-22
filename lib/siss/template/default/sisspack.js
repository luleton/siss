module.exports ={
    '_name':		'packName'
    ,'_version':	'1.0.0'
    ,'_type':		'packType'
    ,'_virtualdir':	'/packName'
    ,'_enabled':    true
    ,'_mongodb':	{connection: {
        'connection':		'mongodb://mongo.aws/packName'
    }
        ,collections: ['logs']
    }
    ,'_transactions': false
    ,'_domains':['localhost','127.0.0.1']
    ,'_events':		{
        errors: '_errors_'
        ,info:'_info_'
        ,debug:'_debug_'
    },
    '_doctorRequest' : require("./doctor.js"),
    '_doctor': true
};
