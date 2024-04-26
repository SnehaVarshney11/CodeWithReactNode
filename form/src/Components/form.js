import axios from 'axios';
import { useState } from 'react';
import '../App.css';

const Form = () => {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/form', formData);
            setMessage(response.data.message);
            console.log(response.data);
            alert('Form submitted successfully');
        } catch (error) {
            console.log('Error submitting form:', error);
        }
    };
 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClear = () => {
        document.getElementById('formId').reset();
    }

    return (
        <>
        <form className='form' id='formId' onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor='firstname'>First Name</label>
                <input type='text' name='firstname' onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label htmlFor='lastname'>Last Name</label>
                <input type='text' name='lastname' onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label htmlFor='email'>Email</label>
                <input type='email' name='email' onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label htmlFor='phone'>Phone</label>
                <input type='tel' name='phone' onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label htmlFor='dob'>Date Of Birth</label>
                <input type='date' name='dob' onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className='buttons'>
                <button type='submit'>Submit</button>
                <button type='clear' className="clear-btn" onClick={handleClear}>Clear</button>
            </div>      
        </form>
        </>
    );
};

export default Form;
