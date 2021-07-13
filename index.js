#!/usr/bin/env node

const prompts = require('prompts');
const kleur = require('kleur');
const path = require('path');
const validator = require('email-validator');

// eslint-disable-next-line import/no-dynamic-require
const { laboratoria } = require(path.join(process.cwd(), 'package.json'));
const runTests = require('./runTests');
const { createLoader } = require('./utils');
const { getToken, sendProgressToApi } = require('./api-service');

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
  runTests()
    .then((testsData) => {
      console.log(kleur.bold().italic('Se terminó de correr los tests. A continuación completa los siguientes datos:'));
      prompts(questions)
        .then((response) => {
          if (response.email && response.password) {
            const msg = kleur.bold().italic('Registrando progreso');
            /* start spinner animation */
            const interval = createLoader(msg);
            const progress = buildProgress(testsData);

            getToken(response.email, response.password)
              .then((token) => sendProgressToApi(progress, token))
              .then((successMessage) => {
                console.log(kleur.green().bold(successMessage));
              })
              .catch((err) => console.log(kleur.red().bold(err.message)))
              .finally(() => {
                /* stop spinner animation */
                clearInterval(interval);
              });
          }
        });
    });
}

main();
