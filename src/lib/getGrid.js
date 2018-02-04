import t from './t.js'
import Buffer3D from './buffer3d.js'

//OrbitControls(screen._camera, node3d.canvas);

// разбить область на квадраты-секторы
// внутри каждого сектора - ячейки
// у каждого сектора есть центральная ячейка
// у каждой ячейки проставить значение вектора
export default function getGrid(opts, THREE) {
	const {
		WIDTH = 1000,
		HEIGHT = 1000,
		xSectors = 5,
		ySectors = 5
	} = opts;
	
	// Размер матрицы:
	// 25 секторов
	// в каждом секторе по 100 ячеек
	// в каждой ячейке по 2 вектора
	// в каждом векторе по 3 числа
	// 25 * 10 * 10 * 2 * 3 = 15000
	// 300*300 = 90 000
	// 2000x2000 в каждой ячейке rgb
	
	// 5 * 10 * 2 * 3 = 300 - в одной строкe
	// 50 пар векторов в одной строке
	
	// нужно поменять интерфейс на более понятный
	
	const N = 10;
	const SECTOR_SIZE_X = WIDTH / xSectors;
	const SECTOR_SIZE_Y = HEIGHT / ySectors;
	const CELL_SIZE_X = SECTOR_SIZE_X / N;
	const CELL_SIZE_Y = SECTOR_SIZE_Y / N;
	const globalOffsetX = 0;
	const globalOffsetY = 0;
	
	//const vertices = new Buffer3D(N * N * SECTOR_SIZE_X * SECTOR_SIZE_Y * 3 * 2);
	const vertices = new Buffer3D(15000);
	const velocities = new Buffer3D(7500);
	const colors = new Buffer3D(15000);
	
	t.for2dim(xSectors, ySectors, (w, h) => {
		const offsetX = globalOffsetX + w * SECTOR_SIZE_X;
		const offsetY = globalOffsetY + h * SECTOR_SIZE_Y;
		
		const center = new THREE.Vector2(
			offsetX + SECTOR_SIZE_X / 2,
			offsetY + SECTOR_SIZE_Y / 2
		);
		
		t.for2dim(N, N, (i, j) => {
			const p = new THREE.Vector2(
				offsetX + i * CELL_SIZE_X + CELL_SIZE_X / 2,
				offsetY + j * CELL_SIZE_Y + CELL_SIZE_Y / 2
			);
			const pt = new THREE.Vector2(p.x - center.x, p.y - center.y);
			
			const a = pt.angle();
			const ti = a / (2 * Math.PI);
			
			const r = p.distanceTo(center);
			
			const [x1, y1] = t.crt2xy([center.x, center.y], r, ti);
			const [x2, y2] = t.crt2xy([center.x, center.y], r, ti + 0.005);
			
			// для отрисовки
			// vertices.push([offsetX + x1 + center.x, offsetY + y1 + center.y, 0]);
			// vertices.push([offsetX + x2 + center.x, offsetY + y2 + center.y, 0]);
			vertices.push([p.x, p.y, 0]);
			vertices.push([p.x + (x2 - x1), p.y - (y2 - y1), 0]);
			
			
			// для карты
			velocities.push([x2 - x1, y2 - y1, 0]);
			
			colors.push([0, 1, 0]);
			colors.push([0, 1, 0]);
		});
	});
	
	return {
		velocities: velocities.getBuffer(),
		vertices: vertices.getBuffer(),
		colors: colors.getBuffer()
	};
}

export function drawGrid(scene, vertices, colors) {
	const linesGeometry = new THREE.BufferGeometry();
	linesGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	linesGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	const linesMaterial = new THREE.ShaderMaterial({
		vertexShader:   `
			attribute vec3  color;
			varying   vec3  varColor;
			
			void main() {
				varColor        = color;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_PointSize = 10.0;
				// gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
				gl_Position     = projectionMatrix * mvPosition;
			}
		`,
		fragmentShader: `
			varying vec3  varColor;
			
			void main() {
				gl_FragColor = vec4(varColor, 1.0);
			}
		`
	});
	const lines = new THREE.LineSegments( linesGeometry, linesMaterial );
	
	scene.add(lines);
	
	return lines;
}

export function transpose(x0, y0, vertices) {
	// нужно двойное преобразование
	// сперва получаем сектор
	const SEKTOR_SIZE = 200 / 1000 * 400;
	const x1 = (x0 - (x0 % SEKTOR_SIZE)) / SEKTOR_SIZE;
	const y1 = (y0 - (y0 % SEKTOR_SIZE)) / SEKTOR_SIZE;
	
	//console.log('x1, y1', x1, y1);
	
	const CELL_SIZE = 20 / 1000 * 400;
	const x2 = x0 - x1 * SEKTOR_SIZE;
	const y2 = y0 - y1 * SEKTOR_SIZE;
	
	//console.log('x2, y2', x2, y2);
	
	const x3 = (x2 - (x2 % CELL_SIZE)) / CELL_SIZE;
	const y3 = (y2 - (y2 % CELL_SIZE)) / CELL_SIZE;
	
	//console.log('x3, y3', x3, y3);
	
	const j = x1 * 500 * 3 * 2 + y1 * 100 * 3 * 2 + x3 * 10 * 3 * 2 + y3 * 3 * 2;
	
	const vx1 = vertices[j];
	const vy1 = vertices[j + 1];
	const vz1 = vertices[j + 2];
	const vx2 = vertices[j + 3];
	const vy2 = vertices[j + 4];
	
	// lines.geometry.attributes.color.array[j + 0] = 1;
	// lines.geometry.attributes.color.array[j + 1] = 0;
	// lines.geometry.attributes.color.array[j + 2] = 0;
	// lines.geometry.attributes.color.array[j + 3] = 1;
	// lines.geometry.attributes.color.array[j + 4] = 0;
	// lines.geometry.attributes.color.array[j + 5] = 0;
	
	//lines.geometry.attributes.color.needsUpdate = true;
	
	const vx = vx2 - vx1;
	const vy = vy2 - vy1;
	
	return [vx, vy];
}