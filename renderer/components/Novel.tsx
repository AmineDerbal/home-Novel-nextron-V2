import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Make sure to import the correct RootState type
import Loader from './Loader';

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
      <div className="mt-2 flex ">
        <img
          src={novelData.serieImageSrc}
          alt="cover"
          className="w-1/4 object-contain"
        />
        <div>
          <p>Name: {novelData.serieName}</p>
          <p>Link: {novelData.serieLink}</p>
          <p>Author: {novelData.authorName}</p>
          <p>Author Link: {novelData.authorLink}</p>
          <p>Last Update: {novelData.lastUpdate}</p>
          <p>Synopsis: {novelData.synopsis}</p>
        </div>
      </div>
      <div>
        {novelData.chapters.map(
          (chapter: { title: string; link: string }, index: number) => (
            <div>
              {' '}
              <a
                key={`chapter-${index}`}
                href={chapter.link}
              >
                {chapter.title}
              </a>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default Novel;
