require('dotenv').config({
  path: '.env',
});

const siteMetadata = {
  title: 'Pollenvarsel',
  description: 'Daglig pollenvarsel for hele Norge',
};

module.exports = {
  siteMetadata,
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-pollenvarsel',
      options: {
        api_key: process.env.POLLENVARSEL_API_KEY,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteMetadata.title,
        description: siteMetadata.description,
        short_name: siteMetadata.title,
        start_url: '/',
        background_color: '#f5f6f7',
        theme_color: '#FFF',
        display: 'standalone',
        icon: 'src/favicon.png',
        crossOrigin: 'use-credentials',
        icon_options: {
          purpose: 'maskable',
        },
      },
    },
  ],
};
