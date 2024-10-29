import React from 'react';

const DynamicInput = ({ label, type, placeholder, id, register, requiredMessage, errors }) => {
    return (
        <div className='input-field'>
            <label htmlFor={id} className='field obj-trans'>
                <input 
                    type={type} 
                    placeholder={placeholder} 
                    id={id} 
                    className='obj-trans' 
                    autoFocus 
                    {...register(id, { required: requiredMessage })} 
                />
            </label>
            {errors[id] && <p className="error">{errors[id]?.message}</p>}
            <br />
        </div>
    );
};

export default DynamicInput;
