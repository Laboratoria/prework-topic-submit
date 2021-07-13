const cliSpinners = require('cli-spinners');
const logUpdate = require('log-update');
const validator = require('email-validator');

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

const validateEmail = (email) => {
  if (!email) {
    return 'Por favor indica tu correo';
  }
  if (!validator.validate(email)) {
    return 'Por favor indica tu correo válido';
  }
  return true;
};

const validatePassword = (password) => (!password ? 'Por favor indica tu contraseña' : true);

module.exports = {
  createLoader,
  validateEmail,
  validatePassword,
};
