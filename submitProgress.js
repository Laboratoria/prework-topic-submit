const prompts = require('prompts');
const kleur = require('kleur');
const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const { laboratoria } = require(path.join(process.cwd(), 'package.json'));
const runTests = require('./runTests');
const {
  createLoader, validateEmail, validatePassword, showTestsResult,
} = require('./utils');
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
    courseId,
    unitId,
    partId,
    exerciseId,
    typeContent,
  } = laboratoria;

  const progressData = {
    courseId,
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
      code: 'no code',
      /* Add completedAt property only if tests passed
          to save in BigQuery */
      ...(testsData.state === 'PASS' && { completedAt: new Date() }),
    },
  };

  return progressData;
};

function submitProgress() {
  console.log(kleur.bold().italic('A continuación completa los siguientes datos:'));
  return prompts(questions)
    .then((response) => {
      if (response.email && response.password) {
        let interval;
        return getToken(response.email, response.password)
          .then((token) => Promise.all([runTests(), token]))
          .then(([testsData, token]) => {
            console.log(kleur.bold(`Se terminó de correr los tests, estos son los resultados:\n\n${showTestsResult(testsData)}`));
            const msg = kleur.bold().italic('Registrando progreso');
            /* start spinner animation */
            interval = createLoader(msg);
            const progress = buildProgress(testsData);
            return sendProgressToApi(progress, token);
          })
          .finally(() => {
          /* stop spinner animation */
            clearInterval(interval);
          });
      }
      throw new Error('El correo y contraseña ingresados no son válidos');
    });
}

module.exports = {
  submitProgress,
  buildProgress,
};
