const prompts = require('prompts');
const kleur = require('kleur');
const cliSpinners = require('cli-spinners');
const logUpdate = require('log-update');
const validator = require('email-validator');

const questions = [
  {
    type: 'text',
    name: 'email',
    message: 'Tu correo:',
    validate: (email) => {
      if (!email) {
        return 'Por favor indica tu correo';
      }
      if (!validator.validate(email)) {
        return 'Por favor indica tu correo válido';
      }
      return true;
    },
  },
  {
    type: 'password',
    name: 'password',
    message: 'Tu contraseña',
    validate: (password) => (!password ? 'Por favor indica tu contraseña' : true),
  },
];

(async () => {
  // const response = await prompts(questions);
  await prompts(questions);

  let i = 0;
  const msg = kleur.bold().italic('Registrando progreso');
  const spinner = cliSpinners.dots;
  const interval = setInterval(() => {
    const { frames } = spinner;
    // eslint-disable-next-line no-plusplus
    logUpdate(`${frames[i = ++i % frames.length]} ${msg}`);
  }, spinner.interval);

  setTimeout(() => {
    clearInterval(interval);
    console.log(kleur.green().bold('Listo!'));
  }, 2000);
})();
