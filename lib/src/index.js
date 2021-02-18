#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
var Processor_1 = require("./Processor");
clear();
console.log(chalk.red(figlet.textSync('League Ranking Table Generator', { horizontalLayout: 'full' })));
program
    .version('0.0.1')
    .description("A simple CLI tool to generate league ranking table")
    .parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
else {
    var processor = new Processor_1.Processor(process.argv[2]);
    processor.process();
}
