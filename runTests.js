const { spawn } = require('child_process');
const kleur = require('kleur');
const { createLoader } = require('./utils');

const runTests = (callback) => {
  const testsData = {
    state: null, // string: 'PASS' OR 'FAIL'
    stats: {
      suites: 0, // number
      tests: 0, // number
      passes: 0, // number
      pending: 0, // number
      failures: 0, // number
      start: null, // Date
      end: null, // Date
      duration: 0, // number
    },
  };

  const calculateTestsStats = (outputText) => {
    let str = outputText;
    const suites = parseInt(str.slice(str.indexOf('total') - 1, str.indexOf('total')), 10);
    str = str.slice(str.indexOf('Tests:'));
    const tests = parseInt(str.slice(str.indexOf('total') - 1, str.indexOf('total')), 10);
    const passes = parseInt(str.slice(str.indexOf('passed') - 1, str.indexOf('passed')), 10);
    const failures = parseInt(str.slice(str.indexOf('failed') - 1, str.indexOf('failed')), 10);
    const skippedTests = parseInt(str.slice(str.indexOf('skipped') - 1, str.indexOf('skipped')), 10);
    const todoTests = parseInt(str.slice(str.indexOf('todo') - 1, str.indexOf('todo')), 10);
    const pending = skippedTests + todoTests;
    str = str.slice(str.indexOf('Time:'));
    const duration = parseFloat(str.slice('Time:'.length, str.indexOf('s')));
    return {
      ...(suites && { suites }),
      ...(tests && { tests }),
      ...(passes && { passes }),
      ...(failures && { failures }),
      ...(pending && { pending }),
      duration,
    };
  };

  let interval;

  // run test script
  const child = spawn('npm', ['test']);
  child.stdout.on('data', (data) => { // TODO: add spinner
    const msg = kleur.bold().italic('Corriendo tests');
    interval = createLoader(msg);
    testsData.stats.start = new Date();
    console.log(`${data}`);
  });

  child.stderr.on('data', (data) => {
    // TODO: add values to testsData object
    const outputText = data.toString().replace(/ /g, '');
    if (outputText.includes('PASS') || outputText.includes('FAIL')) {
      testsData.state = outputText.slice(0, 4);
    } else if (outputText.includes('TestSuites:')) {
      testsData.stats = {
        ...testsData.stats,
        ...calculateTestsStats(outputText),
      };
    }
  });

  return child.on('close', () => {
    testsData.stats.end = new Date();
    clearInterval(interval);
    callback(testsData);
  });
};

module.exports = runTests;
