#!/usr/bin/env node

const prompts = require('prompts');
const kleur = require('kleur');
const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const { laboratoria } = require(path.join(process.cwd(), 'package.json'));
const runTests = require('./runTests');
const { createLoader, validateEmail, validatePassword } = require('./utils');
const { getToken, sendProgressToApi } = require('./api-service');

const questions = [
  {
    type: 'text',
    name: 'email',
    message: 'Tu correo:',
    validate: validateEmail,
  },
  {
    type: 'password',
    name: 'password',
    message: 'Tu contraseña',
    validate: validatePassword,
  },
];

const buildProgress = (testsData) => {
  const {
    unitId,
    partId,
    exerciseId,
    typeContent,
  } = laboratoria;

  const progressData = {
    unitId,
    partId,
    exerciseId,
    type: typeContent,
    preworkType: 'redesign-prework-fe',
    progress: {
      testResults: {
        ...testsData,
      },
      updatedAt: new Date(),
      /* Add completedAt property only if tests passed
          to save in BigQuery */
      ...(testsData.state === 'PASS' && { completedAt: new Date() }),
    },
  };

  return progressData;
};

function main() {
  return runTests()
    .then((testsData) => {
      console.log(kleur.bold().italic('Se terminó de correr los tests. A continuación completa los siguientes datos:'));
      return prompts(questions)
        .then((response) => {
          if (response.email && response.password) {
            const msg = kleur.bold().italic('Registrando progreso');
            /* start spinner animation */
            const interval = createLoader(msg);
            const progress = buildProgress(testsData);
            return getToken(response.email, response.password)
              .then((token) => sendProgressToApi(progress, token))
              .finally(() => {
                /* stop spinner animation */
                clearInterval(interval);
              });
          }
          throw new Error('El correo y contraseña ingresados no son válidos');
        });
    });
}

main()
  .then((successMessage) => console.log(kleur.green().bold(successMessage)))
  .catch((err) => console.log(kleur.red().bold(err.message)));

module.exports = {
  main,
  buildProgress,
};
