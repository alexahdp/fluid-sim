export default function getAxis(scene) {
	const geometry = new THREE.Geometry();
	
	geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
	geometry.vertices.push(new THREE.Vector3(1000, 0, 0));
	geometry.vertices.push(new THREE.Vector3(0, -1000, 0));
	geometry.vertices.push(new THREE.Vector3(0, 1000, 0));
	
	const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
	const line = new THREE.LineSegments(geometry, material);
	
	scene.add(line);
}