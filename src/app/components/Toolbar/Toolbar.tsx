'use client';

import { Divider } from 'antd';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

const PaginationToggle = dynamic(
  () =>
    import('../PaginationToggle/PaginationToggle').then((mod) => ({
      default: mod.PaginationToggle,
    })),
  {
    ssr: false,
  }
);

const ThemeToggle = dynamic(
  () =>
    import('../Theme/ThemeToggle/ThemeToggle').then((mod) => ({
      default: mod.ThemeToggle,
    })),
  {
    ssr: false,
  }
);

export const Toolbar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const styles = require('./Toolbar.module.scss');

  return (
    <div className={styles.toolbar}>
      <ThemeToggle />
      <Divider type="vertical" className={styles.separator} />
      <PaginationToggle />
    </div>
  );
};
