import t from './lib/t.js'
import getGrid, {transpose, drawGrid} from './lib/getGrid.js'
import OrbitControls from './lib/three-orbit-controls/index.js'
import getAxis from './traits/axis.js'
import getPoints from './traits/points.js'
import {screenCoordsToWorld} from './lib/mouse.js'

const Controls = OrbitControls(THREE);


function init() {
	const w = {};
	
	w.scene = new THREE.Scene();
	
	w.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
	w.camera.position.x = 0;
	w.camera.position.y = 0;
	w.camera.position.z = 100;
	w.camera.lookAt(w.scene.position);
	
	w.renderer = new THREE.WebGLRenderer();
	w.renderer.setClearColor(0x000000, 1.0);
	w.renderer.setSize(window.innerWidth, window.innerHeight);
	
	document.body.appendChild(w.renderer.domElement);
	
	// ================================
	
	getAxis(w.scene);
	const mesh = getPoints(w.scene);
	
	const {velocities, vertices, colors} = getGrid({}, THREE);
	
	//
	for (let i = 0; i < vertices.length; i+=3) {
		vertices[i] = vertices[i] / 1000 * 400;
		vertices[i + 1] = vertices[i + 1] / 1000 * 400;
	}
	// нужно перевести vertices и velocities в новую систему координат
	
	drawGrid(w.scene, vertices, colors);
	
	let mouse = {
		click: false,
		xy: [0, 0]
	};
	
	document.addEventListener('click', e => {
		const pos = screenCoordsToWorld(e);
		mouse.xy = [pos.x, pos.y];
		mouse.click = true;
	})
	
	
	w.render = function() {
		if (mouse.click) {
			const [vx, vy] = transpose(mouse.xy[0], mouse.xy[1], vertices);
			mouse.click = false;
		}
		
		for (let i = 0; i < mesh.geometry.attributes.position.count * 3; i += 3) {
			const x0 = mesh.geometry.attributes.position.array[i];
			const y0 = mesh.geometry.attributes.position.array[i + 1];
			
			const [vx, vy] = transpose(x0, y0, vertices);
			
			const v = new THREE.Vector2(vx, vy).normalize();
			mesh.userData.vels[i] += v.x;
			mesh.userData.vels[i + 1] += v.y;
			
			mesh.geometry.attributes.position.array[i] += mesh.userData.vels[i];
			mesh.geometry.attributes.position.array[i + 1] += mesh.userData.vels[i + 1];
			
			if (mesh.geometry.attributes.position.array[i] > 400) {
				mesh.geometry.attributes.position.array[i] = 0;
			}
			else if (mesh.geometry.attributes.position.array[i] < 0) {
				mesh.geometry.attributes.position.array[i] = 399;
			}
			
			if (mesh.geometry.attributes.position.array[i + 1] > 400) {
				mesh.geometry.attributes.position.array[i + 1] = 0;
			}
			else if (mesh.geometry.attributes.position.array[i + 1] < 0) {
				mesh.geometry.attributes.position.array[i + 1] = 399;
			}
			
			mesh.userData.vels[i] *= 0.5;
			mesh.userData.vels[i + 1] *= 0.5;
		}
		
		mesh.geometry.attributes.position.needsUpdate = true;
		
		w.renderer.render(w.scene, w.camera);
		requestAnimationFrame(w.render);
		//setTimeout(w.render, 300);
	};
	
	w.controls = new Controls( w.camera );
	
	return w;
}

const world = init();
world.render();