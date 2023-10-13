import React from 'react';
import { Provider } from 'react-redux';
import Url from '../components/Url';
import store from '../redux/store';
import Novel from '../components/Novel';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    console.log('useEffect');
    const connect = async () => {
      try {
        console.log('start');
        const database = await fetch('api/database');
        const data = await database.json();
        console.log('data', await data);
      } catch (error) {
        console.log(error);
      }
    };
    console.log('start connect');
    connect();
    console.log('end connect');
  }, []);

  return (
    <Provider store={store}>
      <div className="mx-10">
        <h1 className="text-center mt-5">Welcome</h1>
        <Url />
        <Novel />
      </div>
    </Provider>
  );
};

export default Home;
