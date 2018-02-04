export default {
	bench: function(code, caption){
		var d     = new Date();
		var start = d.getTime();
		
		code();
		
		var d     = new Date();
		var end   = d.getTime();
		
		(global.cons || console).info( caption || '', ( end - start ) / 1000 );
	},
	
	seq: function(f,t){ 
		var A = []; 
		for (var i=f;i<=t;i++){ 
			A.push(i) 
		};
		return A; 
	},
	
	map: function(k,f){
		var r    = [];
		var step = 1/k;
		var    i = 0;
		for ( var t = 0; t < 1 - step / 2; t += step ){
			r.push(f( t, i++, step ));
		};
		return r;
	},
	
	t2rgb: function(t) {
		t -= Math.floor(t);
		
		function p(d,t) {
			var
				v = 2 - Math.abs(d-t)*6;
				v = v<-2 ? -2-v : v;
				v = v<1 ? v>0 ? v : 0 : 1;
			return v;
		};
		
		return [p(3/3,t),p(1/3,t),p(2/3,t)];
	},
	
	tw2rgbw: function(t,w) {
		function p(d,t) {
			var
				v = 2 - Math.abs(d-t)*6;
				v = v<-2 ? -2-v : v;
				v = v<1 ? v>0 ? v : 0 : 1;
			return v;
		};
		
		var rgb = [p(3/3,t),p(1/3,t),p(2/3,t)];
		
		rgb[0] += (1 - rgb[0]) * w;
		rgb[1] += (1 - rgb[1]) * w;
		rgb[2] += (1 - rgb[2]) * w;
		
		return rgb;
	},
	
	rand:  function( r ){ return Math.random() * ( r || 1 ) },
	
	randi: function( i ){ return Math.floor( Math.random() * i ) },
	irand: function( i ){ return Math.floor( Math.random() * i ) },
	
	// удобные функции для проекции единичного отрезка
	// в окружность произвольного радиуса
	cos: function(angle){ return Math.cos(angle * 2 * Math.PI); },
	sin: function(angle){ return Math.sin(angle * 2 * Math.PI); },
	
	crt2xy: function(c,r,a){
		return [
			c[0] + this.cos(a) * r,
			c[1] + this.sin(a) * r,
		];
	},
	
	dist2: function(f,t){
		var dx = t[0] - f[0];
		var dy = t[1] - f[1];
		
		return Math.sqrt( dx * dx + dy * dy );
	},
	
	// curve(5,[1,10] / [10,1],[1,10] / [10,1], k )
	// k = 1 - 10 - 100 - 1000 - кривизна
	
	curve: function(i,fti,ftv,k){
		if (k > 0) return Math.log(1 + (i - fti[0]) / (fti[1] - fti[0]) * k ) / Math.log( 1 + k ) * ( ftv[1] - ftv[0]) + ftv[0];
		k = -k;    return Math.log(1 + (i - fti[1]) / (fti[0] - fti[1]) * k ) / Math.log( 1 + k ) * ( ftv[0] - ftv[1]) + ftv[1];
	},
	
	
	Fi: (Math.sqrt(5) - 1) / 2,
	
	cri2xy: function( c, rr, i ){
		if (i == 0) return this.xyp( c, [ rr, 0 ] );
		
		var r = Math.sqrt( i ) * this.Fi * rr * 2;
		return this.crt2xy( c, r, this.Fi * i );
	},
	
	xyp: function( f , t ){ return [ f[0] + t[0], f[1] + t[1] ] },
	xym: function( xy, m ){ return [ xy[0] * m, xy[1] * m ] },
	
	normalize(x, y) {
		const len = Math.sqrt(x**2 + y**2);
		return [x / len, y / len];
	},
	
	for2dim(a, b, cb) {
		for (let i = 0; i < a; i++) {
			for (let j = 0; j < b; j++) {
				cb(i, j);
			}
		}
	}
};
