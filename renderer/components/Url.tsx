import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import testUrl from '../utils/utils';
import { getNovelData } from '../redux/novel/novelSlice';

const Url = () => {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch<any>();

  const handleClick = async () => {
    if (url === '') return;
    if (!testUrl(url)) {
      console.log('this is not a scribblehub url');
      return;
    }
    console.log('url of url page', url);
    await dispatch(getNovelData(url));
  };
  return (
    <div className='input-url '>
      <input
        className='width-100'
        type='text'
        value={url}
        id='url'
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        placeholder='type a ScribbleHub url'
      />
      <button type='button' className='submit' onClick={handleClick}>
        Download
      </button>
    </div>
  );
};

export default Url;
