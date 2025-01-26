import React from 'react';
import { Link } from 'react-router-dom';
import LabelField from '../../components/LabelField/LabelField';
import LabelPasswordField from '../../components/LabelPasswordField/LabelPasswordField';

import './form.css';

const FormView = ({
    type,
    title,
    subtitle,
    features = [],
    step,
    fields,
    errorMessage,
    onSubmit,
    buttonText,
    linkMessage,
    register,
    errors,
    disabled,
}) => {
    return (
        <div className='container flex auth-container'>
            <div className="content-container flex">
                <div className="left flex ai-start jc-start direction-col">
                    {type !== 'login' &&
                        <Link to='/login' className='back-link flex caption' style={{color: 'white'}}>
                            <i className="bi bi-arrow-left-circle " style={{ color: 'white', fontSize: '1rem' }}></i> &nbsp;Back to login
                        </Link>
                    }
                    <p className="title">{title}</p>
                    <p className="subtitle">{subtitle}</p>
                    <br /><hr /><br />
                    <ul className='features-list'>
                        <p className="heading">Features</p>
                        {features.length > 0 ? (
                            features.map((feature, index) => (
                                <li key={index} className='feature-item'>
                                    <i className={feature.icon}></i> &nbsp;{feature.text}
                                </li>
                            ))
                        ) : (
                            <li className='feature-item'>No features available</li>
                        )}
                    </ul>
                </div>
                <div className="form-container right flex direction-col ai-start">

                    <p className="title">{step === 1 ? 'Enter your email' : 'Enter Code'}</p>

                    {errorMessage && <p className="error">{errorMessage}</p>}

                    <form className='flex direction-col jc-start ai-start' onSubmit={onSubmit}>
                        <div className={type === 'signup' ? 'grid cols-2 gap-2' : 'flex direction-col jc-start ai-start'}>
                            {fields.map((field, index) => (
                                <div key={index} className="form-group">
                                    <p className="heading-2 grey">{field.label}</p>
                                    {field.type === 'password' ? (
                                        <LabelPasswordField
                                            id={field.id}
                                            placeholder={field.placeholder}
                                            register={register}
                                            requiredMessage={field.requiredMessage}
                                            errors={errors}
                                        />
                                    ) : (
                                        <LabelField
                                            type={field.type}
                                            id={field.id}
                                            placeholder={field.placeholder}
                                            register={register}
                                            requiredMessage={field.requiredMessage}
                                            errors={errors}
                                        />
                                    )}
                                    <br />
                                </div>
                            ))}
                        </div>

                        {type === 'login' &&
                            <>
                                <p className='grey caption flex'>
                                    <i className="bi bi-key"></i> &nbsp; Forgot your Password, <Link className='colored' to={'/resetpassword'}>Reset here</Link>
                                </p>
                            </>
                        }

                        <button className='theme loader' type="submit" disabled={disabled}>
                            <i className="bi bi-box-arrow-right"></i> &nbsp;{buttonText}
                        </button>
                    </form>
                    <br />
                    {linkMessage !== null && (
                        <p className='caption'>
                            {linkMessage.msg}<Link to={linkMessage.link} className='link colored'> {linkMessage.linkText}</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormView;
