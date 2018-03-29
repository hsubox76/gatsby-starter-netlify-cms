import React from 'react'
import Content, { HTMLContent } from '../components/Content'
import Background from '../components/Background'

export const AboutPageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <section className="section" style={{ position: 'relative' }}>
      <Background />
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="hero is-info relative">
              <div className="hero-body">
                <div className="title">{title}</div>
              </div>
            </div>
            <div className="box relative white-transparent">
              <PageContent className="content" content={content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <AboutPageTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      content={post.html}
    />
  )
}

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
