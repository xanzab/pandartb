"use client";

import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      className={styles.toggle}
      type="text"
      icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
      onClick={toggleTheme}
      size="large"
    />
  );
};