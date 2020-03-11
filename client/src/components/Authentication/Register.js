import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackgroundImage from '../../assets/images/bg.jpg';
import request from 'request';
import url from '../../configs/url';
import { history } from '../../configs/browserHistory';

const Register = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPassWordRef = useRef(null);

  const [isRegistering, setRegistering] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Register';
  }, []);

  const register = () => {
    const info = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      repassword: confirmPassWordRef.current.value
    };

    if (!info.username || !info.password || !info.repassword) {
      setErrorMessage('Please input username and password.');
      return;
    } else if (info.password !== info.repassword) {
      console.log(info.password, info.repassword);
      setErrorMessage('Password do not match.');
      return;
    }
    setRegistering(true);

    const options = {
      uri: url.LOCAL + '/api/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...info
      })
    };

    request.post(options, function(err, httpResponse, body) {
      if (httpResponse.statusCode !== 200) {
        setRegistering(false);
        setErrorMessage(JSON.parse(body).message);
      } else {
        alert('Register successful as ' + info.username);
        history.push('/');
        setRegistering(false);
      }
    });
  };

  return (
    <div className='h-screen overflow-hidden flex items-center justify-center bg-gray-200'>
      {/* container */}
      <div className='container mx-auto'>
        <div className='flex justify-center px-6 my-12'>
          {/* row */}
          <div className='w-full xl:w-3/4 lg:w-11/12 flex shadow-xl'>
            {/* col */}
            <div
              className='w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover bg-center rounded-l-lg overflow-hidden'
              style={{ backgroundImage: `url(${BackgroundImage})` }}
            ></div>
            {/* col */}
            <div className='w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none'>
              <h3 className='pt-4 text-2xl text-center'>Create an Account!</h3>
              <form className='px-8 pt-6 pb-8 mb-4 bg-white rounded'>
                <div className='mb-4'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='username'
                  >
                    Username
                  </label>
                  <input
                    className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                    id='username'
                    type='username'
                    placeholder='Username'
                    ref={usernameRef}
                  />
                </div>
                <div className='mb-4 md:flex md:justify-between'>
                  <div className='mb-4 md:mr-2 md:mb-0'>
                    <label
                      className='block mb-2 text-sm font-bold text-gray-700'
                      htmlFor='password'
                    >
                      Password
                    </label>
                    <input
                      className='w-full px-3 py-2 mb-3  text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                      id='password'
                      type='password'
                      placeholder='******************'
                      ref={passwordRef}
                    />
                  </div>

                  <div className='md:ml-2'>
                    <label
                      className='block mb-2 text-sm font-bold text-gray-700'
                      htmlFor='c_password'
                    >
                      Confirm Password
                    </label>
                    <input
                      className='w-full px-3 py-2 mb-3  text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                      id='c_password'
                      type='password'
                      placeholder='******************'
                      ref={confirmPassWordRef}
                    />
                  </div>
                </div>
                {errorMessage.length !== 0 ? (
                  <p className='w-full text-xs italic text-red-500 mb-2'>
                    {errorMessage}.
                  </p>
                ) : null}
                <div className='mb-6 text-center'>
                  <button
                    className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline'
                    type='button'
                    onClick={register}
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <div className='spinner'>A</div>
                    ) : (
                      'Register Account'
                    )}
                  </button>
                </div>
                <hr className='mb-6 border-t' />

                <div className='text-center'>
                  <Link
                    to='/'
                    className='inline-block text-sm text-blue-500 align-baseline hover:text-blue-800'
                  >
                    Already have an account? Login!
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
