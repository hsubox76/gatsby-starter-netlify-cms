import CMS from 'netlify-cms'

import AboutPagePreview from './preview-templates/AboutPagePreview'
import BlogPostPreview from './preview-templates/BlogPostPreview'

CMS.registerPreviewStyle('/styles.css')
CMS.registerPreviewTemplate('blog', BlogPostPreview)
CMS.registerPreviewTemplate('stories', BlogPostPreview)
CMS.registerPreviewTemplate('about', AboutPagePreview)