import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store'; // Make sure to import the correct RootState type
import Loader from './Loader';
import Error from './Error';
import { DownloadModal, ProgressModal } from './modals';
import { checkNovel, deleteNovel, createNovel } from '../services/novel';
import { toggleModal } from '../redux/modal/modalSlice';

const Novel = () => {
  const { novelData, isLoading, hasError, error } = useSelector(
    (state: RootState) => state.novel,
  );
  const { downloadModal, progressModal } = useSelector(
    (state: RootState) => state.modal,
  );
  const dispatch = useDispatch();

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
    return <Error />;
  }
  if (!novelData || isNovelEmpty(novelData)) {
    return <></>;
  }

  return (
    <div className="my-10 text-white">
      {downloadModal && <DownloadModal />}
      {progressModal && <ProgressModal />}

      <div className="my-2 flex wrap gap-8">
        <div className="w-[300px] h-[300px]">
          <img
            src={novelData.serieImageSrc}
            alt="cover"
            className="w-full h-full object-fill"
          />
        </div>
        <div>
          <div className="ml-1 text-xl">
            <div className="w-fit mb-3">
              {isNovelInLibrary ? (
                <p className="text-blue-500">In Library</p>
              ) : (
                <p className="text-gray-400">Not In Library</p>
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
          <p className="mt-3 text-gray-400 text-2xl">
            <a href={novelData.authorLink}>{novelData.authorName}</a>
          </p>
          <p className="my-3 text-gray-400 text-2xl">
            Last Update: {novelData.lastUpdate}
          </p>
          <div className="mt-6 flex w-fit gap-2">
            {isNovelInLibrary ? (
              <button
                className="bg-red-500 w-[110px] hover:bg-red-700 text-white text-center font-bold py-2 px-4 rounded"
                onClick={async () => {
                  const isNovelDeleted = await deleteNovel(novelId);
                  if (isNovelDeleted) {
                    setSaveNovelTrigger(false);
                  }
                }}
              >
                Delete
              </button>
            ) : (
              <button
                className="bg-green-500 w-[110px] hover:bg-green-700 text-white text-center font-bold py-2 px-4 rounded"
                onClick={async () => {
                  await createNovel(novelData);
                  setSaveNovelTrigger(true);
                }}
              >
                Add
              </button>
            )}
            <button
              className="bg-blue-500 w-[110px] hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded"
              onClick={() => {
                dispatch(
                  toggleModal({
                    type: 'download',
                    downloadModal: true,
                  }),
                );
              }}
            >
              Download
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3">
        {novelData.chapters.map(
          (chapter: { title: string; link: string; updateDate: string }) => (
            <div
              className="text-center"
              key={`chapter-${chapter.link}`}
            >
              {' '}
              <a
                onClick={(event) => {
                  event.preventDefault();
                  window.location.href = 'chrome://newtab';
                  window.open(chapter.link, '_system');
                }}
                href={chapter.link}
              >
                {chapter.title}
              </a>
              <p className="text-gray-400 text-center">{chapter.updateDate}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default Novel;
