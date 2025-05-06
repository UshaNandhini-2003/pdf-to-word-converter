import React, { useReducer} from 'react';
import axios from 'axios';
import './UserAccess.css';


const initialState = {
  signName: '',
  signEmail: '',
  signPassword: '',
  loginEmail: '',
  loginPassword: '',
  email: '',
  otp: '',
  step: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: state.step - 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const UserAccess = ({
  showUpload,
  setShowUpload,
  showConvert,
  setShowConvert,
  setMain}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.signName || state.signName.length < 6) {
      alert("Enter a username with at least 6 characters!");
      return;
    }

    if (!state.signPassword || state.signPassword.length < 6) {
      alert("Enter a password with more than 6 characters!");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!state.signEmail) {
      alert("Enter your email!");
      return;
    }

    if (!emailPattern.test(state.signEmail)) {
      alert("Enter a valid email address!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/register", {
        username: state.signName,
        password: state.signPassword,
        email: state.signEmail,
      });

      if (response.status === 200) {
        alert("SignUp successful!");
        dispatch({ type: 'NEXT_STEP' });
      } else {
        alert("Error during SignUp! Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Enter valid data. Error: " + error);
      dispatch({type: 'NEXT_STEP'})
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        email: state.loginEmail,
        password: state.loginPassword,
      });

      if (response.status === 200) {
        alert("OTP Send Your Email!");
        dispatch({ type: 'NEXT_STEP' });
      } else {
        alert("Login rejected,Please check the email and password!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Invalid login: " + error.message);
    }
  };

  const handleOTP = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/verify-otp", {
        email: state.email,
        otp: state.otp,
      });

      if (response.status === 200) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("authToken", token)
        }
        alert("OTP verified! Login successfully!");
         setShowUpload(true)
        setShowConvert(true)
        setMain(false)
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Invalid: " + error.message);
    }
  };

  return (
    <div className="user-access-container">

    <p className="access-welcome-text">Welcome to One Point Research.</p>
    {state.step === 1 && (
        <>
          <h3 className="access-login-heading">Sign Up</h3>

          <input 
          type="text" 
          name="signName" 
          value={state.signName} 
          onChange={handleInputChange} 
          placeholder='Enter the UserName'
          required />
          
          <input 
          type="email" 
          name="signEmail" 
          value={state.signEmail} 
          placeholder='Enter the Email'
          onChange={handleInputChange} 
          required />

          <input 
          type="password" 
          name="signPassword"
          placeholder='Enter the Password'
          value={state.signPassword} 
          onChange={handleInputChange} 
 
          required />
          <button 
          onClick={handleSubmit}
          className="access-btn login-btn" >Sign Up</button>

          <button onClick={() => dispatch({type: 'NEXT_STEP'})} className="signUp-button">
            Already Signed Up? Click here
          </button>
        </>
      )}

      {state.step === 2 && (
        <>
         
          <h3 className="access-login-heading">Login</h3>
          <input 
          type="email"
          name="loginEmail"
          value={state.loginEmail}
          onChange={handleInputChange} 
          placeholder="Enter the Email" 
          required />

          <input 
          type="password" 
          name="loginPassword" 
          value={state.loginPassword} 
          onChange={handleInputChange} 
          placeholder="Enter the Password" 
          required />

          <button onClick={handleLogin}
          className="signUp-button">Login</button>
          <button 
          onClick={() => 
          dispatch({ type: 'RESET' })}
         className="signUp-button">Back to Sign Up</button>
        </>
      )}

      {state.step === 3 && (
        <>
        <h3 className="access-otp-heading">OTP</h3>


          <input
            className="access-input-field email-input"
            type="text"
            name='email'
            value={state.email}
            onChange={handleInputChange}
            placeholder='Enter the Email'
            required
          />
          <input 
          type="text" 
          name="otp" 
          value={state.otp} 
          onChange={handleInputChange} 
          placeholder="Enter the OTP" 
          required />

          <button 
          onClick={handleOTP}
          className="access-btn-submit-btn">Submit</button>
        </>
      )}

     
    </div>
  );
};

export default UserAccess;
