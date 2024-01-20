module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/schedule',
        permanent: false,
      }
    ];
  }
};
