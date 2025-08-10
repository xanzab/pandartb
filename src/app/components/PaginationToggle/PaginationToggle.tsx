'use client';

import { Switch, Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchList, setLoadingMode } from '@/store/slices/listSlice';
import styles from './PaginationToggle.module.scss';
import type { RootState, AppDispatch } from '@/store';

const { Text } = Typography;

export const PaginationToggle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loadingMode, itemsPerPage } = useSelector(
    (state: RootState) => state.list
  );

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'infinite' : 'pagination';
    dispatch(setLoadingMode(newMode));

    const finalItemsPerPage = newMode === 'infinite' ? 10 : itemsPerPage;
    dispatch(fetchList({ page: 1, itemsPerPage: finalItemsPerPage }));
  };

  return (
    <div className={styles.toggle}>
      <Space>
        <Text>Пагинация</Text>
        <Switch
          checked={loadingMode === 'infinite'}
          onChange={handleModeChange}
          size="small"
        />
        <Text>Бесконечный скролл</Text>
      </Space>
    </div>
  );
};
