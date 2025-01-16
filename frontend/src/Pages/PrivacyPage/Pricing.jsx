import React from 'react'
import { Helmet } from "react-helmet"
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy • BlogGums</title>
            </Helmet>

            <div className="container">
                <p className="title">Privacy</p>
            </div>

            <NavigationMenu />
        </>
    )
}

export default Privacy