import { Game } from "./Game";
import { Lib } from "./lib";
import { Difficulty, Status } from "./type";
import { calculateSuccessTime } from "./util";

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});




async function main() {

    let command ;
    let difficulty : Difficulty = 'easy'
    let keepGame = true;

    const game = new Game()

  try {
    while(keepGame){

        if(command !== 'r'){
              difficulty = await selectDifficulty();
              console.clear()
        }
      
        game.makeMap(difficulty);
        game.showMap();
        const startTime = new Date();

        while(true){
            command = await typeCommand(game);
            console.clear()

            if(command === Status.DEAD){
                console.log('gameOver');
                game.showAnswer();
                break;
            }
            else if(command === Status.RESTART ){
                console.log( '재시작 합니다. 난이도 : ' , difficulty )
                game.makeMap(difficulty)
                continue;
            }
            else if(command === Status.QUIT){
                console.log('선택화면으로 돌아갑니다');
                break;
            }
            else{
                if(game.checkSuccess()){
                    const {minute, second} = calculateSuccessTime(startTime)
                    console.log(`축하합니다! 플레이타임 ${minute}분 ${second}초`    );
                    game.showMap();

                    const retry = await retryGame()
                    console.clear()
                    if(!retry) {keepGame = false} 

                    break;
                }
                else game.showMap();
            }
        }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
   }
}

main();

async function selectDifficulty(){
    while(true){
        const difficulty = await askQuestion('난이도를 입력하세요 (easy, normal, hard) : ');
        if(difficulty === 'easy' || difficulty === 'normal' || difficulty === 'hard' ){
            return difficulty
        }
    }
}

function askQuestion(query : string) {
  return new Promise<string>(resolve => {
    rl.question(query, resolve);
  });
}

async function typeCommand(game : Game){
    const input  = await askQuestion('> 입력 : ');
    const [one, two ,three] = input.trim().split(' ');

    if(one === 'f'){
        game.flagMapItem( Number(two), Number(three))
        return 'f'
    }
    else if(one === 'r'){
        return 'r';
    }
    else if(one === 'q'){
         return 'q';
    }
    else {
        const res = game.clickMapItem(Number(one),Number(two));
        return res;
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





