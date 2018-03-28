import React from 'react'
import Link from 'gatsby-link'

import github from '../img/github-icon.svg'
import logo from '../img/logo.svg'

const Navbar = () => (
  <nav className="navbar">
    <div className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          Christina Hsu Holland
        </Link>
      </div>
      <div className="navbar-start">
      </div>
      <div className="navbar-end">
        <Link className="navbar-item" to="/about">
          About
        </Link>
        <Link className="navbar-item" to="/blog">
          Blog
        </Link>
      </div>
    </div>
  </nav>
)

export default Navbar
