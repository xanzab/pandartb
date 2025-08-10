'use client';

import { Spin } from 'antd';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '../Card';
import styles from './VirtualizedCardList.module.scss';
import type { Item } from '@/types/cardList';

interface VirtualizedCardListProps {
  items: Item[];
  hasMore: boolean;
  onLoadMore: () => void;
}

const ITEM_HEIGHT = 375;
const OVERSCAN = 2;

const getItemsPerRow = (width: number): number => {
  if (width <= 480) return 1;
  if (width <= 768) return 2;
  if (width <= 1200) return 3;
  return 4;
};

export const VirtualizedCardList = ({
  items,
  hasMore,
  onLoadMore,
}: VirtualizedCardListProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerTop, setContainerTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const itemsPerRow = useMemo(() => {
    return getItemsPerRow(viewportWidth);
  }, [viewportWidth]);

  const rows: Item[][] = useMemo(() => {
    const result = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      result.push(items.slice(i, i + itemsPerRow));
    }
    return result;
  }, [items, itemsPerRow]);

  const totalHeight = rows.length * ITEM_HEIGHT + (hasMore ? ITEM_HEIGHT : 0);

  useEffect(() => {
    const updatePositions = () => {
      const container = document.querySelector(
        '[data-virtualized-container]'
      ) as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        setContainerTop(rect.top + window.scrollY);
      }
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };

    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    updatePositions();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updatePositions);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePositions);
    };
  }, []);

  const { startIndex, endIndex, visibleRows } = useMemo(() => {
    const containerStart = containerTop;
    const containerEnd = containerTop + totalHeight;
    const viewportStart = scrollTop;
    const viewportEnd = scrollTop + viewportHeight;

    if (containerEnd < viewportStart || containerStart > viewportEnd) {
      return { startIndex: 0, endIndex: -1, visibleRows: [] };
    }

    const relativeScrollTop = Math.max(0, viewportStart - containerStart);
    const relativeScrollBottom = Math.min(
      totalHeight,
      viewportEnd - containerStart
    );

    const start = Math.max(
      0,
      Math.floor(relativeScrollTop / ITEM_HEIGHT) - OVERSCAN
    );
    const end = Math.min(
      rows.length - 1,
      Math.ceil(relativeScrollBottom / ITEM_HEIGHT) + OVERSCAN
    );

    return {
      startIndex: start,
      endIndex: end,
      visibleRows: rows.slice(start, end + 1),
    };
  }, [scrollTop, containerTop, viewportHeight, totalHeight, rows]);

  const checkLoadMore = useCallback(() => {
    if (hasMore && endIndex >= rows.length - 3) {
      onLoadMore();
    }
  }, [hasMore, endIndex, rows.length, onLoadMore]);

  useEffect(() => {
    checkLoadMore();
  }, [checkLoadMore]);

  return (
    <div
      className={styles.container}
      data-virtualized-container
      style={{ height: totalHeight }}
    >
      {visibleRows.map((rowItems, virtualIndex) => {
        const realIndex = startIndex + virtualIndex;
        return (
          <div
            key={realIndex}
            className={styles.row}
            style={{
              top: realIndex * ITEM_HEIGHT,
              height: ITEM_HEIGHT,
            }}
          >
            {rowItems.map((item, itemIndex) => (
              <div
                key={`${item.id}-${realIndex}-${itemIndex}`}
                className={styles.cardWrapper}
              >
                <Card item={item} loadingMode="infinite" />{' '}
                {/* ✅ Передаем режим */}
              </div>
            ))}
          </div>
        );
      })}

      {hasMore && endIndex >= rows.length - 1 && (
        <div
          className={styles.loadingRow}
          style={{
            top: rows.length * ITEM_HEIGHT,
            height: ITEM_HEIGHT,
          }}
        >
          <Spin />
        </div>
      )}
    </div>
  );
};
