const fetch = require('node-fetch');

const getToken = (email, password) => {
  const body = { email, password };
  const errorMessages = {
    404: `No se encontró ningún usuario con email: ${email}`,
    400: 'Contraseña inválida',
  };
  return fetch('https://laboratoria-la-staging.web.app/auth', {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.statusCode) {
        throw new Error(errorMessages[json.statusCode]);
      }
      return json.token;
    });
};

const sendProgressToApi = (data, token) => fetch('https://laboratoria-la-staging.web.app/dashboards/redesign-prework-fe', {
  method: 'PUT',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((json) => {
    if (json.statusCode !== 204) {
      throw new Error(json.message);
    }
  })
  .catch((err) => {
    throw new Error(`Hubo un error al guardar el progreso. Vuelve a intentarlo. ${err}`);
  });

module.exports = {
  getToken,
  sendProgressToApi,
};
