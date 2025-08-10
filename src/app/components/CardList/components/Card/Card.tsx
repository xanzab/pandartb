import { PictureOutlined } from '@ant-design/icons';
import { Card as AntCard } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { formatDate } from '@/utils/date';
import styles from './Card.module.scss';
import type { Item } from '@/types/cardList';

const { Meta } = AntCard;

interface CardProps {
  item: Item;
  loadingMode?: 'pagination' | 'infinite';
}

export const Card = ({ item, loadingMode = 'pagination' }: CardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderCover = () => {
    if (!item.imgUrl || imageError) {
      return (
        <div className={styles.placeholder}>
          <PictureOutlined className={styles.placeholderIcon} />
        </div>
      );
    }

    return (
      <div className={styles.imageContainer}>
        <Image
          src={item.imgUrl}
          alt={item.title}
          width={320}
          height={180}
          className={styles.image}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRUIj"
          priority={false}
          loading="lazy"
          onError={handleImageError}
        />
      </div>
    );
  };

  const cardClassName = `${styles.card} ${loadingMode === 'infinite' ? styles.fixedHeight : ''}`;

  return (
    <AntCard
      className={cardClassName}
      cover={renderCover()}
      extra={<small className={styles.date}>{formatDate(item.date)}</small>}
      title={item.title}
      hoverable
    >
      <Meta description={item.message} />
    </AntCard>
  );
};
