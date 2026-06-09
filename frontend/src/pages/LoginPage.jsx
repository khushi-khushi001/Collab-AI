
import AuthLayout from '../layouts/AuthLayout';
import {AuthContext} from '../context/AuthContext';
import {useNavigate} from "react-router-dom"
import {loginUser} from '../services/authService'
import { useState, useContext } from 'react';

import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import InputField from '../components/shared/InputField';

function LoginPage() {
    console.log(("api url:", import.meta.env.VITE_API_URL ));
    
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const [formData, setFormData] = useState({email: "", password: ""});

    const [loading, setLoading] = useState(false);

    //handle input
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
             
            const data = await loginUser(formData);

            console.log("login response:", data);
           
            localStorage.setItem("user", JSON.stringify(data.user));
            login(data.user, data.token);
            
            navigate("/dashboard");

        } catch (error) {

           alert(error.response?.data?.message || error.message)


        } finally {
            setLoading(false);
        }
    };


    return (  
        <AuthLayout>
            <div className='login-wrapper'>
            <Card>
                <div className='auth-box'></div>
                <h1 className=' auth-title'>Login</h1>
                    &nbsp; &nbsp;

                    <form className='auth-form' onSubmit={handleSubmit}>
               
                    <InputField type="email" placeholder='Enter Email'
                    name='email' value={formData.email} onChange={handleChange} />
                    &nbsp;&nbsp;

                    <InputField type="password" placeholder='Enter Password'
                    name='password' value={formData.password}
                    onChange={handleChange} />
                    &nbsp;&nbsp;

                    <Button type="submit"  title={loading 
                    ? "Loading...":"Login"}
                    />

                    <p>Don't have account?
                       <span onClick={() => navigate("/")}> Signup</span>
                    </p>  

                    
                
                </form>
            </Card>
            </div>
        </AuthLayout>
    );
}

export default LoginPage;