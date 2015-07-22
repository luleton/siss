module.exports ={
	'_name':		'packName'
	,'_version':	'1.0.0'
	,'_type':		'cron'
					//1 día
	,'_timer':		60*60*24
	,'_virtualdir':	'__'
	,'_mongodb':	{
						connection: { 'connection':		'mongodb://mongo.aws/test' }
						,collections: [] 
					}
	,'_transactions': false
	,'_enabled': true
	,'_doctorRequest': require('./doctor.js')
	,'_doctor': true
};

							
