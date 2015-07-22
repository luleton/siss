module.exports ={
    '_name':		'webPack'
    ,'_version':	'1.0.0'
    ,'_type':		'web'
    ,'_virtualdir':	'webPack'
    ,'_enabled':    true
    ,'_mongodb':	{connection: {
        'connection':		'mongodb://mongo.aws/webPack'
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
    '_doctor': false
};
