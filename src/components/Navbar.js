import React from 'react'
import Link from 'gatsby-link'

const Navbar = () => (
  <nav className="navbar is-info">
    <div className="navbar-brand">
      <Link to="/" className="navbar-item">
        Christina Hsu Holland
      </Link>
    </div>
    <div className="navbar-end">
      <Link className="navbar-item" to="/about">
        About
      </Link>
      <Link className="navbar-item" to="/blog">
        Blog
      </Link>
    </div>
  </nav>
)

export default Navbar
