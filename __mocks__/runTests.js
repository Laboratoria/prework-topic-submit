const mockRunTests = jest.fn().mockImplementation(() => Promise.resolve({
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
}));

module.exports = mockRunTests;
