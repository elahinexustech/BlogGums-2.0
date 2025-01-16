import React from 'react'
import { Helmet } from "react-helmet"
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'

const Features = () => {
    return (
        <>
            <Helmet>
                <title>Features • BlogGums</title>
            </Helmet>

            <div className="container">
                <p className="title">Features</p>
            </div>

            <NavigationMenu />
        </>
    )
}

export default Features