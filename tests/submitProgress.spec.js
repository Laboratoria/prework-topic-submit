jest.mock('prompts');
jest.mock('../package.json');
jest.mock('../runTests.js');
jest.mock('../api-service.js');

const prompts = require('prompts');

const { buildProgress, submitProgress } = require('../submitProgress');
const { sendProgressToApi } = require('../api-service');

describe('buildProgress', () => {
  it('should return an object with progress data & without completedAt property', () => {
    const fakeTestsData = {
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
    const fakeProgressData = {
      unitId: '03-prework',
      partId: '06-js-basics',
      exerciseId: '02-data-types-numbers',
      type: 'practice',
      preworkType: 'redesign-prework-fe',
      progress: {
        testResults: { ...fakeTestsData },
        updatedAt: '2021-06-23T17:51:43.377Z',
      },
    };
    const progressData = buildProgress(fakeTestsData);
    const result = {
      ...progressData,
      progress: {
        ...progressData.progress,
        updatedAt: fakeProgressData.progress.updatedAt,
      },
    };
    expect(result).toEqual(fakeProgressData);
  });

  it('should return an object with progress data & with completedAt property', () => {
    const fakeTestsData = {
      state: 'PASS',
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
    const fakeProgressData = {
      unitId: '03-prework',
      partId: '06-js-basics',
      exerciseId: '02-data-types-numbers',
      type: 'practice',
      preworkType: 'redesign-prework-fe',
      progress: {
        testResults: { ...fakeTestsData },
        updatedAt: '2021-06-23T17:51:43.377Z',
        completedAt: '2021-06-23T17:51:43.377Z',
      },
    };
    const progressData = buildProgress(fakeTestsData);
    const result = {
      ...progressData,
      progress: {
        ...progressData.progress,
        updatedAt: fakeProgressData.progress.updatedAt,
        completedAt: fakeProgressData.progress.completedAt,
      },
    };
    expect(result).toEqual(fakeProgressData);
  });
});

describe('submitProgress', () => {
  it('should return an error message with wrong email & password', (done) => {
    prompts
      .mockReturnValueOnce(Promise.resolve({ email: '', password: '' }));

    submitProgress()
      .catch((err) => {
        expect(err.message).toBe('El correo y contraseña ingresados no son válidos');
        done();
      });
  });

  it('should return a success message', (done) => {
    submitProgress()
      .then((resp) => {
        expect(resp).toBe('success message');
        done();
      });
  });

  it('should return a error message when save progress', (done) => {
    sendProgressToApi
      .mockImplementationOnce(() => Promise.reject(new Error('error message when save progress.')));

    submitProgress()
      .catch((err) => {
        expect(err.message).toBe('error message when save progress.');
        done();
      });
  });
});
