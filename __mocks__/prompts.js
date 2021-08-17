const mockPrompts = jest.fn(() => Promise.resolve({ email: 'test@test.com', password: 'test123' }));

module.exports = mockPrompts;
