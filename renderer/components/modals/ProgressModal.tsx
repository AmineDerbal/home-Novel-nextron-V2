import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '../../redux/store';
import ProgressBar from '@ramonak/react-progress-bar';
import { getProgress } from '../../services/novel';
import { toggleModal } from '../../redux/modal/modalSlice';
import { setDownloadSuccess } from '../../redux/download/downloadSlice';
import downlodaNovel from '../../services/downloadNovel';

const ProgressModal = () => {
  const { downloadSuccess } = useSelector((state: RootState) => state.download);
  const { novelData } = useSelector((state: RootState) => state.novel);
  const { progressModal } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  const [isProgress, setIsProgress] = useState(0);
  const [isNovelName, setIsNovelName] = useState('');
  const [isNumberOfChapters, setIsNumberOfChapters] = useState(0);
  const [isCurrentChapter, setIsCurrentChapter] = useState(0);

  const startDownload = async () => {
    dispatch(setDownloadSuccess({ type: 'success', downloadSuccess: null }));
    const success = await downlodaNovel(novelData);
    success
      ? dispatch(setDownloadSuccess({ type: 'success', downloadSuccess: true }))
      : dispatch(
          setDownloadSuccess({ type: 'success', downloadSuccess: false }),
        );
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProgress();
      if (data.success) {
        const { novelName, numberOfChapters, currentChapter, progress } =
          data.progress;
        if (isNovelName !== novelName) {
          setIsNovelName(novelName);
        }
        if (isNumberOfChapters !== numberOfChapters) {
          setIsNumberOfChapters(numberOfChapters);
        }
        if (isCurrentChapter !== currentChapter || isProgress !== progress) {
          setIsCurrentChapter(currentChapter);
          setIsProgress(progress);
        }
      }
    };

    if (progressModal) {
      startDownload();
      fetchData();
      const interval = setInterval(async () => {
        if (isProgress === 100) {
          clearInterval(interval);
        }
        fetchData();
      }, 500);
      return () => {
        clearInterval(interval);
      };
    }
  }, [progressModal]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto"
      onClick={() => {
        dispatch(toggleModal({ type: 'progress', progressModal: false }));
      }}
    >
      <div className="bg-white mx-auto px-4 py-10 w-3/5 text-black">
        <p>Novel name: {isNovelName}</p>
        <p>Current chapter: {isCurrentChapter}</p>{' '}
        <p>Total chapters: {isNumberOfChapters}</p>
        <ProgressBar
          completed={isProgress}
          maxCompleted={100}
          labelAlignment="center"
        />
        {downloadSuccess === null ? (
          <div className="flex justify-end py-4">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Stop download
            </button>
          </div>
        ) : downloadSuccess ? (
          <>
            <p>Download success</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                dispatch(
                  toggleModal({ type: 'progress', progressModal: false }),
                )
              }
            >
              Exit
            </button>
          </>
        ) : (
          <>
            <p>Download failed</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                dispatch(
                  toggleModal({ type: 'progress', progressModal: false }),
                )
              }
            >
              Exit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
