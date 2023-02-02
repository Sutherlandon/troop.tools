module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/schedule',
        permanent: true,
      },
    ];
  },
};
