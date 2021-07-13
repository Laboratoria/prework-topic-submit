jest.mock('prompts');
jest.mock('../package.json');
jest.mock('../runTests.js');
jest.mock('../api-service.js');

const prompts = require('prompts');

const { buildProgress, main } = require('..');

describe('buildProgress', () => {
  it('should be return an object with progress data', () => {
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

describe('main', () => {
  it('should be return an error message with wrong email & password', (done) => {
    prompts
      .mockReturnValueOnce(Promise.resolve({ email: '', password: '' }));

    main()
      .catch((err) => {
        expect(err.message).toBe('El correo y contraseña ingresados no son válidos');
        done();
      });
  });

  it('should be return a success message', (done) => {
    prompts
      .mockReturnValueOnce(Promise.resolve({ email: 'test@test', password: 'test123' }));

    main()
      .then((resp) => {
        expect(resp).toBe('success message');
        done();
      });
  });

  it('should be return a error message when save progress', (done) => {
    prompts
      .mockReturnValueOnce(Promise.resolve({ email: 'test@test', password: 'test123' }));

    main()
      .catch((err) => {
        expect(err.message).toBe('error message when save progress.');
        done();
      });
  });
});
