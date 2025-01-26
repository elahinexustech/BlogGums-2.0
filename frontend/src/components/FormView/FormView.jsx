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
        <div className='flex auth-container'>
            <div className="content-container flex direction-col obj">

                <p className="subtitle">{title}</p>

                {errorMessage && <p className="error">{errorMessage}</p>}

                <form className='flex direction-col jc-start ai-start' onSubmit={onSubmit}>
                    <div className={'flex direction-col'}>
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
                {linkMessage != null && (
                    <p className='caption'>
                        {linkMessage.msg}<Link to={linkMessage.link} className='link colored'> {linkMessage.linkText}</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default FormView;
