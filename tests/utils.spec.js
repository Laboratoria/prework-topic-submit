const logUpdate = require('log-update');

jest.mock('log-update');
jest.useFakeTimers();

const { createLoader, validateEmail, validatePassword } = require('../utils');

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
  it('soulb be return "Por favor indica tu correo" with a wrong email', () => {
    expect(validatePassword()).toBe('Por favor indica tu contraseña');
  });

  it('soulb be return TRUE with a valid email', () => {
    expect(validatePassword('fakepassword')).toBe(true);
  });
});
