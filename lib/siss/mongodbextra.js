module.exports = function(){


    return{

        '_existCollection': function(collection){
            return typeof this.mongodb[collection]==="undefined" ? false : true;
        },
        '$chechModel': function(model, data){
            var $return={$set:{}};
            var $complete  = true;
            for(var k in model){
                   if(typeof data[k]!=="undefined"){
                        $return.$set[k] = data[k];
                   }else{
                       $complete = false;
                   }//end else
            }  //end for


            if($complete===true) {
                return $return;
            }else{
                return false;
            }
        },
        'saveModel': function(collection, schema, obj, cb){
            var save = true;
            var data = {};
            var _this = this;

            if(this._existCollection(collection)===false){
                cb({code: 0, error: "Bad collection name"},null);
            }else{

                for(var k in schema){
                    if(typeof obj[k] === "undefined") { save = false; }
                    else{
                        data[k] = obj[k];
                    }
                }//end for

                if(save) {
                    _this.mongodb[collection].save(data, function(err, docs){
                        cb(err, docs);
                    });
                }//end save
                else{
                    cb({code: 1, error: "Bad Schema"},null);
                }//end else
            }//end else
        },//end saveModel


        updateModel: function(collection, schema, obj,where, cb){
            var _this = this;
            var update  = _this.$chechModel(schema, obj);

            if(update===false){
                cb({error: "bad schema"}, []);
            }else{
                console.log(update);
                this.mongodb[collection].update(where, update, {multi:true}, cb);
            }//end else
        }
    };//end return
};