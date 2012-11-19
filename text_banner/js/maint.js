var Word = function(key){
	var bgC,bgCtx,denseness=10,circles=[],itercount=0,itertot=40,canvas,ctx;
	this.keyword = key;
	this.init = function(id_c){
		canvas = document.getElementById(id_c);
		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth,
		canvas.height = window.innerHeight,
		bgC = document.createElement('canvas');
		bgC.height = window.innerHeight;
		bgC.width = window.innerWidth;
		bgCtx = bgC.getContext('2d');

		this.start();
	}
	this.start = function(){
		//bgCtx.fillStyle = '#000000';
		//bgCtx.font = '200px Impact';
		bgCtx.drawImage(this.keyword,200,0);
		this.getCoords();
	}
	this.getCoords = function(){
		var img,pixe,height,width;
		img = bgCtx.getImageData(0,0,bgC.width,bgC.height);

		for(height=0;height<bgC.height;height+=denseness){
			for(width =0;width<bgC.width; width+=denseness){

				pixel = img.data[((width+(height*bgC.width))*4)-1];
				console.log(img.data[width]	);
				if(pixel == 255){
					this.pushCircle(width,height);
				}
			}
		}
		setInterval(this.update,40);
	}
	this.pushCircle = function(x,y){
		var startx = (Math.random() * (canvas.width+100));
		var starty = (Math.random() *( canvas.height+100));

		var velx  = (x - startx) / itertot;
		var vely  = (y - starty) / itertot;
		circles.push({
			color: "#333",
			x: x,
			y: y,
			x2: startx,
			y2: starty,
			move:true,
			v:{x:velx,y:vely}
		});
	}
	this.update = function(){
		var y,dx, dy, sqrD,scale;
		itercount++;
		canvas.width = canvas.width;
		for(i in circles){
			var circle = circles[i];
			if(circle.move == true){
				circle.x2 += circle.v.x;
				circle.y2 += circle.v.y;
			}
			if(itercount == itertot){
				circle.v = {
					x:(Math.random() * 6)*2-6,
					y:(Math.random() * 6)*2-6,
				};
				circle.move = false;
			}
			ctx.fillStyle = circle.color;
			ctx.beginPath();
			ctx.arc(circle.x2,circle.y2,6,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}
	}

}
window.addEventListener('load',initialize);
function initialize(){
	var img = new Image();
	img.src='t.png';
	img.onload = function(){
		var w = new Word(this);
		w.init("c");	
	}
	
}
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}