import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';

const ProgressModal = () => {
  const { serieName } = useSelector(
    (state: RootState) => state.novel.novelData,
  );
  const dispatch = useDispatch();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div className="bg-white mx-auto px-4 py-10 w-3/5 text-black"></div>
    </div>
  );
};

export default ProgressModal;
