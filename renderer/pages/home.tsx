import React from 'react';
import { Provider } from 'react-redux';
import Url from '../components/Url';
import store from '../redux/store';
import Novel from '../components/Novel';

const Home = () => (
  <Provider store={store}>
    <h1 className='text-center mt-5'>Welcome</h1>
    <Url />
    <Novel />
  </Provider>
);

export default Home;
