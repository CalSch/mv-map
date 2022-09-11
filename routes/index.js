const fs=require('fs');
const ejs=require('ejs');
//  GET /
exports.route = function(pageData,req) {
    return ejs.render( fs.readFileSync('./pages/index.html.ejs').toString() , pageData );
}