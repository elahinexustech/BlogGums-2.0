import React from 'react'
import { Helmet } from "react-helmet"
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'

const Learn = () => {
    return (
        <>
            <Helmet>
                <title>Learn • BlogGums</title>
            </Helmet>

            <div className="container">
                <p className="title">Learn</p>
            </div>

            <NavigationMenu />
        </>
    )
}

export default Learn