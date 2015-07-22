module.exports = function(){

    var _this = this;
    this.mailLib = require('nodemailer');
    this.transporter = _this.mailLib.createTransport() ;


    this.localFrom = SISSCore.conf.Mail.from || '"SISS Server" <siss@domain.com>';
    this.localTo = SISSCore.conf.Mail.to || '"Developer" <sissdev@domain.com>';


    this.send = function(params, callback){

        var params = {

            from: params.from || _this.localFrom
            ,to: params.to || _this.localTo
            ,subject: params.subject || 'SISS Server Mail'
            ,headers: {
                'X-Laziness-level': 1000
            }
            ,text: params.text || 'SISS Server say:'

        };

        _this.transporter.sendMail(params, callback);
    };

};