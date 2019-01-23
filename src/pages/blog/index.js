import React from 'react'
import Link from 'gatsby-link'
import Layout from "../../components/layout"

export default class BlogPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
      <section className="section" style={{ position: 'relative' }}>
        <div className="container">
          <div className="columns">
            <div className="column is-10 is-offset-1">
            <div className="hero is-primary relative">
              <div className="hero-body">
                <div className="title">Blog Posts</div>
              </div>
            </div>
            {posts
              .filter(post => post.node.frontmatter.templateKey === 'blog-post')
              .map(({ node: post }) => (
                <div
                  className="box relative white-transparent"
                  key={post.id}
                >
                  <div className="content">
                    <p>
                      <strong>
                        <Link to={post.fields.slug}>
                          {post.frontmatter.title}
                        </Link>
                      </strong>
                      <span> &bull; </span>
                      <small>
                        {post.frontmatter.date}
                      </small>
                    </p>
                  </div>
                  <div className="content">
                    {post.frontmatter.excerpt || post.excerpt}
                    <br />
                    <br />
                    <Link className="button is-danger is-small" to={post.fields.slug}>
                      Keep Reading →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </Layout>
    )
  }
}

export const blogQuery = graphql`
  query BlogQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            excerpt
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
