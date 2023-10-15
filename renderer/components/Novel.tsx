import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Make sure to import the correct RootState type
import Loader from './Loader';
import saveNovel from '../services/saveNovel';
import checkNovel from '../services/checkNovel';
import deleteNovel from '../services/deleteNovel';

const Novel = () => {
  const { novelData, isLoading, hasError, error } = useSelector(
    (state: RootState) => state.novel,
  );

  const [isNovelInLibrary, setIsNovelInLibrary] = useState(false);
  const [saveNovelTrigger, setSaveNovelTrigger] = useState(false);
  const [novelId, setNovelId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!isNovelEmpty(novelData)) {
        const novel = {
          serieName: novelData.serieName,
          serieLink: novelData.serieLink,
          authorName: novelData.authorName,
        };
        const checkIsNovelInLibrary = await checkNovel(novel);
        const { success, id } = checkIsNovelInLibrary;
        success ? setNovelId(id) : setNovelId('');
        setIsNovelInLibrary(success);
      }
    };
    fetchData();
  }, [novelData, saveNovelTrigger]);

  const isNovelEmpty = (obj: any) => {
    if (
      obj['authorLink'] !== '' ||
      obj['authorName'] !== '' ||
      obj['chapters'].length > 0 ||
      obj['lastUpdate'] !== '' ||
      obj['serieImageSrc'] !== '' ||
      obj['serieName'] !== '' ||
      obj['serieLink'] !== '' ||
      obj['synopsis'] !== ''
    ) {
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <Loader />;
  }
  if (hasError) {
    return <div className="text-white">Error... {error}</div>;
  }
  if (!novelData || isNovelEmpty(novelData)) {
    return <div>Waiting for url...</div>;
  }

  return (
    <div className="mt-5 text-white">
      <div className="mt-2 flex wrap gap-5">
        <img
          src={novelData.serieImageSrc}
          alt="cover"
          className="w-[300px] h-[300px] object-contain"
        />
        <div>
          <div className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-16 h-16  ${
                isNovelInLibrary
                  ? 'fill-blue-500 stroke-blue-500'
                  : 'fill-gray-900 stroke-gray-400'
              }`}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h2 className="text-5xl">
            <a
              onClick={(event) => {
                event.preventDefault();
                window.location.href = 'chrome://newtab';
                window.open(novelData.serieLink, '_blank');
              }}
              href={novelData.serieLink}
            >
              {novelData.serieName}
            </a>
          </h2>
          <p className="mt-2 text-gray-400 text-2xl">
            <a href={novelData.authorLink}>{novelData.authorName}</a>
          </p>
          <p className="mt-2 text-gray-400 text-2xl">
            Last Update: {novelData.lastUpdate}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          if (isNovelInLibrary) {
            const isNovelDeleted = await deleteNovel(novelId);
            if (isNovelDeleted) {
              setSaveNovelTrigger(false);
            }
            return;
          }
          await saveNovel(novelData);
          setSaveNovelTrigger(true);
        }}
      >
        {isNovelInLibrary ? 'Remove from library' : 'Add to library'}
      </button>
      <div>
        {novelData.chapters.map((chapter: { title: string; link: string }) => (
          <div key={`chapter-${chapter.link}`}>
            {' '}
            <a href={chapter.link}>{chapter.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Novel;
