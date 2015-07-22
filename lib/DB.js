/**
 * db run query with pagination 
 * this exports db object
 * @namespace db
 * @since 1.2
 * @return {Object} db
 */
module.exports = function(){
    /**
     * Run a query with pagination
     *
     * @memberOf db
     * @method pageQuery
     * @param  {string}   sql          select SQL
     * @param  {Object}   params       query params
     * @param  {number}   $rowsPerPage rows per page
     * @param  {number}   $actualPage  current page
     * @param  {Function} callback     function to run after to get rowset
     */
    this.pageQuery = function(sql, params, $rowsPerPage, $actualPage, callback){
        var $actualPage = $actualPage || 1;
        var $rowsPerPage = $rowsPerPage || 30;
        var $recStart = $actualPage * $rowsPerPage - $rowsPerPage;
        var params = params || [];
        var $recEnd = $rowsPerPage;


        sql = sql.replace(/^\s*SELECT(.*?)/i, "SELECT SQL_CALC_FOUND_ROWS $1");
        sql += " LIMIT "+$recStart+", "+$recEnd+"";

        db.query(sql, params, function(err, docs){
            if(err){ console.log('MySQL Query Error Page 1: ', err); }
            var resultData = { docs: docs} ;
            db.query("SELECT FOUND_ROWS() total", [], function(err, docs){
                if(err){ console.log('MySQL Query Error Page 2: ', err); }
                var $rowCount = docs[0].total;
                var $pageCount = Math.ceil($rowCount / $rowsPerPage);


                var $recStart = $pageCount * $rowsPerPage - $rowsPerPage;
                resultData.rowCount = $rowCount;
                resultData.pageCount = $pageCount;
                callback(err, resultData);
            })//end query
        });//end primer query
    };

};
