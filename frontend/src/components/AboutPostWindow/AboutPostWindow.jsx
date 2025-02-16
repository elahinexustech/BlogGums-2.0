import React from 'react';
import './aboutpostwin.css';


const AboutPostWindow = ({ isOpen, onClose, data }) => {


    console.log(data)

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
                        <p className="heading grey">Details</p>
                        <span>
                            Published at: <span className="grey">{new Date(data.published_at).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}
                            </span>
                        </span>
                        <span>
                            Updated at: <span className="grey">{new Date(data.updated_at).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}</span>
                        </span>
                        <span>Likes: <span className="grey">
                            {data.total_likes}</span>
                        </span>
                        <span>Comments: <span className="grey">
                            {data.total_comments}</span>
                        </span>
                    </section>

                </section>

            </div>
        </div>
    );
};

export default AboutPostWindow;
