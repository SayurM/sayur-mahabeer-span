#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

import { Processor } from './Processor';

clear();
console.log(
  chalk.red(
    figlet.textSync('League Ranking Table Generator', { horizontalLayout: 'full' })
  )
);

program
  .version('0.0.1')
  .description("A simple CLI tool to generate league ranking table")
  .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
  else{
      const processor = new Processor(process.argv[2]);
      processor.process();
  }

