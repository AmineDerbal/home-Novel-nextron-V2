import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Make sure to import the correct RootState type

const Novel = () => {
  const { novelData, isLoading, hasError } = useSelector(
    (state: RootState) => state.novel
  );

  if (isLoading) {
    return <div className="text-red-100">Loading...</div>;
  }
  if (hasError || (novelData.status && novelData.status === 'Error')) {
    return <div>Error...</div>;
  }
  if (!novelData || Object.keys(novelData).length === 0) {
    return <div>Waiting for url...</div>;
  }
  return <div className="mt-5 text-red-100">{novelData.chapterData.serieName}</div>;
};

export default Novel;
