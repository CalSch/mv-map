const express=require('express');
const ejs=require('ejs');
const fs=require('fs');
const chokidar=require('chokidar');
const mime=require('mime');
require('dotenv').config();
const PORT=process.env.PORT || 8080;
const HOST=process.env.HOST || "localhost";
const app=express();

/**
 * @type {Object.<string,()=>string>}
 */
let routes={};

function loadRoute(fname) {
	routes[fname.substring(0,fname.length-3)]=require(`./${fname.substring(0,fname.length-3)}`).route;
}

chokidar.watch('./routes/*').addListener("all",function(ev,fname){
	console.log(`Reloading route in ${fname} (${ev})`);
	loadRoute(fname);
});

let pageData={
	colors: {
		red: "apple",
		yellow: "banana"
	}
}

/**
 * @param {string} filePath 
 * @param {express.Response} res 
 */
function setFileHeaders(filePath,res) {
	let type=mime.getType(filePath);
	res.set('Content-Type',type);
	res.set('content-type',type);
}



app.get('*',(req,res)=>{
	let resource=req.url;
	if (resource==='/') {
		resource="/index.html";
	}
	let routeName='routes/'+resource.substring(1,resource.length).split('.')[0];
	console.log(resource);
	console.log(routeName);

	if (fs.existsSync(`./public${resource}`)) {
		setFileHeaders(resource,res);
		res.send(fs.readFileSync(`./public${resource}`).toString());
	} else if (fs.existsSync(`./public${resource}.ejs`)) {
		setFileHeaders(resource,res);
		res.send(ejs.render( fs.readFileSync(`./public${resource}.ejs`).toString() , pageData));
	} else if (routes[routeName]) {
		res.send(routes[routeName](pageData,req));
	} else {
		res.status(404);
		if (routes['404']) {
			res.send(routes['404'](pageData,req));
		} else {
			res.send(`404 Could not find ${resource} on the server.`);
		}
	}
});

app.listen(PORT,HOST,()=>{
	console.log(`Listening on port http://${HOST}:${PORT}/`);
});