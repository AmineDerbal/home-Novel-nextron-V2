import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Make sure to import the correct RootState type

const Novel = () => {
  const { novelData, isLoading, hasError,error } = useSelector(
    (state: RootState) => state.novel
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (hasError) {
    return <div className='text-white'>Error... {error}</div>;
  }
  if (!novelData || Object.keys(novelData).length === 0) {
    return <div>Waiting for url...</div>;
  }

  return <div className="mt-5"> {hasError ? 'true' : 'false'}</div>;
};

export default Novel;
