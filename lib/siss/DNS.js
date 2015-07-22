
/**
 * DNS Library use dns library from Node.js in order to resolve sereval types of requests
 * @namespace DNS
 * 
 */
module.exports = {
    dns :require("dns")
    ,errors:{
    'NODATA':                   'DNS server returned answer with no data.'
    ,'FORMERR':                 'DNS server claims query was misformatted.'
    ,'SERVFAIL':                'DNS server returned general failure.'
    ,'NOTFOUND':                'Domain name not found.'
    ,'NOTIMP':                  'DNS server does not implement requested operation.'
    ,'REFUSED':                 'DNS server refused query.'
    ,'BADQUERY':                'Misformatted DNS query.'
    ,'BADNAME':                 'Misformatted domain name.'
    ,'BADFAMILY':               'Unsupported address family.'
    ,'BADRESP':                 'Misformatted DNS reply.'
    ,'CONNREFUSED':             'Could not contact DNS servers.'
    ,'TIMEOUT':                 'Timeout while contacting DNS servers.'
    ,'EOF':                     'End of file.'
    ,'FILE':                    'Error reading file.'
    ,'NOMEM':                   'Out of memory.'
    ,'DESTRUCTION':             'Channel is being destroyed.'
    ,'BADSTR':                  'Misformatted string.'
    ,'BADFLAGS':                'Illegal flags specified.'
    ,'NONAME':                  'Given hostname is not numeric.'
    ,'BADHINTS':                'Illegal hints flags specified.'
    ,'NOTINITIALIZED':          'c-ares library initialization not yet performed.'
    ,'LOADIPHLPAPI':            'Error loading iphlpapi.dll.'
    ,'ADDRGETNETWORKPARAMS':    'Could not find GetNetworkParams function.'
    ,'CANCELLED':               'DNS query cancelled.'
    ,'ENOTFOUND':               'Host not found'
    ,'null':                    null
    }
	
	/**
	 * resolve sereval types of requests (ipv6,ipv4...)
	 * @memberOf DNS
	 * @method resolve
	 * @param params
	 * @param params.type dns call type
	 * @param params.host hostname or IP
	 */
    ,resolve: function(params, callback ){
        var type = params.type || 'resolve';
        var host = params.host || 'localhost';
        var callback = callback || function(err, i){};

        var map = {
                'resolve':  this.dns.resolve
                ,'4':       this.dns.resolve4
                ,'6':       this.dns.resolve6
                ,'mx':      this.dns.resolveMx
                ,'txt':     this.dns.resolveTxt
                ,'srv':     this.dns.resolveSrv
                ,'ns':      this.dns.resolveNs
                ,'cname':   this.dns.resolveCname
                ,'reverse':  this.dns.reverse
                };

        if(type in map) map[type](params.host, callback);
        else return null;
    }
};