const getToken = jest.fn().mockImplementation(() => Promise.resolve('faketoken123456'));
const sendProgressToApi = jest.fn(() => Promise.resolve('success message'));

module.exports = {
  getToken,
  sendProgressToApi,
};
