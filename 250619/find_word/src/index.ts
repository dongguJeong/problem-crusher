import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const data = fs.readFileSync(path.join(__dirname, '../input/test.csv'));
const words = data
	.toString()
	.split('\n')
	.map((line) => line.trim());

// ----------------------------------------
// Example usage of the findWord function
// console.log(findWord('WORDHERE'));
// ----------------------------------------

// ----------------------------------------
// Function to find words that start with a given prefix
function findWord(prefix: string): {
	duration: number;
	result: any[];
} {
	const startTime = performance.now();
	const result: any[] = [];

	// TODO: Implement the logic to find words that start with the given prefix

	const duration = performance.now() - startTime;

	return {
		duration,
		result,
	};
}
