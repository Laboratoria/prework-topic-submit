const getToken = jest.fn().mockImplementation(() => Promise.resolve('faketoken123456'));
const sendProgressToApi = jest.fn()
  .mockImplementationOnce(() => Promise.resolve('success message'))
  .mockImplementationOnce(() => Promise.reject(new Error('error message when save progress.')));

module.exports = {
  getToken,
  sendProgressToApi,
};
