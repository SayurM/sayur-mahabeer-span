"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Processor_1 = require("../src/Processor");
var chai_1 = require("chai");
describe('Processor', function () {
    it('ranking array sorting', function () {
        var rankingJSON = {
            "TeamB": 4,
            "TeamC": 7,
            "TeamA": 4
        };
        var expectedOutput = [
            ["TeamC", 7],
            ["TeamA", 4],
            ["TeamB", 4],
        ];
        chai_1.expect(expectedOutput).to.eql(new Processor_1.Processor('').convertJSONToRankedArray(rankingJSON));
    });
    it('match point JSON generator', function () {
        var processor = new Processor_1.Processor(__dirname + '\\testFile.txt');
        var absentKeyCaseMatchPoint = {
            team: "TeamA",
            points: 1
        };
        var absentKeyCaseOutput = {
            "TeamA": 1
        };
        var JSONResult = {};
        JSONResult = processor.updateJSONResult(JSONResult, absentKeyCaseMatchPoint);
        chai_1.expect(absentKeyCaseOutput).to.eql(JSONResult);
        //test multiple match points
        var matchPoints = [
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
        ];
        var multipleMatchPointResult = {
            "TeamC": 1
        };
        matchPoints.forEach(function (matchPoint) {
            multipleMatchPointResult = processor.updateJSONResult(multipleMatchPointResult, matchPoint);
        });
        chai_1.expect({ TeamC: 2, TeamA: 3, TeamB: 2 }).to.eql(multipleMatchPointResult);
    });
    it('read from file', function () {
        var processor = new Processor_1.Processor(__dirname + '\\testFile.txt');
        var expectedFileContent = [
            "TeamA 1, TeamB 2",
            "TeamC 5, TeamD 3",
            "TeamE 89, TeamF 89",
            "TeamA 3, TeamB 2",
            "TeamC 5, TeamD 1",
            "TeamC 7, TeamD 2",
        ];
        var idx = 0;
        processor.getFileStream().on('line', function (line) {
            chai_1.expect(line).equals(expectedFileContent[idx++]);
        });
    });
    it('process string', function () {
        var outcome = Processor_1.Processor.processString("Team1 7, Team2 9");
        var expectedOutcome = {
            team1: "Team1",
            score1: 7,
            team2: "Team2",
            score2: 9,
        };
        chai_1.expect(outcome).to.eql(expectedOutcome);
    });
    it('match outcome calculation', function () {
        var outcomeLoss = Processor_1.Processor.calculateMatchOutcome(1, 2)[0];
        chai_1.expect(outcomeLoss).equal(Processor_1.MatchOutcome.LOSS);
        var outcomeWin = Processor_1.Processor.calculateMatchOutcome(2, 1)[0];
        chai_1.expect(outcomeWin).equal(Processor_1.MatchOutcome.WIN);
        var outcomeDraw = Processor_1.Processor.calculateMatchOutcome(1, 1)[0];
        chai_1.expect(outcomeDraw).equal(Processor_1.MatchOutcome.DRAW);
    });
    it('match points calculation from outcome', function () {
        var dummyMatchResult = {
            team1: "Team1",
            team2: "Team2",
            score1: 0,
            score2: 0,
        };
        var winLossPointsCalc = Processor_1.Processor.convertMatchOutcomeAndMatchResultToMatchPoints([Processor_1.MatchOutcome.WIN, Processor_1.MatchOutcome.LOSS], dummyMatchResult);
        var winLossPointsExpected = [
            {
                team: "Team1",
                points: 3,
            },
            {
                team: "Team2",
                points: 0,
            },
        ];
        chai_1.expect(winLossPointsCalc).to.eql(winLossPointsExpected);
        var lossWinPointsCalc = Processor_1.Processor.convertMatchOutcomeAndMatchResultToMatchPoints([Processor_1.MatchOutcome.LOSS, Processor_1.MatchOutcome.WIN], dummyMatchResult);
        var lossWinPointsExpected = [
            {
                team: "Team1",
                points: 0,
            },
            {
                team: "Team2",
                points: 3,
            },
        ];
        chai_1.expect(lossWinPointsCalc).to.eql(lossWinPointsExpected);
        var drawPointsCalc = Processor_1.Processor.convertMatchOutcomeAndMatchResultToMatchPoints([Processor_1.MatchOutcome.DRAW, Processor_1.MatchOutcome.DRAW], dummyMatchResult);
        var drawPointsExpected = [
            {
                team: "Team1",
                points: 1,
            },
            {
                team: "Team2",
                points: 1,
            },
        ];
        chai_1.expect(drawPointsCalc).to.eql(drawPointsExpected);
    });
});
