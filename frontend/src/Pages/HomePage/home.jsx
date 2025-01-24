import React from 'react'
import { Helmet } from "react-helmet"
import Feed from '../../components/Feed/Feed'

const Home = () => {
    
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
