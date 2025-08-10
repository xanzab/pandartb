import { useEffect, useCallback } from 'react';

export const useInfiniteScroll = (
  hasMore: boolean,
  loading: boolean,
  onLoadMore: () => void,
  threshold: number = 100
) => {
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    checkScrollPosition: handleScroll
  };
};