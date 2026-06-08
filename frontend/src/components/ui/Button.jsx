import React from 'react';

function Button({title,
    type= "button", onClick, 
    disabled=false, className=""}) {
    
    return ( 
        <button type={type} onClick={onClick }
        disabled={disabled}
         className='primary-btn'>{title}</button>
     );
}

export default Button;