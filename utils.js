const cliSpinners = require('cli-spinners');
const logUpdate = require('log-update');
const validator = require('email-validator');
const kleur = require('kleur');

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

const showTestsResult = (data) => {
  const {
    state,
    stats: {
      suites,
      tests,
      passes,
      pending,
      failures,
      duration,
    },
  } = data;
  const finalResult = (state === 'PASS' ? kleur.green() : kleur.red()).bold(`State: ${state}`);
  const message = `${finalResult}\n
  ${kleur.blue().bold(`* Test Suites: ${suites}`)}
  ${kleur.blue().bold(`* Tests: ${tests}`)}
  ${kleur.green().bold(`* Passes: ${passes}`)}
  ${kleur.yellow().bold(`* Pending: ${pending}`)}
  ${kleur.red().bold(`* Failures: ${failures}`)}
  ${kleur.blue().bold(`* Time: ${duration}s`)}
  `;
  return message;
};

module.exports = {
  createLoader,
  validateEmail,
  validatePassword,
  showTestsResult,
};
