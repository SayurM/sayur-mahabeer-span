export class Processor{
    constructor(private filePath: string){}

    private renderResults = (array: any[]): void => {
        let position = 1;
        let previousScore = array[0][1];
    
        array.forEach((element)=>{
            if(previousScore !== element[1])
                position++;
    
            previousScore = element[1];

            console.log(`${position}. ${element[0]} ${element[1]} pts`);
        });
    };

    public process(): void{
        let JSONOutput = {}
        const fileStream = this.getFileStream();
        fileStream.on('line', (line: string) => {
            const matchResult: MatchResult = Processor.processString(line);
            const matchPoints: MatchPoint[] = Processor.calculatePointsForMatch(matchResult);
            matchPoints.forEach((matchPoint => {
                JSONOutput = this.updateJSONResult(JSONOutput, matchPoint);
            }))
        });

        fileStream.on('close', () => {
            this.renderResults(this.convertJSONToRankedArray(JSONOutput));
        });   
    }

    public convertJSONToRankedArray(json: any): any[]{
        const arr = Object.keys(json).map((key) => [key, json[key]]);
        return this.sortArray(arr);
    }

    
    public sortArray(inputArray: any[]): any {
        const data = [...inputArray];
        
        return data.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }
    public updateJSONResult(inputJSON: any, matchPoint: MatchPoint): any {
        const JSONResult = {...inputJSON};

        if(!JSONResult[matchPoint.team])
            JSONResult[matchPoint.team] = 0;

        JSONResult[matchPoint.team] = JSONResult[matchPoint.team] + matchPoint.points;

        return JSONResult;
    }

    public getFileStream() : any {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(this.filePath)
          });

          return lineReader;
    }
    public static calculateMatchOutcome(subjectScore: number, oppositionScore: number): MatchOutcome []{
        if(subjectScore > oppositionScore)
            return [MatchOutcome.WIN, MatchOutcome.LOSS];
        else if(subjectScore < oppositionScore)
            return [MatchOutcome.LOSS, MatchOutcome.WIN];
        else
            return [MatchOutcome.DRAW, MatchOutcome.DRAW];
    }

    public static convertMatchOutcomeAndMatchResultToMatchPoints(matchOutcome: MatchOutcome [], matchResult: MatchResult): MatchPoint [] {
        const pointsMap = new Map([
            [MatchOutcome.WIN, 3],
            [MatchOutcome.LOSS, 0],
            [MatchOutcome.DRAW, 1],
        ]);
        return [
            {
                team: matchResult.team1,
                points: pointsMap.get(matchOutcome[0]),
            },
            {
                team: matchResult.team2,
                points: pointsMap.get(matchOutcome[1]),
            }
        ];
    }

    public static calculatePointsForMatch(matchResult: MatchResult): MatchPoint [] {

        const matchOutcome = Processor.calculateMatchOutcome(matchResult.score1, matchResult.score2);

        return this.convertMatchOutcomeAndMatchResultToMatchPoints(matchOutcome, matchResult);
    }

    public static processString(inputString: string): MatchResult {
        const result = {} as MatchResult;
        let splitStrings = inputString.split(", ");

        let subsplit1 = splitStrings[0].split(" ");
            result.team1 = subsplit1[0];
            result.score1 = parseInt(subsplit1[1]);
        
        let subsplit2 = splitStrings[1].split(" ");
            result.team2 = subsplit2[0];
            result.score2 = parseInt(subsplit2[1]);

        return result;
    }
}

export enum MatchOutcome {
    WIN,
    LOSS,
    DRAW,
  }

export interface MatchPoint {
    team: string,
    points: number|undefined,
}

//unprocessed
export interface MatchResult {
    team1: string,
    score1: number,
    team2: string,
    score2: number,
}