import React from 'react'
import { Helmet } from "react-helmet"
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'
import Feed from '../../components/Feed/Feed'



const Home = () => {
    return (
        <>
            <Helmet>
                <title>Home • BlogGums</title>
            </Helmet>
            <NavigationMenu />
            <Feed />
        </>
    )
}

export default Home
