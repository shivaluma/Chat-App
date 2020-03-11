import React, { useState, useRef, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import request from 'request';
import { history } from '../../configs/browserHistory';
import url from '../../configs/url';
import BackgroundImage from '../../assets/images/bg.jpg';
import socket from '../../configs/socket';

const Login = props => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [isLogginIn, setLogginIn] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const login = async _ => {
    const info = {
      username: usernameRef.current.value,
      password: passwordRef.current.value
    };
    if (!info.username || !info.password) {
      setErrorMessage('Please input username and password.');
      return;
    }
    setLogginIn(true);

    const options = {
      uri: url.LOCAL + '/api/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...info
      })
    };

    request.post(options, function(err, httpResponse, body) {
      const objBody = JSON.parse(body);
      if (httpResponse.statusCode !== 200) {
        setLogginIn(false);
        setErrorMessage(objBody.message);
      } else {
        localStorage.setItem('chattoken', objBody.token);
        localStorage.setItem('userId', objBody.user.id);
        localStorage.setItem('username', objBody.user.username);

        socket.emit('user-login', objBody.user.id);
        history.push('/chat');
      }
    });
  };

  return localStorage.getItem('chattoken') ? (
    <Redirect to='/chat' push={true} />
  ) : (
    <div className='h-screen overflow-hidden flex items-center justify-center bg-gray-200'>
      <div className='container mx-auto'>
        <div className='flex justify-center px-6 my-12'>
          <div className='w-full xl:w-3/4 lg:w-11/12 flex shadow-xl'>
            <div
              className='w-full h-auto hidden lg:block lg:w-1/2 bg-cover bg-center rounded-l-lg'
              style={{
                backgroundImage: `url(${BackgroundImage})`
              }}
            ></div>

            <div className='w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none'>
              <h3 className='pt-4 text-2xl text-center'>Chat App!</h3>
              <form className='px-8 pt-6 pb-8 mb-4 bg-white rounded'>
                <div className='mb-4'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='username'
                  >
                    Username
                  </label>
                  <input
                    className='w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                    id='username'
                    type='text'
                    placeholder='Username'
                    ref={usernameRef}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='password'
                  >
                    Password
                  </label>
                  <input
                    className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                    id='password'
                    type='password'
                    placeholder='Password'
                    ref={passwordRef}
                  />

                  {errorMessage.length !== 0 ? (
                    <p className='text-xs italic text-red-500'>
                      {errorMessage}.
                    </p>
                  ) : null}
                </div>
                <div className='mb-4'>
                  <input
                    className='mr-2 leading-tight'
                    type='checkbox'
                    id='checkbox_id'
                  />
                  <label className='text-sm' htmlFor='checkbox_id'>
                    Remember Me
                  </label>
                </div>
                <div className='mb-6 text-center'>
                  <button
                    className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline'
                    type='button'
                    onClick={login}
                    disabled={isLogginIn}
                  >
                    {isLogginIn ? (
                      <div className='spinner -mt-1 -ml-1'>A</div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
                <hr className='mb-6 border-t' />
                <div className='text-center'>
                  <Link
                    to='/register'
                    className='inline-block text-sm text-blue-500 align-baseline hover:text-blue-800'
                  >
                    Don't have an account ? Register Now!
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

export default Login;
