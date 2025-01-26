import React from 'react';

// Import environment variables
import {
    SERVER,
    PORT,
    ACCESS_TOKEN
} from '../../_CONSTS_.js';

import './aboutpostwin.css';


const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';


const AboutPostWindow = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null; // Only render if open

    return (
        <div className="windows opened">
            <div className="window opened flex direction-col">
                <button onClick={() => {
                    onClose();
                }} className="transparent closeBtn icon">
                    <i className="bi bi-x-lg"></i>
                </button>


                <section className="body flex direction-col">

                    <section className='flex direction-col'>
                        <img src={data.author.profile_image_url} className="icon size-l" />
                        <br />
                        <p className="subtitle">{data.author.first_name} {data.author.last_name}</p>
                    </section>

                    <section className='flex jc-start ai-start direction-col'>
                        <br />
                        <p className="heading">Details</p>
                        <span>Date Published: {new Date(data.published_at).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}</span>
                        <span>Likes: {data.total_likes}</span>
                        <span>Comments: {data.total_comments}</span>
                    </section>

                </section>

            </div>
        </div>
    );
};

export default AboutPostWindow;
