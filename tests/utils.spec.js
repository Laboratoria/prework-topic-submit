const logUpdate = require('log-update');

jest.mock('log-update');
jest.useFakeTimers();

const { createLoader } = require('../utils');

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
