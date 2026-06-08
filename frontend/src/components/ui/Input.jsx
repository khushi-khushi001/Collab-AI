import React from 'react';

function Input({type="text", placeholder, value, onChange, name}) {
    return ( 
        <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className='primary-input'/>
     );
}

export default Input;