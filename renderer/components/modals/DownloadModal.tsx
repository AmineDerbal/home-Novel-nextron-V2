import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store'; // Make sure to import the correct RootState type
import { ipcRenderer } from 'electron';
import { toggleModal } from '../../redux/modal/modalSlice';
import {
  getDefaultDownloadPath,
  updateDefaultDownloadPath,
  updateDownloadProgress,
} from '../../utils/config';
import downlodaNovel from '../../services/downloadNovel';
import folderIcon from '../../assets';

const DownloadModal = () => {
  const { novelData } = useSelector((state: RootState) => state.novel);
  const dispatch = useDispatch();
  const [downloadPath, setDownloadPath] = useState('');
  const startDownload = async () => {
    await downlodaNovel(novelData);
  };

  const getDir = async () => {
    const defaultDownloadPath = await getDefaultDownloadPath();
    if (defaultDownloadPath.success) {
      const defaultPath = defaultDownloadPath.defaultDownloadPath;
      const selectedDirectory = await ipcRenderer.invoke(
        'open-directory-dialog',
        { defaultPath },
      );
      if (
        selectedDirectory &&
        (await updateDefaultDownloadPath(selectedDirectory))
      ) {
        setDownloadPath(selectedDirectory);
      }
    }
  };

  useEffect(() => {
    const getDownloadPath = async () => {
      const defaultDownloadPath = await getDefaultDownloadPath();
      if (defaultDownloadPath.success) {
        setDownloadPath(defaultDownloadPath.defaultDownloadPath);
      }
    };
    getDownloadPath();
  }, [downloadPath]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto"
      onClick={() =>
        dispatch(
          toggleModal({
            type: 'download',
            downloadModal: false,
          }),
        )
      }
    >
      <div
        className="bg-white mx-auto px-4 py-10 w-3/5 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-2xl">Save Location </p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={downloadPath}
            className="w-4/5 bg-white border border-black p-1"
            disabled
          />
          <img
            className="cursor-pointer"
            src={folderIcon.src}
            alt="Choose Folder"
            onClick={getDir}
          />
        </div>
        <div className=" mt-4 px-2 flex justify-end gap-2">
          <button
            className=" w-[110px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              await updateDownloadProgress({
                novelName: '',
                numberOfChapters: 0,
                currentChapter: 0,
                progress: 0,
              });
              dispatch(toggleModal({ type: 'download', downloadModal: false }));
              dispatch(
                toggleModal({
                  type: 'progress',
                  progressModal: true,
                }),
              );
              startDownload();
            }}
          >
            Download
          </button>
          <button
            className=" w-[110px] bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              dispatch(
                toggleModal({
                  type: 'download',
                  downloadModal: false,
                }),
              )
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DownloadModal;
