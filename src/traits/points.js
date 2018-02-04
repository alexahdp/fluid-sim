export default function getPoints(scene) {
	const COUNT = 500;
	var positions = new Float32Array( COUNT * 3 );
	var vels = new Float32Array( COUNT * 3 );
	//var colors = new Float32Array( COUNT * 3 );
	
	for (let i = 0; i < COUNT * 3; i += 3) {
		positions[i] = Math.random() * 400;
		positions[i + 1] = Math.random() * 400;
		positions[i + 2] = 0;
		
		vels[i] = 0;
		vels[i + 1] = 0;
		vels[i + 2] = 0;
	}
	
	const geometry = new THREE.BufferGeometry();
	
	geometry.addAttribute( 'position', new THREE.BufferAttribute(positions, 3 ));
	//geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	//geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
	
	const material = new THREE.ShaderMaterial( {
		color: 0xff0000,
		size: 100,
		uniforms: {
			//amplitude: { value: 1.0 },
			color:     { value: new THREE.Color( 0xffffff ) },
			//texture: { value: new THREE.TextureLoader().load( "textures/disc.png" ) }
		},
		
		vertexShader:   `
			attribute vec3  color;
			varying   vec3  varColor;
			
			void main() {
				varColor        = color;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_PointSize = 5.0;
				// gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
				gl_Position     = projectionMatrix * mvPosition;
			}
		`,
		fragmentShader: `
			varying vec3  varColor;
			
			void main() {
				//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
				
				vec3 N;
				N.xy = gl_PointCoord.xy*vec2(2.0, -2.0) + vec2(-1.0, 1.0);
				float mag = dot(N.xy, N.xy);
				if (mag > 1.0) discard;
				gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 - mag );
			}
		`
	});
	
	const mesh = new THREE.Points( geometry, material );
	scene.add(mesh);
	
	mesh.userData.vels = vels;
	
	return mesh;
}