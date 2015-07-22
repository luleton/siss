module.exports ={
	'_name':		'apiTest'
	,'_version':	'1.0.0'
	,'_type':		'api'
	,'_virtualdir':	'apiTest'
	,'_mongodb':	{
						connection: { 'connection':		'mongodb://mongo.aws/apiTest' }
						,collections: [] 
					}
	,'_transactions': false
	,'_enabled': true
	,'_doctorRequest': require('./doctor.js')
	,'_doctor': true
};

							
