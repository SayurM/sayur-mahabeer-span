export declare class Processor {
    private filePath;
    constructor(filePath: string);
    private renderResults;
    process(): void;
    convertJSONToRankedArray(json: any): any[];
    sortArray(inputArray: any[]): any;
    updateJSONResult(inputJSON: any, matchPoint: MatchPoint): any;
    getFileStream(): any;
    static calculateMatchOutcome(subjectScore: number, oppositionScore: number): MatchOutcome[];
    static convertMatchOutcomeAndMatchResultToMatchPoints(matchOutcome: MatchOutcome[], matchResult: MatchResult): MatchPoint[];
    static calculatePointsForMatch(matchResult: MatchResult): MatchPoint[];
    static processString(inputString: string): MatchResult;
}
export declare enum MatchOutcome {
    WIN = 0,
    LOSS = 1,
    DRAW = 2
}
export interface MatchPoint {
    team: string;
    points: number | undefined;
}
export interface MatchResult {
    team1: string;
    score1: number;
    team2: string;
    score2: number;
}
