'use client';

import { Spin, Alert, Pagination } from 'antd';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { fetchList, setPage, setItemsPerPage } from '@/store/slices/listSlice';
import styles from './CardList.module.scss';
import { Card } from './components/Card';
import { VirtualizedCardList } from './components/VirtualizedCardList';
import type { RootState, AppDispatch } from '@/store';

export const CardList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    loading,
    error,
    page,
    total,
    itemsPerPage,
    loadingMode,
    hasMore,
  } = useSelector((state: RootState) => state.list);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchList({ page: 1, itemsPerPage }));
    }
  }, [dispatch, loadingMode, items.length, itemsPerPage]);

  useEffect(() => {
    if (loadingMode === 'pagination' && page > 1) {
      dispatch(fetchList({ page, itemsPerPage }));
    }
  }, [dispatch, page, loadingMode, itemsPerPage]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== itemsPerPage) {
      dispatch(setItemsPerPage(newPageSize));
      dispatch(fetchList({ page: 1, itemsPerPage: newPageSize }));
    } else {
      dispatch(setPage(newPage));
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore && loadingMode === 'infinite') {
      const nextPage = page + 1;
      dispatch(setPage(nextPage));
      dispatch(fetchList({ page: nextPage, itemsPerPage }));
    }
  }, [dispatch, loading, hasMore, loadingMode, page, itemsPerPage]);

  useInfiniteScroll(hasMore, loading, loadMore);

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (loading && items.length === 0) {
    return (
      <div className={styles.spinner}>
        <Spin size="large" />
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className={styles.container}>
        <Alert type="info" message="Нет данных" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {loadingMode === 'infinite' ? (
        <VirtualizedCardList
          items={items}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      ) : (
        <>
          <div className={styles.grid}>
            {items.map((item, index) => (
              <Card
                key={`${item.id}-${index}`}
                item={item}
                loadingMode={loadingMode}
              />
            ))}
          </div>

          {total > itemsPerPage && (
            <div className={styles.pagination}>
              <Pagination
                current={page}
                total={total}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showSizeChanger={true}
                pageSizeOptions={['5', '10', '20', '50']}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} из ${total} элементов`
                }
                responsive={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
