import React, { useContext, useEffect, useState } from 'react'

import { AuthContext } from '../../components/AuthUser/AuthProvider'
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'

import './details.css'

const DetailaView = () => {

    const { isAuthenticated } = useContext(AuthContext);
    const [active, setActive] = useState('About Us');

    const pages = [
        {
            page: 'About Us',
            content: `
                <p class='text'>What is BlogGums 2.0?</p>
                <p class='grey'>Welcome to BlogGums 2.0 – a reimagined blogging platform designed for creativity and connection!</p>
                <br  />
                <p class='grey'>We are a team of passionate developers and designers who believe in the power of words and the magic of the internet. We have created this platform to help you share your stories, ideas, and experiences with the world. Whether you are a seasoned writer or a first-time blogger, BlogGums 2.0 is the perfect place to express yourself and connect with like-minded individuals.</p>
                <br  />
                <p class='grey'>Our platform is easy to use, intuitive, and packed with features that will help you bring your ideas to life. From customizable themes and layouts to powerful editing tools and analytics, we have everything you need to create a beautiful and engaging blog that will captivate your audience.</p>
                <br />
                <p class='text'>Our Mission</p>
                <p class='grey'>Our mission is to provide a safe and supportive space for writers of all backgrounds and experience levels. We believe that everyone has a story to tell and that every voice deserves to be heard. That’s why we have created a platform that is easy to use, inclusive, and free from judgment.</p>
                <br  />
                <p class='grey'>So what are you waiting for? Join us today and start sharing your stories with the world. We can’t wait to read what you have to say!</p>
                <br />
                <p class='text colored'>Happy Blogging! 🥳🫶🏻❣️</p>

            `
        },
        {
            page: 'Join BlogGums',
            content: `
                <p class="text">Join as a Normal User</p>
                <p class="grey">
                    Become a <span class="original-color">normal user</span> and unlock the full blogging experience! As a normal user, you can create captivating blogs, upload your thoughts and stories, read inspiring content, interact with a vibrant community, and manage your personalized profile. The possibilities are endless – dive into the world of creativity and connection today!
                </p>
                <a href='/signup' class="colored">Join Now</a>
                <br />
                <br />
                <p class="text">Join as a Gummer <span class='bg-colored'>Coming Soon</span></p>
                <p class="grey">
                     Excited for the future? Our <span class="original-color">Gummer</span> program is coming soon! This premium feature will revolutionize how businesses engage with their audience. Gummers will have access to exclusive tools to run ads, promote their content, and grow their influence on the platform. While not yet available, this innovative upgrade is on the horizon – stay tuned for exciting updates!
                </p>

            `
        },
        {
            page: 'Terms & Conditions',
            content: `

                <p class='text'>Content Violations - Terms and Conditions</p>

                To maintain a safe, respectful, and inclusive platform, users are prohibited from posting the following types of content:

                <ul>
                    <li>
                        <span class="violation original-color">Islamic/Religious Violations</span>
                        <br />
                        <span class="violation-description">Content that insults, disrespects, or attacks religious beliefs, figures, practices, or symbols, particularly in a way that promotes intolerance, hatred, or violence against religious communities.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Hate Speech</span>
                        <br />
                        <span class="violation-description">Content that promotes hatred, violence, or discrimination against individuals or groups based on race, religion, ethnicity, gender, sexual orientation, or disability.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Harassment or Bullying</span>
                        <br />
                        <span class="violation-description">Content targeting individuals with threats, intimidation, unwanted attention, or actions intended to humiliate or degrade them.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Violence or Threats</span>
                        <br />
                        <span class="violation-description">Content that depicts or encourages physical harm, violence, or threats against others, including glorification of terrorism or extremism.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Nudity or Sexual Content</span>
                        <br />
                        <span class="violation-description">Content that includes explicit or suggestive sexual imagery, pornography, or inappropriate depictions of minors.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Misinformation</span>
                        <br />
                        <span class="violation-description">Content that spreads false or misleading information, especially concerning public health, safety, or political matters.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Copyright or Intellectual Property Infringement</span>
                        <br />
                        <span class="violation-description">Content that violates intellectual property rights, such as using copyrighted materials without permission (e.g., images, videos, music).</span>
                    </li>
                    <li>
                        <span class="violation original-color">Spam or Deceptive Practices</span>
                        <br />
                        <span class="violation-description">Content involving scams, phishing, clickbait, or deceptive links meant to mislead or exploit users.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Illegal Activities</span>
                        <br />
                        <span class="violation-description">Content promoting unlawful behavior, including but not limited to drug use, human trafficking, and unlawful gambling.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Privacy Violations</span>
                        <br />
                        <span class="violation-description">Content that shares private or sensitive information of others without their explicit consent, such as personal addresses, phone numbers, or financial details.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Terrorist Content</span>
                        <br />
                        <span class="violation-description">Content that promotes, glorifies, or supports terrorism or extremist ideologies.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Self-Harm or Suicide</span>
                        <br />
                        <span class="violation-description">Content that encourages or glorifies self-harm, suicide, or other dangerous activities that may result in physical or emotional harm.</span>
                    </li>
                    <li>
                        <span class="violation original-color">Child Exploitation</span>
                        <br />
                        <span class="violation-description">Any content that sexualizes, exploits, or endangers minors, including the depiction or promotion of child abuse.</span>
                    </li>
                </ul>
                    
            `
        },
        {
            page: 'Privacy Policy',
            content: `
                <p class=''>At BlogGums, we are committed to protecting your privacy and ensuring the security of your personal information. Please read the following privacy policy to understand how we handle your data:</p>
                <ul>
                    <li>
                        <span class="policy-item original-color">Password Security</span>
                        <span class="policy-description">Your passwords are stored securely using the latest encryption techniques. We cannot alter or read your passwords at any time.</span>
                    </li>
                    <li>
                        <span class="policy-item original-color">Security is Our Priority</span>
                        <span class="policy-description">We prioritize your security by using industry-leading measures to protect your personal information. All interactions on our platform are secured using robust encryption protocols.</span>
                    </li>
                    <li>
                        <span class="policy-item original-color">Verified Users Only</span>
                        <span class="policy-description">Only users who have verified their accounts are granted access to the platform, ensuring that all participants are legitimate and secure.</span>
                    </li>
                    <li>
                        <span class="policy-item original-color">No Data Sharing</span>
                        <span class="policy-description">We do not share your personal data with any third parties. Your information remains private and secure within the platform.</span>
                    </li>
                    <li>
                        <span class="policy-item original-color">Profile Info and Blogs Shared</span>
                        <span class="policy-description">The only data shared with other users on the platform is your profile information and the blogs you publish. This allows your content to be displayed and shared within the platform, enabling others to view your posts.</span>
                    </li>
                    <li>
                        <span class="policy-item original-color">Data Sharing is Limited to the Platform</span>
                        <span class="policy-description">The data shared is strictly confined to the platform. We do not share your information outside of the platform with any external services or entities.</span>
                    </li>
                </ul>
            `
        },
        {
            page: 'Contact Us',
            content: `
                <p class='text'>Need Help?</p>
                <p class='grey'>We are here to assist you with any questions, concerns, or issues you may have. Please feel free to reach out to us using the contact information below:</p>
                <br />
                <p class='grey'>
                    Email:
                    <a class='colored' href="mailto:elahinexustech@gmail.com">elahinexustech@gmail.com</a>
                </p>
                <p class='grey'>
                    Instagram: 
                    <a class='colored' href="https://www.instagram.com/elahinexustech" target="_blank">instagram.com/elahinexustech</a>
                </p>
                <p class='grey'>
                    Phone Number:
                    <a class='colored' href="tel:+923332371578"> +92 333 2371578</a>
                </p>

            `
        }
    ];




    useEffect(() => {
        console.log(active)
    }, [active]);

    return (
        <>
            {isAuthenticated && <NavigationMenu />}

            <div className="details-header">
                <p className="title">Support Page</p>
                <p className="">Read the following for any confusions!</p>
            </div>

            <div className="container flex ai-start">
                <div className="side-bar">
                    <ul>
                        {pages.map((page, index) => (
                            <li key={index} onClick={() => setActive(page.page)} className={`${active === page.page ? 'active' : ''} grey`}>{page.page}</li>
                        ))}
                    </ul>
                </div>

                <div className="content">
                    {pages.map((page, index) => (
                        active === page.page && (
                            <div key={index}>
                                <h1>{page.page}</h1>
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: page.content }} />
                            </div>
                        )
                    ))}
                </div>


            </div>
        </>
    )
}

export default DetailaView