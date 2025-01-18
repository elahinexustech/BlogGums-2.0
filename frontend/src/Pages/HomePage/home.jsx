import React, { useContext } from 'react'
import { Helmet } from "react-helmet"
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'
import Feed from '../../components/Feed/Feed'



const Home = () => {

    // console.log(notifications)   

    return (
        <>
            <Helmet>
                <title>Home • BlogGums</title>
            </Helmet>
            <Feed />
        </>
    )
}

export default Home
