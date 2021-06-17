#!/usr/bin/env node

const prompts = require('prompts');
const kleur = require('kleur');
const path = require('path');
const validator = require('email-validator');
const runTests = require('./runTests');
const { createLoader } = require('./utils');

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

function main() {
  runTests((testsData) => {
    console.log(kleur.bold().italic('Se terminó de correr los tests. A continuación completa los siguientes datos:'));
    prompts(questions)
      .then((response) => {
        if (response.email && response.password) {
          const msg = kleur.bold().italic('Registrando progreso');
          const interval = createLoader(msg);

          setTimeout(() => {
            clearInterval(interval);
            const package = require(path.join(process.cwd(), 'package.json'));
            console.log(package);
            console.log(kleur.green().bold('Listo!'));
          }, 1500);
        }
      });
  });
}

main();
