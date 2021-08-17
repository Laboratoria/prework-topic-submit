jest.mock('node-fetch');

const fetch = require('node-fetch');

const { Response } = jest.requireActual('node-fetch');

const { getToken, sendProgressToApi } = require('../api-service');

const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

describe('getToken', () => {
  const fakeEmail = 'test@test.test';
  const fakePassword = 'test123';
  const fakeResp = JSON.stringify({ token: fakeToken });
  const fakeError404 = JSON.stringify({ statusCode: 404 });
  const fakeError400 = JSON.stringify({ statusCode: 400 });

  /* Mocking fetch responses */
  fetch
    .mockReturnValueOnce(Promise.resolve(new Response(fakeResp)))
    .mockReturnValueOnce(Promise.resolve(new Response(fakeError404)))
    .mockReturnValueOnce(Promise.resolve(new Response(fakeError400)));

  it('Should be return a token', (done) => (
    getToken(fakeEmail, fakePassword)
      .then((resp) => {
        expect(resp).toBe(fakeToken);
        done();
      })));

  it('Should be return an error message with wrong email', (done) => (
    getToken(fakeEmail, fakePassword)
      .catch((err) => {
        expect(err.message).toBe(`No se encontró ningún usuario con email: ${fakeEmail}`);
        done();
      })));

  it('Should be return an error message with wrong password', (done) => (
    getToken(fakeEmail, fakePassword)
      .catch((err) => {
        expect(err.message).toBe('Contraseña inválida');
        done();
      })));
});

describe('sendProgressToApi', () => {
  const bodyRequest = {
    unitId: '',
    partId: '',
    exerciseId: '',
    type: 'practice',
    preworkType: 'redesign-prework-fe',
    progress: {
      testResults: {
        state: 'FAIL',
        stats: {
          suites: 1,
          tests: 4,
          passes: 1,
          pending: 2,
          failures: 1,
          start: '2021-06-23T17:51:43.377Z',
          end: '2021-06-23T17:51:46.711Z',
          duration: 1.30,
        },
      },
      updatedAt: '2021-06-23T17:51:43.377Z',
      completedAt: '2021-06-23T17:51:43.377Z',
    },
  };
  const fakeError404 = { status: 404, message: 'not found cohort membership' };
  const fakeSuccessResponse = { status: 204 };

  fetch
    .mockReturnValueOnce(Promise.resolve(fakeSuccessResponse))
    .mockReturnValueOnce(Promise.resolve(fakeError404));

  it('Should be return a success message', (done) => sendProgressToApi(bodyRequest, fakeToken)
    .then((resp) => {
      expect(resp).toBe('Listo! Tu progreso ha sido guardado de forma exitosa.');
      done();
    }));

  it('Should be a error message', (done) => (
    sendProgressToApi(bodyRequest, fakeToken)
      .catch((err) => {
        expect(err.message).toBe('Hubo un error al guardar el progreso. Vuelve a intentarlo. Error: not found cohort membership');
        done();
      })));
});
