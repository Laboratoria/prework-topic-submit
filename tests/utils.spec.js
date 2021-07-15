const kleur = require('kleur');
const logUpdate = require('log-update');

jest.mock('log-update');
jest.useFakeTimers();

const {
  createLoader, validateEmail, validatePassword, showTestsResult,
} = require('../utils');

describe('createLoader', () => {
  it('Should be return an interval id', () => {
    const message = 'Hello World';
    const interval = createLoader(message);
    expect(typeof interval).toBe('number');
    expect(setInterval).toHaveBeenCalledTimes(1);
    /* cli-spinners return an interval value equal to 80
      https://github.com/sindresorhus/cli-spinners#usage */
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 80);
    // run setInterval callback
    jest.runOnlyPendingTimers();

    expect(logUpdate).toBeCalled();
    expect(logUpdate).toHaveBeenCalledTimes(1);
    expect(logUpdate.mock.calls[0][0].includes(message)).toBe(true);
  });
});

describe('validateEmail', () => {
  it('soulb be return "Por favor indica tu correo" with a wrong email', () => {
    expect(validateEmail()).toBe('Por favor indica tu correo');
    expect(validateEmail('email@withoutformat')).toBe('Por favor indica tu correo válido');
  });

  it('soulb be return TRUE with a valid email', () => {
    expect(validateEmail('test@test.test')).toBe(true);
  });
});

describe('validatePassword', () => {
  it('should return "Por favor indica tu correo" with a wrong email', () => {
    expect(validatePassword()).toBe('Por favor indica tu contraseña');
  });

  it('should return TRUE with a valid email', () => {
    expect(validatePassword('fakepassword')).toBe(true);
  });
});

describe('showTestsResult', () => {
  it('should return a message with tests data', () => {
    const tests = {
      state: 'PASS',
      stats: {
        suites: 1,
        tests: 4,
        passes: 4,
        pending: 0,
        failures: 0,
        start: '2021-06-23T17:51:43.377Z',
        end: '2021-06-23T17:51:46.711Z',
        duration: 1.30,
      },
    };
    const messageExpected = `${kleur.green().bold('State: PASS')}\n
    ${kleur.blue().bold('* Test Suites: 1')}
    ${kleur.blue().bold('* Tests: 4')}
    ${kleur.green().bold('* Passes: 4')}
    ${kleur.yellow().bold('* Pending: 0')}
    ${kleur.red().bold('* Failures: 0')}
    ${kleur.blue().bold('* Time: 1.3s')}
    `.replace(/\s/g, '');
    expect(showTestsResult(tests).replace(/\s/g, '')).toEqual(messageExpected);
  });
});
