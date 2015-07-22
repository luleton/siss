var hbs = module.exports = require('hbs');
var path = require('path');
var _ = require('underscore');

hbs.registerHelper('uc', function (str) {
    return encodeURIComponent(str);
});

hbs.registerHelper('compile', function(source,context){
    context = context || {}
    var compiled = hbs.compile(source,context);
    return new hbs.SafeString(compiled);
});

hbs.registerHelper('include', function (name, opts,path) {
	var _this = this;

	_this.viewsPath = _this.viewsPath || __dirname+'/views/includes';

    var fs = require('fs');
    hbs.templates = hbs.templates || {};
    hbs.templates[name] = hbs.templates[name] || hbs.compile(fs.readFileSync(_this.viewsPath+ '/' + name + '.' + "hbs", 'UTF-8'));
    return new hbs.SafeString(hbs.templates[name](_.defaults(opts.hash, this)));
});

/**
 * @author Oscar López
 * {{#template 'package' 'template' 'templateName' contextObj}}{{/template}}
 * {{#template 'guiahoteles' 'views/includes' 'header'}}{{/template}}
 */
hbs.registerHelper('template', function (pkg,templatePath,name, opts) {
    var _this = this;

    //Go to SISS root folder
    var sissDir = path.normalize(__dirname+'/..');

    //templates folder
    var siss = sissDir+'/packages/'+pkg+'/'+templatePath;

    _this.viewsPath =  siss;

    var fs = require('fs');
    hbs.templates = hbs.templates || {};
    hbs.templates[name] = hbs.templates[name] || hbs.compile(fs.readFileSync(_this.viewsPath+ '/' + name + '.' + 'hbs', 'UTF-8'));

    for(var prop in opts){
        this[prop] = opts[prop];
    }

    //return new hbs.SafeString(hbs.templates[name](_.defaults(opts.hash, this)));
    return  hbs.templates[name](_.defaults(opts.hash, this));
});

hbs.registerHelper("cleanDesc",function(cardDesc){

        if(cardDesc.indexOf('Tarjeta') == 0) {
            cardDesc = cardDesc.split('Tarjeta').pop();
        }

        if(cardDesc.indexOf('de la') > -1){
            cardDesc = cardDesc.split('de la').pop();
        }
        if(cardDesc.indexOf('del') > -1){
            cardDesc = cardDesc.split('del').pop();
        }
        if(cardDesc.indexOf('Bancos') < 0){
            cardDesc = cardDesc.split('Banco').pop();
        }

        if(cardDesc.indexOf('MasterCard') > -1){
            cardDesc = cardDesc.split('MasterCard').pop();
        }
        if(cardDesc.indexOf(' Mastercard') > -1) {
            cardDesc = cardDesc.split(' Mastercard').shift();
        }
        if(cardDesc.indexOf('Visa') > -1) {
            cardDesc = cardDesc.split('Visa').pop();
        }

        if(cardDesc.indexOf(' de ') > -1){
            cardDesc = cardDesc.split('de').pop();
        }

        return cardDesc;
});

hbs.registerHelper("cardClass",function(cardCode,bankCode){
    if(bankCode == "*"){
        return cardCode;
    }else{
        return cardCode+"-"+bankCode;
    }
});

hbs.registerHelper('concat', function (a,b,c) {
    result = '';
    return result + (a||'') + (b||'') + (c||'');
});

hbs.registerHelper('stringify', function (val) {
    return JSON.stringify(val);
});

hbs.registerHelper('dateFormat', function (val, format) {
    return moment(val).format(format);
});


hbs.registerHelper('displayError', function (key) {
    var len;
    if (_.isArray(key)){
        len = key[1];
        key = key[0];
    }
    var errors = {
        bool: 'Este campo debe ser un valor booleano',
        cuit: 'Este campo debe ser un CUIT válido',
        date: 'Este campo debe ser una fecha válida',
        dni: 'Este campo debe ser un número de no más de <strong>8</strong> caracteres',
        email: 'Este campo debe ser un email válido',
        empty: 'Este campo no puede ser vacío',
        number: 'Este campo debe ser un número',
        min: 'Este campo debe tener por lo menos <strong>' + len + '</strong> caracteres',
        'min-number': 'Este número debe ser mayor o igual a ' + len,
        'max-number': 'Este número debe ser menor o igual a ' + len,
        max: 'Este campo no debe tener más de <strong>' + len + '</strong> caracteres',
        another: 'Este campo debe ser un/a ' + key + ' válido/a'
    };
    return new hbs.SafeString(errors[key] || errors.another);
});



hbs.registerHelper('default', function (value, defaultValue) {
    return value || defaultValue;
});
hbs.registerHelper('yesno', function (val) {
    return val ? 'yes' : 'no';
});

hbs.registerHelper('setVar', function (key, context, varName) {
    this[varName] = context && context[key];
});

hbs.registerHelper('ifAnd', function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var options = args.pop();
    var cond = true;
    for (var i = args.length - 1; i >= 0; i--) {
        cond = cond && args[i];
    }
    return cond ? options.fn(this) : options.inverse(this);
});

// Comparison Helper for handlebars.js
// Pass in two values that you want and specify what the operator should be
// e.g. {{#compare val1 val2 operator="=="}}{{/compare}}
hbs.registerHelper('compare', function(lvalue, rvalue, options) {
	//console.log('comparando: ', lvalue, ' con: ', rvalue);
    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    operator = options.hash.operator || "==";
    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; },
        'isUndefined':   function(l,r) { return typeof l !== 'undefined'; }
    };
    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
    var result = operators[operator](lvalue,rvalue);
    if(result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('ifInArray', function (val, array, options) {
    return (array || []).indexOf(val) !== -1 ? options.fn() : options.inverse();
});

hbs.registerHelper('hasElements',function(array,options){
    if(typeof array !== "undefined" && array.length > 0) {
        return options.fn(this);
    }else {
        return options.inverse(this);
    }
});

/*
    Handlebars "join" block helper that supports arrays of objects or strings.
    (implementation found here: https://github.com/wycats/handlebars.js/issues/133)

    If "delimiter" is not speficified, then it defaults to ",".
    You can use "start", and "end" to do a "slice" of the array.

    Use with objects:
    {{#join people delimiter=" and "}}{{name}}, {{age}}{{/join}}

    Use with arrays:
    {{join jobs delimiter=", " start="1" end="2"}}
*/
hbs.registerHelper('join', function(items, block) {
    var delimiter = block.hash.delimiter || ",",
        start = block.hash.start || 0,
        len = items ? items.length : 0,
        end = block.hash.end || len,
        out = "";

        if(end > len) end = len;

    if ('function' === typeof block) {
        for (i = start; i < end; i++) {
            if (i > start) out += delimiter;
            if('string' === typeof items[i])
                out += items[i];
            else
                out += block(items[i]);
        }
        return out;
    } else {
        return [].concat(items).slice(start, end).join(delimiter);
    }
});


hbs.registerHelper('loop', function(count, options) {
    var out = "";

    while (count--) {
        out+= options.fn();
    }

    return out;
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('ifCondSoft', function(v1, v2, options) {
    if(v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('ifCondObject', function(v1, v2, options) {
	v1=v1.toString();
	v2=v2.toString();

    if(v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('lte', function(v1, v2, options) {
    if(v1 <= v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
hbs.registerHelper('lt', function(v1, v2, options) {
    if(v1 < v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('gte', function(v1, v2, options) {
    if(v1 >= v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
hbs.registerHelper('gt', function(v1, v2, options) {
    if(v1 > v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('diff', function(v1,v2,options){
    var result = v1-v2;
    this.result = result;
    return options.fn(this);
});

hbs.registerHelper('rd2', function(num){
    return +(Math.round(num + "e+2")  + "e-2");
});




