import fs from 'fs';
import path from 'path';

function execute() {
	const data = fs.readFileSync(path.join(__dirname, '../map/maze_10x10.txt'));
	const map = data.toString();
	const startTime = performance.now();
	const result = findPath(map);
	const duration = performance.now() - startTime;
	console.log(`Duration: ${duration} ms`);
	console.log(`Result: ${result}`);
}
function findPath(map: any): string {
	const result: string = '';

	// TODO: Implement the logic

	return result;
}

execute();
