import fs from 'fs';
import path from 'path';

function execute() {
	const data = fs.readFileSync(path.join(__dirname, '../map/maze_100x100_1.txt'));
	const map = data.toString();
	const startTime = performance.now();
	const result = findPath(map);
	const duration = performance.now() - startTime;
	console.log(`Duration: ${duration} ms`);
	console.log(`Result: ${result}`);
}

class Coodinate{
	y : number ;
	x : number;
	constructor(y: number, x : number){
		this.x = x;
		this.y= y; 
	}
}

function findPath(map: any): string {
	let result: string = '';
	
	// 1. 포탈 위치를 기록한다
	const portalMap  : {[ key : string] : Coodinate[] } = {};

	const data = map.trim().split('\n');
	const Y = data.length ; 
	const X = data[0].split(' ').filter((i : string) => i !== '').length;
	let start : Coodinate = {y : 0, x : 0};
	let end : Coodinate = {y : Y-1, x : X-1};
	
	const realmap = data.map((row : string) => row.split(' ').filter((i : string) => i !== ''));

	for(let y = 0 ;  y < Y ; y++){
		for(let x = 0 ;  x < X ; x++){

			 if(!isNaN(realmap[y][x])){
				const key= realmap[y][x];
				if(!portalMap[key]){
					portalMap[key] = [new Coodinate(y,x)]
				}
				else{
					portalMap[key].push(new Coodinate(y,x));
				}
			}
		}
	}
	
	const record =new Array(Y);

	for(let y = 0 ; y < Y ; y++){
		record[y] = Array(Y).fill(Number.POSITIVE_INFINITY);
	}
	record[start.y][start.x] = 0;

	
	const q : Coodinate[]= [];
	q.push(start);

	const dy = [-1,1,0,0];
	const dx = [0,0,-1,1];

	while(q.length !== 0){
		const now = q.shift()!;
		const curY = now.y;
		const curX = now.x;

		
		if(curY === end.y && curX === end.x){
			break;
		}

		for(let i = 0 ; i < 4 ; i++){
			const nextY = curY + dy[i];
			const nextX = curX + dx[i];

			if(nextY >= 0 && nextY < Y && nextX >= 0 && nextX < X && realmap[nextY][nextX] !== '.S' && realmap[nextY][nextX] !== '#' && record[nextY][nextX] > record[curY][curX] + 1) {
				record[nextY][nextX] = record[curY][curX] + 1

				//1. 이동하는 칸이 포탈
				if(!isNaN(realmap[nextY][nextX]) ){
					const key = realmap[nextY][nextX];

					// 포탈을 타고 이동할 칸
					const nnext = portalMap[key][0].y === nextY && portalMap[key][0].x === nextX ? portalMap[key][1] : portalMap[key][0];
					record[nnext.y][nnext.x] = record[curY][curX] + 1
					q.push(new Coodinate(nnext.y, nnext.x));
					
				}
				//아닌 경우
				else{
					q.push(new Coodinate(nextY, nextX));
				}
			}
		}
	}


	if(record[end.y][end.x] === Number.POSITIVE_INFINITY){
		result = 'NO'
	}
	else{
		result = record[end.y][end.x] + ''
	}
	return result;

}
execute();
