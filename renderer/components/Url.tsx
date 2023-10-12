import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import testUrl from '../utils/utils';
import { getNovelData } from '../redux/novel/novelSlice';

const Url = () => {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch<any>();

  useEffect(() => {}, [url]);

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
    <div className="flex gap-3 justify-center mx-10">
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        value={url}
        id="url"
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        placeholder="type a ScribbleHub url"
      />
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Download
      </button>
    </div>
  );
};

export default Url;
