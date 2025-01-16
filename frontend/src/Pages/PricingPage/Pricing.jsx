import React from 'react'
import { Helmet } from "react-helmet"
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'

const Pricing = () => {
    return (
        <>
            <Helmet>
                <title>Pricing • BlogGums</title>
            </Helmet>

            <div className="container">
                <p className="title">Pricing</p>
            </div>

            <NavigationMenu />
        </>
    )
}

export default Pricing