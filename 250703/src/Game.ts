import { Lib } from "./lib";
import { Difficulty, MINE, FLAG, Status } from "./type";

class GameMapItem{
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

export class Game{

    map : GameMapItem[][]
    difficulty : Difficulty;
    mineCount : number;
    mapInfo : typeof Lib.GameSetting.easy;


    constructor(){
        this.map = [];
        this.difficulty = 'easy'
        this.mineCount = 0;
        this.mapInfo = Lib.GameSetting.easy;
    }

    makeMap( difficulty : Difficulty){
    this.map = []
    const mineArray = []
    this.mapInfo = Lib.GameSetting[difficulty]

    

    for(let y =  0 ; y  < this.mapInfo.height  ; y++ ){
        this.map[y] = []
        for(let x = 0 ; x < this.mapInfo.width ; x++){
            this.map[y].push(new GameMapItem())
        }
    }

    // 지도에 지뢰 추가하기
    for(let i = 0 ; i < this.mapInfo.mineCount ; i++){
        while(true){
            const xx = Math.floor((Math.random() * 100)) % this.mapInfo.width ;
            const yy = Math.floor((Math.random() * 100)) % this.mapInfo.height ;
            const target = this.map[yy][xx];
            if( target.isMine === false){
                target.isMine = true;
                mineArray.push({y : yy, x : xx})
                break;
            }
        }
    }

    // 지뢰 주변의 칸들의 숫자를 1씩 증가시킨다
    for(let i = 0 ; i < this.mapInfo.mineCount ; i++){
        const curY = mineArray[i].y;
        const curX = mineArray[i].x;
        
        for(let j = 0 ; j < 8 ; j++){
            const ny = curY + Lib.dy[j];
            const nx = curX + Lib.dx[j];
            if(ny>= 0 && ny< this.mapInfo.height && nx >= 0 && nx < this.mapInfo.width && this.map[ny][nx].isMine === false){
                this.map[ny][nx].nearMineCount += 1;
            }
        }
    }
}   

   

    showMap(){
    // x 축 번호 출력
    console.log('남은 지뢰 : ' , this.mapInfo.mineCount);
    let line = '   ';
    for(let i = 0 ; i < this.mapInfo.width ; i++){
        line += i.toString().padStart(3, ' ');
    }
    console.log(line);

    // 0 이면 빈 공간
    // 숫자면 숫자 표시 
    for(let y = 0 ; y < this.mapInfo.height ; y++){
        let row =  y.toString().padStart(2,' ') + '|';
        for(let x = 0 ; x < this.mapInfo.width ; x++){
            if(this.map[y][x].isOpen) {
               row +=  this.map[y][x].nearMineCount === 0 ? ' '.padStart(3,' ') : this.map[y][x].nearMineCount.toString().padStart(3,' ')
            }
            else if(this.map[y][x].isFlag){
                row += 'F'.padStart(3,' ');
            }
            else{
                row += '.'.padStart(3,' ')
            }
        }
        console.log(row)
    }
}

    showAnswer(){
    // x 축 번호 출력
    let line = '   ';
    for(let i = 0 ; i < this.mapInfo.width ; i++){
        line += i.toString().padStart(3, ' ');
    }
    console.log(line);

    // 한 줄 씩 맵 출력
     for(let y = 0 ; y < this.mapInfo.height ; y++){
        let row =  y.toString().padStart(2,' ') + '|';
        for(let x = 0 ; x < this.mapInfo.width ; x++){
            if(this.map[y][x].isMine){
                row += 'X'.padStart(3,' ');
            }
            else{
               row +=   '.'.padStart(3,' ')
            }
        }
        console.log(row)
    }
    }

    flagMapItem(y : number , x : number){
        this.map[y][x].toggleFlag();
        if(this.map[y][x].isFlag === true && this.map[y][x].isMine === true){
            this.mapInfo.mineCount -= 1;
        }
        else if(this.map[y][x].isFlag === false && this.map[y][x].isMine === true){
            this.mapInfo.mineCount += 1;
        }
    }

    checkSuccess(){
        for(let y = 0 ; y < this.mapInfo.height ; y++){
            for(let x = 0 ; x < this.mapInfo.width ; x++){
                if(this.map[y][x].isFlag === true && this.map[y][x].isMine ===false){return false}
                if(this.map[y][x].isFlag === false && this.map[y][x].isMine ===true){return false}

            }
        }
        return true;
    }


    clickMapItem(y : number, x: number) {
        this.map[y][x].isOpen  = true;
        
        if(this.map[y][x].isMine){
            return Status.DEAD;
        }
        else if(this.map[y][x].isFlag){
            return Status.LIVE
        }
            
        else if(this.map[y][x].nearMineCount === 0){

            const visited = [];
            for(let yy = 0 ; yy < this.mapInfo.height ; yy++){
                visited.push(new Array(this.mapInfo.width).fill(false));
            }

            const q : {y: number, x: number}[]= [];
            q.push({y, x})

            while(q.length !== 0){
                const now = q.shift()!;
                const curY = now.y;
                const curX = now.x;

                for(let j = 0 ; j < 4 ; j++){
                const ny = curY + Lib.dy[j];
                const nx = curX + Lib.dx[j];
                    if(ny>= 0 && ny< this.mapInfo.height && nx >= 0 && nx < this.mapInfo.width && this.map[ny][nx].isMine === false && !visited[ny][nx]  ){
                        this.map[ny][nx].isOpen = true;
                        visited[ny][nx] = true;
                        if(this.map[ny][nx].nearMineCount === 0 ){
                            q.push({y: ny, x : nx})
                        }
                    }
                }
            }
            return Status.LIVE
        }
        else{
            this.map[y][x].isOpen = true;
            return Status.LIVE
        }
    
    }

}