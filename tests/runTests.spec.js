const mockSpawn = require('mock-spawn');

// override child_process.spawn
const mySpawn = mockSpawn();
require('child_process').spawn = mySpawn;

mySpawn.sequence.add(function runner(cb) {
  // test the error handling of your library
  this.stdout.write('output data my library expects');
  this.stderr.write('FAIL ./suma.spec.js');
  this.stderr.write(`Test Suites: 1 failed, 1 total
  Tests:       1 failed, 1 skipped, 1 todo, 1 passed, 4 total
  Snapshots:   0 total
  Time:        1.30 s
  Ran all test suites.`);
  cb(0);
});

const runTests = require('../runTests');

describe('runTests', () => {
  it('Should return an object with tests data', (done) => {
    const response = {
      state: 'FAIL',
      stats: {
        suites: 1,
        tests: 4,
        passes: 1,
        pending: 2,
        failures: 1,
        start: '2021-06-23T17:51:43.377Z',
        end: '2021-06-23T17:51:46.711Z',
        duration: 1.30,
      },
    };

    return runTests()
      .then((resp) => {
        expect({
          ...resp,
          stats: {
            ...resp.stats,
            start: '2021-06-23T17:51:43.377Z',
            end: '2021-06-23T17:51:46.711Z',
          },
        }).toEqual(response);
        done();
      });
  });
});
