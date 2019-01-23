import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Navbar from './Navbar'
import Background from '../components/Background'
import '../layouts/all.sass'

const Layout = ({ children }) => (
  <div>
    <Background />
    <Helmet title="Christina Holland" />
    <Navbar />
    <div className="container">{children}</div>
  </div>
)

Layout.propTypes = {
  children: PropTypes.object,
}

export default Layout
