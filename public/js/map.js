let dotEl=document.getElementById('dot');

function map_range(n,in_min, in_max, out_min, out_max) {
	return (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

let p1,p2;
let hasGeo=false;

function click1() {
	if (!hasGeo) return;
	navigator.geolocation.getCurrentPosition((pos)=>{
		p1=pos.coords;
	},console.dir);
}
function click2() {
	if (!hasGeo) return;
	navigator.geolocation.getCurrentPosition((pos)=>{
		p2=pos.coords;
	},console.dir);
}

if (navigator.geolocation) {
	alert(`Got geolocation!`);
	hasGeo=true;

	navigator.geolocation.watchPosition((pos)=>{
		if (p1 && p2) {
			dotEl.style.left=`${ map_range(pos.coords.longitude,p1.longitude,p2.longitude,0,500) }px`;
			dotEl.style.top=`${ map_range(pos.coords.latitude,p1.latitude,p2.latitude,0,500) }px`;
		}
		console.log('moved')
		console.dir(pos)
	},(err)=>{
		console.dir(err);
	});
} else {
	alert(`No geolocation :(`);
}
