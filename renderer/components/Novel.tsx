import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Make sure to import the correct RootState type
import Loader from './Loader';
import saveNovel from '../services/saveNovel';

const Novel = () => {
  const { novelData, isLoading, hasError, error } = useSelector(
    (state: RootState) => state.novel,
  );

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

  console.log('novelData', isNovelEmpty(novelData));

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
          <h2>
            Title:{' '}
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
          <p>
            Author: <a href={novelData.authorLink}>{novelData.authorName}</a>
          </p>
          <p>Last Update: {novelData.lastUpdate}</p>
          <p>Chapter(s): {novelData.chapters.length}</p>
          <p>Synopsis: {novelData.synopsis}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => saveNovel(novelData)}
      >
        Add to Library
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
