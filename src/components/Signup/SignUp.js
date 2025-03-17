import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
    const history = useHistory();

    // Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    // Handle Signup
    const handleSignUp = async (values, { setSubmitting, setErrors }) => {
        try {
            await axios.post('http://localhost:4000/users', { ...values, role: 'employee' });
            history.push('/login');
        } catch (error) {
            setErrors({ submit: 'Sign-up failed. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {/* Rendering the Form */}
            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSignUp}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
                        {/* Creating Input Fields */}
                        <div>
                            <label>Name:</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Email:</label>
                            <Field type="email" name="email" />
                            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Password:</label>
                            <Field type="password" name="password" />
                            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                        </div>

                        {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;
