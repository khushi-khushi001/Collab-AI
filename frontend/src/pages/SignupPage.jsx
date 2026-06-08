import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  "../styles/auth.css"
import Button from '../components/ui/Button';
import InputField from '../components/shared/InputField';
import {signupUser} from "../services/authService"

function SignupPage() {

    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await signupUser(formData);

            alert("Signup Successfull");

            navigate("/");
        } catch (error) {
            console.log(error);

            alert("Signup Failed");
        } finally {
            setLoading(false);
        }
    };

    return ( 

        <div className="auth-page">

            <form className='auth-card' onSubmit={handleSubmit}>

                <h2>Create Account</h2>

                <InputField type="text" name='name' 
                   placeholder='Enter Name' value={formData.name} 
                   onChange={handleChange}
                />

                <InputField type="email" name='email' 
                   placeholder='Enter Email' value={formData.email} 
                   onChange={handleChange}
                />

                <InputField type="password" name='password' 
                   placeholder='Enter Password' value={formData.password} 
                   onChange={handleChange}
                />

                 <Button type="submit"  title={loading 
                    ? "Loading...":"SignUp"}
                 />
                

                <p>Already have account?
                    <span onClick={() => navigate("/login")}>Login</span>
                </p>

                

            </form>

        </div>
        
     );
}

export default SignupPage;