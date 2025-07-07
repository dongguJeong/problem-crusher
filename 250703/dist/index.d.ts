declare const readline: any;
declare const rl: any;
declare class MapItem {
    nearMineCount: number;
    isOpen: boolean;
    isMine: boolean;
    isFlag: boolean;
    constructor();
    clickItem(): void;
    toggleFlag(): void;
}
declare let map: MapItem[][];
declare let width: number;
declare let height: number;
declare let mineCount: number;
declare let mineArray: {
    y: number;
    x: number;
}[];
declare const MINE = -1;
declare const FLAG = -2;
declare let flag: any;
declare const dy: number[];
declare const dx: number[];
type Difficulty = 'easy' | 'normal' | 'hard';
declare function askQuestion(query: string): Promise<unknown>;
declare function main(): Promise<void>;
declare function makeMap(difficulty: Difficulty): void;
declare function showMap(): void;
declare function showAnswer(): void;
declare function selectDifficulty(): Promise<"easy" | "normal" | "hard">;
declare function typeCommand(): Promise<number | "f" | "r" | "q" | undefined>;
declare function retryGame(): Promise<boolean>;
declare function clickMapItem(y: number, x: number): number;
declare function flagMapItem(y: number, x: number): void;
declare function checkSuccess(): boolean;
declare function calculateSuccessTime(startTime: Date): {
    minute: number;
    second: number;
};
//# sourceMappingURL=index.d.ts.map