import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const CreateAccountPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const createAccount = async () => {
        try {
            if (password !== confirmPassword) {
                setError('Password and confirm password do not match');
                return;
            }

            await createUserWithEmailAndPassword(getAuth(), email, password);
            navigate('/articles');
        } catch (e) {
            setError(e.message);
        }
    }

    const inputStyle = {
        display: 'block',
        marginBottom: '1em',
        padding: '0.5em'
    };

    const buttonStyle = {
        display: 'block',
        padding: '0.5em 1em',
        marginBottom: '1em'
    };

    return (
        <>
        <h1>Create Account</h1>
        {error && <p className="error" style={{color: 'red'}}>{error}</p>}
        <input
            style={inputStyle}
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)} />
        <input
            style={inputStyle}
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)} />
        <input
            style={inputStyle}
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} />
        <button
            style={buttonStyle}
            onClick={createAccount}>Create Account</button>
        <Link to="/login">Already have an account? Log in here</Link>
        </>
    );
}

export default CreateAccountPage;
