import React from 'react';

function AuthLayout({children}) {
    return ( 
        <div className='auth-container'>
            <div className='w-full max-w-md'>{children}</div>
        </div>
     );
}

export default AuthLayout;