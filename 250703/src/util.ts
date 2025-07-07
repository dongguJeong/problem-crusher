export function calculateSuccessTime(startTime : Date){
    const playTime = Math.floor((new Date().valueOf() - startTime.valueOf()) / 1000) // 밀리초를 초로 변환
    let res ; 
    const minute = Math.floor(playTime / 60);
    res = playTime % 60;
    const second = Math.floor(res);
    return {minute,second}
}