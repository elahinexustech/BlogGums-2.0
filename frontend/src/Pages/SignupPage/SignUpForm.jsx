import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// CSS
import './signup.css';


// Components
import Footer from '../../components/Footer/Footer';
import LabelField from '../../components/LabelField/LabelField'
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField'

const SignUpForm = () => {
    const [passVisibility, setPassVisibility] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // const navigate = useNavigate();

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    // Watch the input fields
    const username = watch('username');
    const password = watch('password');

    // Function to handle form submission
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        console.log(data)
        try {
            const r = await fetch('http://127.0.0.1:8000/api/user/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    first_name: data.f_name,
                    last_name: data.l_name
                })
            });

            let resp = await r.json();


            const get_login = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password
                })
            });

            let stat = await get_login.json();

            localStorage.clear();
            localStorage.setItem("ACCESS_TOKEN", stat.access)
            localStorage.setItem("REFRESH_TOKEN", stat.refresh)
            location.reload()

        } catch (error) {
            console.error('Error during submission:', error);
        } finally {
            setIsSubmitting(false); // Re-enable the button after submission
        }
    };


    return (
        <>
            <div className='container flex signup-container'>
                <div className="obj-trans form-container">
                    <h1>Signup</h1>
                    <br />
                    <form className='flex direction-col jc-start ai-start' onSubmit={handleSubmit(onSubmit)}>

                        <div className="grid cols-2 gap-2">
                            <LabelField
                                id="username"
                                placeholder="username"
                                register={register}
                                requiredMessage="Username is required"
                                errors={errors}
                            />

                            <LabelField
                                id="email"
                                type="email"
                                placeholder="email"
                                register={register}
                                requiredMessage="Email is required"
                                errors={errors}
                            />


                            <LabelPasswordField
                                id="password"
                                placeholder="password"
                                register={register}
                                requiredMessage="Password is required"
                                errors={errors}
                            />

                            <LabelPasswordField
                                id="confirm_password"
                                placeholder="confirm_password"
                                register={register}
                                requiredMessage="Password confirmation is required"
                                errors={errors}
                            />

                            <LabelField
                                id="f_name"
                                placeholder="First Name"
                                register={register}
                                requiredMessage="First Name is required"
                                errors={errors}
                            />

                            <LabelField
                                id="l_name"
                                placeholder="Last Name"
                                register={register}
                                requiredMessage="Last Name is required"
                                errors={errors}
                            />
                        </div>

                        <br />
                        <button type="submit" className='obj-trans btn' style={{ "--text-color": "#fff" }} disabled={!username || !password || isSubmitting}>
                            <i className="bi bi-box-arrow-right"></i> &nbsp;Login
                        </button>
                    </form>
                    <p className='grey caption'>
                        Already have an account, <Link className="colored" to="/">login</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default SignUpForm;
