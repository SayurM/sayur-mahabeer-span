import { Processor, MatchOutcome, MatchResult, MatchPoint } from '../src/Processor';
import {expect} from 'chai';

describe('Processor', function() {
    it('ranking array sorting', function() {
        const rankingJSON = {
            "TeamB": 4,
            "TeamC": 7,
            "TeamA": 4
        };

        const expectedOutput = [
            ["TeamC", 7],
            ["TeamA", 4],
            ["TeamB", 4],
        ];

        expect(expectedOutput).to.eql(new Processor('').convertJSONToRankedArray(rankingJSON));
    });
    it('match point JSON generator', function() {
        const processor = new Processor(__dirname + '\\testFile.txt');
        let absentKeyCaseMatchPoint =
            {
                team: "TeamA",
                points: 1
            }as MatchPoint;
    
        let absentKeyCaseOutput = {
            "TeamA": 1
        };
        let JSONResult = {};
        JSONResult = processor.updateJSONResult(JSONResult, absentKeyCaseMatchPoint);
    
        expect(absentKeyCaseOutput).to.eql(JSONResult);  
        
        
        //test multiple match points

        let matchPoints = [
            {
                team: "TeamA",
                points: 3
            },
            {
                team: "TeamC",
                points: 1
            },
            {
                team: "TeamB",
                points: 1
            },
            {
                team: "TeamB",
                points: 1
            },
        ] as MatchPoint[]

        let multipleMatchPointResult = {
            "TeamC": 1
        };

        matchPoints.forEach(matchPoint => {
            multipleMatchPointResult = processor.updateJSONResult(multipleMatchPointResult, matchPoint);
        });

        expect({ TeamC: 2, TeamA: 3, TeamB: 2 }).to.eql(multipleMatchPointResult);
    }); 


    it('read from file', function() {
        const processor = new Processor(__dirname + '\\testFile.txt');
        const expectedFileContent = [
            "TeamA 1, TeamB 2",
            "TeamC 5, TeamD 3",
            "TeamE 89, TeamF 89",
            "TeamA 3, TeamB 2",
            "TeamC 5, TeamD 1",
            "TeamC 7, TeamD 2",
        ];

        let idx = 0;
        processor.getFileStream().on('line', function (line: string) {
            expect(line).equals(expectedFileContent[idx++]);
          });
        
      }); 

    it('process string', function() {
        const outcome = Processor.processString("Team1 7, Team2 9");
        const expectedOutcome = {
            team1: "Team1",
            score1: 7,
            team2: "Team2",
            score2: 9,
        } as MatchResult;
        expect(outcome).to.eql(expectedOutcome);
      }); 

    it('match outcome calculation', function() {
        const outcomeLoss = Processor.calculateMatchOutcome(1, 2)[0];
        expect(outcomeLoss).equal(MatchOutcome.LOSS);

        const outcomeWin = Processor.calculateMatchOutcome(2, 1)[0];
        expect(outcomeWin).equal(MatchOutcome.WIN);

        const outcomeDraw = Processor.calculateMatchOutcome(1, 1)[0];
        expect(outcomeDraw).equal(MatchOutcome.DRAW);
      }); 

    it('match points calculation from outcome', function() {
        const dummyMatchResult = {
            team1: "Team1",
            team2: "Team2",
            score1: 0,
            score2: 0,
        }
        const winLossPointsCalc = Processor.convertMatchOutcomeAndMatchResultToMatchPoints([MatchOutcome.WIN, MatchOutcome.LOSS], dummyMatchResult);
        const winLossPointsExpected = [
            {
                team: "Team1",
                points: 3,
            },
            {
                team: "Team2",
                points: 0,
            },
        ];
        expect(winLossPointsCalc).to.eql(winLossPointsExpected);

        const lossWinPointsCalc = Processor.convertMatchOutcomeAndMatchResultToMatchPoints([MatchOutcome.LOSS, MatchOutcome.WIN], dummyMatchResult);
        const lossWinPointsExpected = [
            {
                team: "Team1",
                points: 0,
            },
            {
                team: "Team2",
                points: 3,
            },
        ];
        expect(lossWinPointsCalc).to.eql(lossWinPointsExpected);

        const drawPointsCalc = Processor.convertMatchOutcomeAndMatchResultToMatchPoints([MatchOutcome.DRAW, MatchOutcome.DRAW], dummyMatchResult);
        const drawPointsExpected = [
            {
                team: "Team1",
                points: 1,
            },
            {
                team: "Team2",
                points: 1,
            },
        ];
        expect(drawPointsCalc).to.eql(drawPointsExpected);
    }); 
  });
