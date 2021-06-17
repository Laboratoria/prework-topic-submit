const cliSpinners = require('cli-spinners');
const logUpdate = require('log-update');

const createLoader = (message) => {
  let i = 0;
  const spinner = cliSpinners.dots;
  const interval = setInterval(() => {
    const { frames } = spinner;
    // eslint-disable-next-line no-plusplus
    logUpdate(`${frames[i = ++i % frames.length]} ${message}`);
  }, spinner.interval);
  return interval;
};

module.exports = {
  createLoader,
};
