import React from 'react';
import { Provider } from 'react-redux';
import Url from '../components/Url';
import store from '../redux/store';
import Novel from '../components/Novel';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const connect = async () => {
      try {
        const database = await fetch('api/database');
        await database.json();
      } catch (error) {
        return;
      }
    };
    connect();
  }, []);

  return (
    <Provider store={store}>
      <div className="mx-10">
        <h1 className="text-center my-5 text-5xl">Home Novel</h1>
        <Url />
        <Novel />
      </div>
    </Provider>
  );
};

export default Home;
