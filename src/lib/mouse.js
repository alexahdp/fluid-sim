export function screenCoordsToWorld( event ) {
	const vector = new THREE.Vector3(
		( event.clientX / window.innerWidth ) * 2 - 1,
		- ( event.clientY / window.innerHeight ) * 2 + 1,
	);
	
	vector.unproject(w.camera);
	const dir = vector.sub( w.camera.position ).normalize();
	const distance = - w.camera.position.z / dir.z;
	const pos = w.camera.position.clone().add( dir.multiplyScalar( distance ) );
	return pos;
}