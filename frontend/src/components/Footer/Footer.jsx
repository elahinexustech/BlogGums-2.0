import React from 'react';
import { Link } from 'react-router-dom';

// CSS
import './Footer.css';

const Footer = () => {
    return (
        <div className='flex direction-col footer'>
            <ul className='flex direction-row'>
                <li><Link className='grey caption' to="/pricing">Pricing</Link></li>
                <li><Link className='grey caption' to="/terms-conditions">Terms & Conditions</Link></li>
                <li><Link className='grey caption' to="/privacy">Privacy</Link></li>
                <li><Link className='grey caption' to="/learn">Learn</Link></li>
                <li><Link className='grey caption' to="/about">About</Link></li>
                <li><Link className='grey caption' to="/featured">Featured in 2.0</Link></li>
            </ul><br />
            <p className="heading grey">© ElahiNexusTech, 2024-25</p>
        </div>
    );
};

export default Footer;
