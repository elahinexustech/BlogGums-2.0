import React from 'react'

// CSS
import './footer.css'

const Footer = () => {
  return (
    <div className='flex direction-col footer'>
        <ul className='flex'>
            <li><a className='grey caption' href="">Pricing</a></li>
            <li><a className='grey caption' href="">Terms & Conditions</a></li>
            <li><a className='grey caption' href="">Privacy</a></li>
            <li><a className='grey caption' href="">Learn</a></li>
            <li><a className='grey caption' href="">About</a></li>
            <li><a className='grey caption' href="">Featured in 2.0</a></li>
        </ul><br />
        <p className="heading grey">© ElahiNexusTech, 2024-25</p>
    </div>
  )
}

export default Footer
