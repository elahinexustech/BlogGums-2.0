import React from 'react';

const DynamicInput = ({ label, type, placeholder, id, disabled=false, register, requiredMessage, errors }) => {
    return (
        <>
            <label htmlFor={id} className='field obj'>
                <input 
                    type={type} 
                    placeholder={placeholder} 
                    id={id} 
                    className='obj' 
                    autoFocus 
                    disabled={disabled}
                    {...register(id, { required: requiredMessage })} 
                />
            </label>
            {errors[id] && <p className="error">{errors[id]?.message}</p>}
        </>
    );
};

export default DynamicInput;
