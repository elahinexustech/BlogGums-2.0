import React, { useState } from 'react';

const PasswordInput = ({ id, placeholder, register, requiredMessage, errors }) => {
    const [passVisibility, setPassVisibility] = useState(false);

    return (
        <>
            <label htmlFor={id} className='field obj'>
                <input
                    type={passVisibility ? "text" : "password"}
                    id={id}
                    placeholder={placeholder}
                    className='obj'
                    {...register(id, { required: requiredMessage })}
                />
                <button
                    type='button'
                    onClick={() => setPassVisibility(!passVisibility)}
                    className='transparent'
                >
                    {passVisibility ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}
                </button>
            </label>
            {errors[id] && <p className="error">{errors[id].message}</p>}
        </>
    );
};

export default PasswordInput;
