import React from 'react'
import Helmet from 'react-helmet'
import Content, { HTMLContent } from '../components/Content'

export const BookChapterTemplate = ({
  content,
  contentComponent,
  title,
  helmet,
  emails,
  posts
}) => {
  const PostContent = contentComponent || Content

  console.log('emails', emails);
  const originalBits = content.split('<p>!!!!!!!email!!!!!!!</p>');
  const allBits = [];
  let emailIndex = 0;

  originalBits.forEach((bit, index) => {
    allBits.push(bit);
    if (index < originalBits.length - 1) {
      allBits.push(`<div class="box">${emails[emailIndex++].html}</div>`);
    }
  })
  const insertedContent = allBits.join('');
  return (
    <section className="section" style={{ position: 'relative' }}>
      {helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="box relative white-transparent-2">
                <h1 className="title is-size-2 has-text-primary has-text-weight-bold is-bold-light">
                  {title}
                </h1>
                <PostContent content={insertedContent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default props => {
  const { markdownRemark: post, allMarkdownRemark: { edges: emails } } = props.data

  return (
    <BookChapterTemplate
      content={post.html}
      contentComponent={HTMLContent}
      description={''}
      helmet={<Helmet title={`Blog | ${post.frontmatter.title}`} />}
      title={post.frontmatter.title}
      emails={emails.map(email => email.node)}
    />
  )
}

export const pageQuery = graphql`
  query BookChapterById($id: String!, $index: Int!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      htmlAst
      frontmatter {
        title
        emails
      }
    }
    allMarkdownRemark(filter: { frontmatter:  { chapterIndex: { eq: $index } } }) {
      edges {
        node {
          id
          html
        }
      }
    }
  }
`