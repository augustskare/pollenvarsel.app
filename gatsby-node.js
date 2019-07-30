const path = require(`path`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allPollenvarsel {
        edges {
          node {
            slug
          }
        }
      }
    }
  `).then(result => {
    result.data.allPollenvarsel.edges.forEach(({ node }) => {
      createPage({
        path: node.slug,
        component: path.resolve(`./src/templates/region/index.js`),
        context: {
          slug: node.slug,
        },
      });
    });
  });
};
