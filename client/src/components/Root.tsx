import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <div>
      <nav>Nagivation placeholder</nav>
      <Outlet />
      <footer>Footer placeholder</footer>
    </div>
  )
}
