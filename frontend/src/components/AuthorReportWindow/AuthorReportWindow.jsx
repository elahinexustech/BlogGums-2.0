import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import './authorwindow.css'
import { ACCESS_TOKEN, BASE_URL } from '../../_CONSTS_';
import Cookies from 'js-cookie'
import { NotificationsContext } from '../Notifications/Notifications';

const violationOptions = [
    {
        title: "Islamic/Religious Violations",
        description: "Content that insults, disrespects, or attacks religious beliefs, figures, practices, or symbols, particularly in a way that promotes intolerance, hatred, or violence against religious communities. OR, if the content is violating Islamic Laws."
    },
    {
        title: "Hate Speech",
        description: "Content that promotes hatred, violence, or discrimination against individuals or groups based on race, religion, ethnicity, gender, sexual orientation, or disability."
    },
    {
        title: "Harassment or Bullying",
        description: "Content targeting individuals with threats, intimidation, unwanted attention, or actions intended to humiliate or degrade them."
    },
    {
        title: "Violence or Threats",
        description: "Content that depicts or encourages physical harm, violence, or threats against others, including glorification of terrorism or extremism."
    },
    {
        title: "Nudity or Sexual Content",
        description: "Content that includes explicit or suggestive sexual imagery, pornography, or inappropriate depictions of minors."
    },
    {
        title: "Misinformation",
        description: "Content that spreads false or misleading information, especially concerning public health, safety, or political matters."
    },
    {
        title: "Copyright or Intellectual Property Infringement",
        description: "Content that violates intellectual property rights, such as using copyrighted materials without permission (e.g., images, videos, music)."
    },
    {
        title: "Spam or Deceptive Practices",
        description: "Content involving scams, phishing, clickbait, or deceptive links meant to mislead or exploit users."
    },
    {
        title: "Illegal Activities",
        description: "Content promoting unlawful behavior, including but not limited to drug use, human trafficking, and unlawful gambling."
    },
    {
        title: "Privacy Violations",
        description: "Content that shares private or sensitive information of others without their explicit consent, such as personal addresses, phone numbers, or financial details."
    },
    {
        title: "Terrorist Content",
        description: "Content that promotes, glorifies, or supports terrorism or extremist ideologies."
    },
    {
        title: "Self-Harm or Suicide",
        description: "Content that encourages or glorifies self-harm, suicide, or other dangerous activities that may result in physical or emotional harm."
    },
    {
        title: "Child Exploitation",
        description: "Any content that sexualizes, exploits, or endangers minors, including the depiction or promotion of child abuse."
    },
    {
        title: "Other",
        description: "Any other, reason you might think that is not mentioned above, please describe it breifly in your feedback."
    }
];

const ReportForm = ({ isOpen, onClose, id }) => {
    const { addNotification } = useContext(NotificationsContext);
    const { register, handleSubmit, watch, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const selectedViolation = watch("violationType", violationOptions[0].title);

    const description = violationOptions.find(v => v.title === selectedViolation)?.description || "";

    const onSubmit = async (data) => {
        setLoading(true)
        let r = await fetch(`${BASE_URL}/api/report/author`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([data, id])
        })

        if (r.ok) {
            addNotification("Report submitted successfully!", "success");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="windows opened">
            <div className="window opened flex direction-col">
                <button onClick={onClose} className="transparent closeBtn icon">
                    <i className="bi bi-x-lg"></i>
                </button>

                <section className="body flex direction-col">
                    <p className="heading">Report Content/ Author</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex direction-col ai-start">
                        <label htmlFor="violationType">Select Violation Type:</label>
                        <select id="violationType" {...register("violationType", { required: true })}>
                            {violationOptions.map((option) => (
                                <option key={option.title} value={option.title}>
                                    {option.title}
                                </option>
                            ))}
                        </select>

                        <p className="grey"><strong>Description:</strong> {description}</p>
                        <br />
                        <label htmlFor="feedback">Your Feedback:</label>
                        <textarea id="feedback" {...register("feedback", { required: true })} placeholder="Provide additional details..." rows="4"></textarea>
                        <br /><br />
                        <button type="submit" className={`error ${loading? 'loader': ''}`} disabled={loading}>Submit Report</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default ReportForm;