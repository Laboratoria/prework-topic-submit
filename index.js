#!/usr/bin/env node
const kleur = require('kleur');

const submitProgress = require('./submitProgress');

submitProgress()
  .then((successMessage) => console.log(kleur.green().bold(successMessage)))
  .catch((err) => console.log(kleur.red().bold(err.message)));
