export namespace Lib{
    export const GameSetting = {
        'easy' : {width : 9, height : 9 , mineCount : 10},
        'normal' : {width : 15, height : 15, mineCount : 20},
        'hard' : {width : 30, height : 15 , mineCount : 99 }
    }

   
    export const dy = [-1,1,0,0,-1,1,-1,1];
    export const dx = [0,0,-1,1, 1,1,-1,-1]

}