import React from 'react'
import ReactDOM from 'react-dom'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Background from '../components/Background'
import { VALUES, SQUARE_SIZE } from '../constants';

const Card = styled.div.attrs({ className: 'card' })`
  margin: 10px 0;
`;

export default class BlogPage extends React.Component {
  constructor() {
    super();
    this.state = {
      cols: [0],
      rows: [0]
    };
  }
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    const bound = el.getBoundingClientRect();
    this.setState({
      cols: Array(Math.ceil(bound.width / SQUARE_SIZE)).fill(0),
      rows: Array(Math.ceil(bound.height / SQUARE_SIZE)).fill(0)
    });
  }
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <section className="section" style={{ position: 'relative' }}>
        <Background rows={this.state.rows} cols={this.state.cols} />
        <div className="container">
          {posts
            .filter(post => post.node.frontmatter.templateKey === 'blog-post')
            .map(({ node: post }) => (
              <Card
                key={post.id}
              >
                <header className="card-header">
                  <div className="card-header-title">
                    <p className="title is-4">
                      <Link className="has-text-primary" to={post.fields.slug}>
                        {post.frontmatter.title}
                      </Link>
                    </p>
                    <p className="subtitle is-6">
                      {post.frontmatter.date}
                    </p>
                  </div>
                </header>
                <div className="card-content">
                  <div className="content">
                    {post.excerpt}
                    <br />
                    <br />
                    <Link className="button is-danger is-small" to={post.fields.slug}>
                      Keep Reading →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </section>
    )
  }
}

export const pageQuery = graphql`
  query IndexQuery {
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
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
