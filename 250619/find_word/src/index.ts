import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

console.log('Hello! 	This is the find_word project.');
const data = fs.readFileSync(path.join(__dirname, '../input/test.csv'));
const words = data
	.toString()
	.split('\n')
	.map((line) => line.trim());

// ----------------------------------------
// findWord 함수를 호출하여 결과를 출력함.
// queries.csv 와 연결할 필요 있음.
// console.log(findWord('WORDHERE'));
// ----------------------------------------

// ----------------------------------------
// Function to find words that start with a given prefix
function findWord(prefix: string): {
	duration: number;
	result: string[];
} {
	const startTime = performance.now();
	const result: string[] = [];

	// TODO: Implement the logic to find words that start with the given prefix

	const duration = performance.now() - startTime;

	return {
		duration,
		result,
	};
}
