const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class MapItem{
    nearMineCount : number;
    isOpen : boolean ;
    isMine : boolean ;
    isFlag : boolean ;
    
    constructor(){
        this.nearMineCount = 0;
        this.isFlag = false;
        this.isMine = false;
        this.isOpen = false;
    }

    clickItem(){
        this.isOpen = true;
    }

    toggleFlag(){
        this.isFlag = !this.isFlag
    }
}

let map : MapItem[][] = [] ;
let width : number ;
let height : number;
let mineCount : number;
let mineArray : {y : number , x : number}[] = []


const MINE = -1;
const FLAG = -2;
let flag;
const dy = [-1,1,0,0,-1,1,-1,1];
const dx = [0,0,-1,1, 1,1,-1,-1]

type Difficulty = 'easy' | 'normal' | 'hard'


function askQuestion(query : string) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function main() {

    let command ;
    let difficulty : Difficulty = 'easy'
    let startTime ;
    

  try {
    while(true){

        if(command !== 'r'){
              difficulty = await selectDifficulty();
              console.clear()
        }
        else if(command === 'r'){
            console.log( '재시작 합니다. 난이도 : ' , difficulty )
        }
        makeMap(difficulty);
        startTime = new Date();

        while(true){
            command = await typeCommand();
            console.clear()

            if(command === MINE){
                console.log('gameOver');
                showAnswer();
                break;
            }
            else if(command === 'r' ){
                break;
            }
            else if(command === 'q'){
                console.log('새로 시작합니다');
                break;
            }
            else{
                if(checkSuccess()){
                    const playTime = Math.floor((new Date().valueOf() - startTime.valueOf()) / 1000) // 밀리초를 초로 변환
                    let res ; 
                    const hour = Math.floor(playTime / 3600)
                    res = playTime % 3600;
                    const minute = Math.floor(res / 60);
                    res = res % 60;
                    const second = Math.floor(res);

                    console.log(`축하합니다! 플레이타임 ${hour} 시간 ${minute}분 ${second}초`    );
                    showMap();
                    break;
                }
                showMap();
        }
        }
        if( command === 'q' || command ===  'r'   ){
            continue;
        }
        else{
            const retry = await retryGame()
            console.clear()
            if(!retry) break;
        }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
   }
}

main();


 function makeMap( difficulty : Difficulty){
    map = []
    mineArray = []

    if(difficulty === 'easy'){
        // width = 9;
        // height = 9;
        // mineCount = 10;
        width = 3;
        height  = 3;
        mineCount = 1
    }

    else if(difficulty === 'normal'){
        width = 16;
        height = 16;
        mineCount = 40;
    }

    else{
        width = 30;
        height = 16;
        mineCount = 99;
    }

    for(let y =  0 ; y  < height  ; y++ ){
        map[y] = []
        for(let x = 0 ; x < width ; x++){
            map[y].push(new MapItem())
        }
    }

    for(let i = 0 ; i < mineCount ; i++){
        while(true){
            const xx = Math.floor((Math.random() * 100)) % width ;
            const yy = Math.floor((Math.random() * 100)) % height ;
            const target = map[yy][xx];
            if( target.isMine === false){
                target.isMine = true;
                mineArray.push({y : yy, x : xx})
                break;
            }
        }
    }

    // 지뢰 주변의 칸들의 숫자를 1씩 증가시킨다
    for(let i = 0 ; i < mineCount ; i++){
        const curY = mineArray[i].y;
        const curX = mineArray[i].x;
        
        for(let j = 0 ; j < 8 ; j++){
            const ny = curY + dy[j];
            const nx = curX + dx[j];
            if(ny>= 0 && ny< height && nx >= 0 && nx < width && map[ny][nx].isMine === false){
                map[ny][nx].nearMineCount += 1;
            }
        }
    }
}   

function showMap(){

    console.log('남은 지뢰 : ' , mineCount);
    let line = '   ';
    for(let i = 0 ; i < width ; i++){
        line += i.toString().padStart(3, ' ');
    }
    console.log(line);

    for(let y = 0 ; y < height ; y++){
        let row =  y.toString().padStart(2,' ') + '|';
        for(let x = 0 ; x < width ; x++){
            if(map[y][x].isOpen) {
               row +=  map[y][x].nearMineCount === 0 ? ' '.padStart(3,' ') : map[y][x].nearMineCount.toString().padStart(3,' ')
            }
            else if(map[y][x].isFlag){
                row += 'F'.padStart(3,' ');
            }
            else{
                row += '.'.padStart(3,' ')
            }
        }
        console.log(row)
    }
}

function showAnswer(){
    let line = '   ';
    for(let i = 0 ; i < width ; i++){
        line += i.toString().padStart(3, ' ');
    }
    console.log(line);

     for(let y = 0 ; y < height ; y++){
        let row =  y.toString().padStart(2,' ') + '|';
        for(let x = 0 ; x < width ; x++){
            if(map[y][x].isMine){
                row += 'X'.padStart(3,' ');
            }
            else{
               row +=   '.'.padStart(3,' ')
            }
        }
        console.log(row)
    }
}


async function selectDifficulty(){
    while(true){
        const difficulty = await askQuestion('난이도를 입력하세요 (easy, normal, hard) : ');
        if(difficulty === 'easy' || difficulty === 'normal' || difficulty === 'hard' ){
            return difficulty
        }
    }
}

async function typeCommand(){
   const input  = await askQuestion('> 입력 : ');

   if(typeof(input) === 'string'){
    const [one, two ,three] = input.trim().split(' ');

    if(one === 'f'){
        flagMapItem( Number(two), Number(three))
        return 'f'
    }
    else if(one === 'r'){
        return 'r';
    }
    else if(one === 'q'){
         return 'q';
    }
    else {
        const res = await clickMapItem(Number(one),Number(two));
        return res;
    }
   }
}

async function retryGame(){
    while(true){

        const res = await askQuestion('다시 시작하시겠습니까? (y/n) : ');
        if(res === 'y'){
            return true;
        }
        else if(res === 'n'){
            return false;
        }
        else console.log('y,n 둘 중 하나를 입력해주세요');
    }

}


async function clickMapItem(y : number, x: number){
    map[y][x].isOpen  = true;
    
    if(map[y][x].isMine){
        return MINE;
    }
    else if(map[y][x].isFlag){
        return FLAG
    }
        
    else if(map[y][x].nearMineCount === 0){

        let visited = [];
        for(let yy = 0 ; yy < height ; yy++){
            visited.push(new Array(width).fill(false));
        }


        let q : {y: number, x: number}[]= [];
        q.push({y, x})

        while(q.length !== 0){
            const now = q.shift()!;
            const curY = now.y;
            const curX = now.x;

            for(let j = 0 ; j < 4 ; j++){
            const ny = curY + dy[j];
            const nx = curX + dx[j];
                if(ny>= 0 && ny< height && nx >= 0 && nx < width && map[ny][nx].isMine === false && !visited[ny][nx]  ){
                    map[ny][nx].isOpen = true;
                    visited[ny][nx] = true;
                    if(map[ny][nx].nearMineCount === 0 ){
                        q.push({y: ny, x : nx})
                    }
                }
            }
        }
        return map[y][x].nearMineCount
    }
    else{
        map[y][x].isOpen = true;
        return map[y][x].nearMineCount
    }
   
}

function flagMapItem(y : number , x : number){
    map[y][x].toggleFlag();
    if(map[y][x].isFlag === true && map[y][x].isMine === true){
        mineCount -= 1;
    }
    else if(map[y][x].isFlag === false && map[y][x].isMine === true){
        mineCount += 1;
    }
}

function checkSuccess(){
    for(let y = 0 ; y < height ; y++){
        for(let x = 0 ; x < width ; x++){
            if(map[y][x].isFlag === true && map[y][x].isMine ===false){return false}
            if(map[y][x].isFlag === false && map[y][x].isMine ===true){return false}

        }
    }
    return true;
}