const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              index
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    result.data.allMarkdownRemark.edges.forEach(edge => {
      const id = edge.node.id
      const index = edge.node.frontmatter.index || 0
      if (edge.node.frontmatter.templateKey === 'book-email' || edge.node.frontmatter.templateKey === 'book-chat') {
        return;
      }
      let templateFile = edge.node.frontmatter.templateKey;
      if (templateFile === 'story-post') {
        templateFile = 'blog-post';
      }
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(templateFile)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          index
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
