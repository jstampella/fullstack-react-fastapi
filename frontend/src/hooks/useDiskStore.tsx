import { useDispatch } from 'react-redux';
import { useAppSelector } from '.';
import { IDisk } from '../interfaces';
import { onChangeStatus, onClearErrorMessage, onList, onSetError, statusDisk } from '../store/disk';
import { getAllDisksApi } from '../api/disk.api';


export const useDiskStore = () => {
  const { status, errorMessage, disk, listDisks } = useAppSelector(
    (state) => state.disk
  );
  const dispatch = useDispatch();

  const getDisks = async (): Promise<IDisk[] | undefined> => {
    dispatch(onChangeStatus(statusDisk.checking));
    try {
      const list = await getAllDisksApi();
      dispatch(onList(list));
      return list;
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };


  return {
    // propiedades
    status,
    errorMessage,
    listDisks,
    disk,
    // metodos
    getDisks
  };
};
