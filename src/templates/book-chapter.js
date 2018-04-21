import React from 'react'
import Helmet from 'react-helmet'
import Content, { HTMLContent } from '../components/Content'

export const BookChapterTemplate = ({
  content,
  contentComponent,
  title,
  helmet,
  embeds,
  posts
}) => {
  const PostContent = contentComponent || Content

  console.log('embeds', embeds);
  const originalBits = content.split(/\<p\>\!(embed-\w+-\d)\!<\/p\>/);
  console.log(originalBits);
  const allElements = [];

  originalBits.forEach((bit, index) => {
    if (bit.includes("embed")) {
      const tokenParts = bit.split('-');
      const embedIndex = tokenParts[tokenParts.length - 1];
      // coerce string to number
      const embed = embeds.find(embed => embed.frontmatter.embedIndex == embedIndex);
      if (embed) {
        console.log(embed.frontmatter.templateKey);
        let embedElement = null;
        if (embed.frontmatter.templateKey === 'book-email') {
          embedElement = (
            <div className="box email-container" key={index}>
              <div className="content">
                <p>From: {embed.frontmatter.from}</p>
                <p>To: {embed.frontmatter.to}</p>
                <p>Subject: {embed.frontmatter.subject}</p>
              </div>
              <div className="content"><PostContent content={embed.html} /></div>
            </div>
          );
        } else if (embed.frontmatter.templateKey === 'book-chat') {
          const ast = embed.htmlAst;
          let currentUserName = '';
          const lines = ast.children
            .filter(child => child.type === 'element')
            .map(child => {
              const userName = child.children[0].children[0].value;
              let showUserName = true;
              if (userName === currentUserName) {
                showUserName = false;
              }
              currentUserName = userName;
              const chatWords = child.children[1].value;
              if (showUserName) {
                return (
                  <div className="chat-line-group">
                    <div>{userName}:</div>
                    <div>{chatWords}</div>
                  </div>
                );
              }
              return (
                <div className="chat-line">
                  {chatWords}
                </div>
              );
            });
          embedElement = (
            <div className="box chat-container" key={index}>
              <div className="content">{lines}</div>
            </div>
          );
        }
        allElements.push(embedElement);
      } else {
        console.error("Couldn't find embed number " + embedIndex);
      }
    } else {
      allElements.push(<PostContent key={index} className="content" content={bit} />);
    }
  })
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
                {allElements}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default props => {
  const { markdownRemark: post, allMarkdownRemark: { edges: embeds } } = props.data

  return (
    <BookChapterTemplate
      content={post.html}
      contentComponent={HTMLContent}
      description={''}
      helmet={<Helmet title={`Blog | ${post.frontmatter.title}`} />}
      title={post.frontmatter.title}
      embeds={embeds.map(embed => embed.node)}
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
      }
    }
    allMarkdownRemark(filter: { frontmatter:  { chapterIndex: { eq: $index } } }) {
      edges {
        node {
          id
          html
          htmlAst
          frontmatter {
            templateKey
            to
            from
            subject
            embedIndex
          }
        }
      }
    }
  }
`