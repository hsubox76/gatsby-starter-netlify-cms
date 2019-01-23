import React from 'react'
import Link from 'gatsby-link'
import Layout from "../components/Layout"

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <Layout>
      <section className="section" style={{ position: 'relative' }}>
        <div className="columns">
          <div className="column is-two-fifths">
            <div className="box is-primary relative">
                <h1 className="title">
                  Speaking
                </h1>
                <h2 className="subtitle">
                  Recent & Upcoming Talks
                </h2>
                <div className="box">
                  <a href="https://conf.reactjs.org/">
                    Talk @ ReactConf '18 (10/25/2018)
                  </a>
                  <div>"Building Todo The Game In A Cloud-Only Dev Environment"</div>
                  <div>
                    <a href="https://youtu.be/kVSTKD13gos"><span className="fas fa-video"></span> Video</a>
                  </div>
                </div>
                <div className="box">
                  <a href="https://revolutionconf.com/">
                    Talk @ RevolutionConf '18 (5/17/2018)
                  </a>
                  <div>"Building Browser Charts From Scratch: Why?? and How"</div>
                </div>
                <div className="box">
                  <a href="https://www.reactathon.com/">
                    Talk @ Reactathon (3/22/2018)
                  </a>
                  <div>"Charts from Scratch in React"</div>
                </div>
                <div className="box">
                  <a href="http://nodevember.org/">
                    Talk @ Nodevember (11/28/2017)
                  </a>
                  <div>"React + Charts, With And Without Libraries"</div>
                  <div>
                    <a href="https://youtu.be/vHQ_kwNwqgQ"><span className="fas fa-video"></span> Video</a>
                    <span> | </span>
                    <a href="https://www.slideshare.net/secret/eyklOqWNAM9rJU"><span className="fa fa-window-maximize"></span> Slides</a>
                  </div>
                </div>
            </div>
            <div className="box is-primary relative">
                <h1 className="title">
                  Social
                </h1>
                <div className="box">
                  <a className="has-text-info" href="https://github.com/hsubox76/">
                    <div className="icon is-large">
                      <i className="fab fa-2x fa-github" />
                    </div>
                  </a>
                  <a className="has-text-info" href="https://www.linkedin.com/in/christinahsuholland">
                    <div className="icon is-large">
                      <i className="fab fa-2x fa-linkedin" />
                    </div>
                  </a>
                  <a className="has-text-info" href="https://twitter.com/americanwombat">
                    <div className="icon is-large">
                      <i className="fab fa-2x fa-twitter" />
                    </div>
                  </a>
                </div>
            </div>
          </div>
          <div className="column is-three-fifths">
            <div className="box is-primary relative">
              <h1 className="title">
                Recent Posts
              </h1>
            </div>
            <div className="content relative">
              {posts
                .filter(post => post.node.frontmatter.templateKey === 'blog-post')
                .map(({ node: post }) => (
                  <div
                    className="box"
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

export const blogPostsQuery = graphql`
  query BlogPostsQuery {
    allMarkdownRemark(
      filter: {
          frontmatter: {
            templateKey: { eq: "blog-post" }
          }
      }
      limit: 3
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
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