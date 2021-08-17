const fetch = require('node-fetch');

const urlAPI = process.env.URL_API || 'http://localhost:5000';

const getToken = (email, password) => {
  const body = { email, password };
  const errorMessages = {
    404: `No se encontró ningún usuario con email: ${email}`,
    400: 'Contraseña inválida',
  };
  return fetch(`${urlAPI}/auth`, {
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

const sendProgressToApi = (data, token) => fetch(`${urlAPI}/dashboards/redesign-prework-fe`, {
  method: 'PUT',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})
  .then((json) => {
    if (json.status !== 204) {
      throw new Error(json.message);
    }
    return 'Listo! Tu progreso ha sido guardado de forma exitosa.';
  })
  .catch((err) => {
    throw new Error(`Hubo un error al guardar el progreso. Vuelve a intentarlo. ${err}`);
  });

module.exports = {
  getToken,
  sendProgressToApi,
};
