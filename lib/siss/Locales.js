module.exports = (function(){
    console.log("Locales implemented!");

        return {
            'construct': function(){
                console.log("Constructor de una lib por medio de implement!!!!")
                console.log(this);
            }
            ,'$_getLanguages': function(res, html, view){
                var _this = this;
                var req = res.req;
                var localLanguage  = "en";

                html = html.toString();

                if(_this.$languageCookie && req.session && req.session[_this.$languageCookie]){
                    localLanguage = req.session[_this.$languageCookie];
                }else{
                    localLanguage = _this.$_getLanguageFromHeaders(req)[0];
                }


                res.send(_this.$_transformText(html, localLanguage, view));
                return html;
            }
            ,'$_POFILES': {}
            ,'$_POOBJECTTEXT': {}
            ,'$_VIEWSKEYSTOREPLACE': {}
            ,'$_transformText': function(txt, lang, view){
                var _this = this;
                $dataReplace  = _this.$_openPOFile(lang);

                $dataObjectReplace = {};
                var currentKey = null;
                var lines = $dataReplace.split("\n");
                var invalidsHead = ["#","\n",""];


                if(typeof _this.$_POOBJECTTEXT[lang]=="undefined"){
                    for(var x=0; x<lines.length; x++){
                        var line  = lines[x].trim();

                        if(invalidsHead.indexOf(line)==-1){
                            var parts = line.split(" ");

                            if(parts[0].trim().toLowerCase()=="msgid") {
                                currentKey = line.toLowerCase().replace("msgid", "").trim();
                                $dataObjectReplace[currentKey] = "";
                            }//end change key
                            else{
                                if(line.toLowerCase().indexOf("msgstr")==0){
                                    line = line.substr(7);
                                }//end if
                                $dataObjectReplace[currentKey]+= line;
                            }//end else


                        }//end if

                    }//end for
                    _this.$_POOBJECTTEXT[lang] = $dataObjectReplace;
                }//end in POOBJECTTEXT

                if(typeof _this.$_VIEWSKEYSTOREPLACE[view]=="undefined") {
                    _this.$_VIEWSKEYSTOREPLACE[view] = [];
                    var result = txt.match(/_\(\"(.*?)\"\)\;/g);

                    if (SISSCore.Caronte.Object.isArray(result)) {

                        for (var x = 0; x < result.length; x++) {
                            var val = result[x].trim();
                            val = val.replace('_("', '');
                            val = val.replace('");', '');

                            _this.$_VIEWSKEYSTOREPLACE[view].push(val);

                        }//end for


                        //save keys for view

                    }//if array


                }//no view cached keys

                for(var x=0; x<_this.$_VIEWSKEYSTOREPLACE[view].length; x++){
                    var k = _this.$_VIEWSKEYSTOREPLACE[view][x];
                    var o = _this.$_POOBJECTTEXT[lang][k.toLowerCase()] || k;
                    txt = txt.replace('_("'+k+'");', o);
                }//end for ninja final++


                return txt;

            }
            ,'$_openPOFile': function(lang){
                var _this = this;

                if(lang in _this.$_POFILES) {
                    return _this.$_POFILES[lang];
                }

                var fpath = _this.Me.path.locales+"/languages/"+lang+".po";
                if(SISSCore.Caronte.fs.existsSync(fpath)){
                    return _this.$_POFILES[lang] = SISSCore.Caronte.fs.readSync(fpath)
                }
                else return "";
            }
            ,'$_getLanguageFromHeaders' : function(req){
                var Rlanguages = req.headers['accept-language'] || "NONE";
                var lparts = Rlanguages.split(";");
                var languages = [];

                for(var x=0; x<lparts.length; x++){
                    languages.push(lparts[x].split(",").pop());
                }//end for

                return Rlanguages.length == 0 ? ['en'] : languages;
            }
            ,'_': function(s){
                console.log("Traduciendo pa los pibes el json: ", s);
                return s;
            }
        };
})();


