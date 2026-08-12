export default {
  createTransport: () => {
    return {
      sendMail: async (options) => {
        return { messageId: 'mocked-email-message-id' };
      },
    };
  },
};
