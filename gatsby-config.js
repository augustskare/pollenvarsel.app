require('dotenv').config({
  path: '.env',
});

module.exports = {
  siteMetadata: {
    title: 'Pollenvarsel',
    description: '',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-pollenvarsel',
      options: {
        api_key: process.env.POLLENVARSEL_API_KEY,
      },
    },
  ],
};
