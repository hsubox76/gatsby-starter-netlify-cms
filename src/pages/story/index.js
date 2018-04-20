import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

export default class StoryPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-10 is-offset-1">

              <div className="hero is-info relative">
                <div className="hero-body">
                  <div className="title">Story</div>
                </div>
              </div>

              {posts
                .filter(post => post.node.frontmatter.templateKey === 'book-chapter')
                .map(({ node: post }) => (
                  <div
                    className="box relative white-transparent"
                    key={post.index}
                  >
                    <div className="content">
                      <p>
                        <strong>
                          <Link to={post.fields.slug}>
                            {post.frontmatter.title}
                          </Link>
                        </strong>
                      </p>
                    </div>
                    <div className="content">
                      <p>{post.frontmatter.description}</p>
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
    );
  }
}

export const chapterQuery = graphql`
  query ChapterQuery {
    allMarkdownRemark(sort: { order: ASC, fields: [frontmatter___index] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 400)
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            description
            index
          }
        }
      }
    }
  }
`
