export default class Buffer3D {
	
	constructor(n) {
		this._buffer = new Float32Array(n);
		this._last = 0;
	}
	
	push(elems) {
		elems.forEach(elem => {
			this._buffer[this._last] = elem;
			this._last++;
		});
	}
	
	getBuffer() {
		return this._buffer;
	}
	
	get length() {
		return this._buffer.length
	}
}
