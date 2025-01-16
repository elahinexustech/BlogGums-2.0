import React from 'react'
import { Helmet } from "react-helmet"
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'

const AboutUs = () => {
    return (
        <>
            <Helmet>
                <title>About Us • BlogGums</title>
            </Helmet>

            <div className="container">
                <p className="title">About Us</p>
            </div>

            <NavigationMenu />
        </>
    )
}

export default AboutUs