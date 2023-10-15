import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Make sure to import the correct RootState type
import Loader from './Loader';
import { checkNovel, deleteNovel, createNovel } from '../services/novel';

const Novel = () => {
  const { novelData, isLoading, hasError, error } = useSelector(
    (state: RootState) => state.novel,
  );

  const [isNovelInLibrary, setIsNovelInLibrary] = useState(false);
  const [saveNovelTrigger, setSaveNovelTrigger] = useState(null);
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
  }, [novelData, saveNovelTrigger, novelId]);

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
      <div className="mt-2 flex wrap">
        <img
          src={novelData.serieImageSrc}
          alt="cover"
          className="w-[300px] h-[300px] object-contain"
        />
        <div>
          <div
            className="cursor-pointer flex items-center w-fit"
            onClick={async () => {
              if (isNovelInLibrary) {
                const isNovelDeleted = await deleteNovel(novelId);
                if (isNovelDeleted) {
                  setSaveNovelTrigger(false);
                }
                return;
              }
              await createNovel(novelData);
              setSaveNovelTrigger(true);
            }}
          >
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
            <div className="ml-1">
              {isNovelInLibrary ? (
                <p className="text-blue-500">Remove from library</p>
              ) : (
                <p className="text-gray-400">Add to library</p>
              )}
            </div>
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
