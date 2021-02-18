"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchOutcome = exports.Processor = void 0;
var Processor = /** @class */ (function () {
    function Processor(filePath) {
        this.filePath = filePath;
        this.renderResults = function (array) {
            var position = 1;
            var previousScore = array[0][1];
            array.forEach(function (element) {
                if (previousScore !== element[1])
                    position++;
                previousScore = element[1];
                console.log(position + ". " + element[0] + " " + element[1] + " pts");
            });
        };
    }
    Processor.prototype.process = function () {
        var _this = this;
        console.log("processing...");
        var JSONOutput = {};
        var fileStream = this.getFileStream();
        fileStream.on('line', function (line) {
            var matchResult = Processor.processString(line);
            var matchPoints = Processor.calculatePointsForMatch(matchResult);
            matchPoints.forEach((function (matchPoint) {
                JSONOutput = _this.updateJSONResult(JSONOutput, matchPoint);
            }));
        });
        fileStream.on('close', function () {
            _this.renderResults(_this.convertJSONToRankedArray(JSONOutput));
        });
    };
    Processor.prototype.convertJSONToRankedArray = function (json) {
        var arr = Object.keys(json).map(function (key) { return [key, json[key]]; });
        return this.sortArray(arr);
    };
    Processor.prototype.sortArray = function (inputArray) {
        var data = __spreadArrays(inputArray);
        return data.sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); });
    };
    Processor.prototype.updateJSONResult = function (inputJSON, matchPoint) {
        var JSONResult = __assign({}, inputJSON);
        if (!JSONResult[matchPoint.team])
            JSONResult[matchPoint.team] = 0;
        JSONResult[matchPoint.team] = JSONResult[matchPoint.team] + matchPoint.points;
        return JSONResult;
    };
    Processor.prototype.getFileStream = function () {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(this.filePath)
        });
        return lineReader;
    };
    Processor.calculateMatchOutcome = function (subjectScore, oppositionScore) {
        if (subjectScore > oppositionScore)
            return [MatchOutcome.WIN, MatchOutcome.LOSS];
        else if (subjectScore < oppositionScore)
            return [MatchOutcome.LOSS, MatchOutcome.WIN];
        else
            return [MatchOutcome.DRAW, MatchOutcome.DRAW];
    };
    Processor.convertMatchOutcomeAndMatchResultToMatchPoints = function (matchOutcome, matchResult) {
        var pointsMap = new Map([
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
    };
    Processor.calculatePointsForMatch = function (matchResult) {
        var matchOutcome = Processor.calculateMatchOutcome(matchResult.score1, matchResult.score2);
        return this.convertMatchOutcomeAndMatchResultToMatchPoints(matchOutcome, matchResult);
    };
    Processor.processString = function (inputString) {
        var result = {};
        var splitStrings = inputString.split(", ");
        var subsplit1 = splitStrings[0].split(" ");
        result.team1 = subsplit1[0];
        result.score1 = parseInt(subsplit1[1]);
        var subsplit2 = splitStrings[1].split(" ");
        result.team2 = subsplit2[0];
        result.score2 = parseInt(subsplit2[1]);
        return result;
    };
    return Processor;
}());
exports.Processor = Processor;
var MatchOutcome;
(function (MatchOutcome) {
    MatchOutcome[MatchOutcome["WIN"] = 0] = "WIN";
    MatchOutcome[MatchOutcome["LOSS"] = 1] = "LOSS";
    MatchOutcome[MatchOutcome["DRAW"] = 2] = "DRAW";
})(MatchOutcome = exports.MatchOutcome || (exports.MatchOutcome = {}));
