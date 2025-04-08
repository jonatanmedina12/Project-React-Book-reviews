
import React from 'react';
import { Card, Typography, Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import BookCardImage from '../common/BookCardImage';
import { Book } from '../../types/Book';
import './css/BookComponents.css';

const { Meta } = Card;
const { Text, Paragraph } = Typography;

// Interfaz que define las propiedades del componente
interface BookCardProps {
  book: Book;
  onClick?: () => void;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  className = '',
}) => {
  const navigate = useNavigate();

  /**
   * Maneja el clic en la tarjeta
   * Si se proporciona una función onClick, la ejecuta; de lo contrario, navega a la página de detalles
   */
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/books/${book.id}`);
    }
  };

  return (
    <Card
      hoverable
      className={className}
      style={{ width: '100%', height: '100%' }}
      cover={
        <BookCardImage
          src={book.coverImageUrl}
          alt={book.title}
          height={250}
          onClick={handleCardClick}
        />
      }
      onClick={handleCardClick}
      actions={[
        <div key="rating">
          <Rate disabled defaultValue={book.averageRating} allowHalf style={{ fontSize: 12 }} />
          <div>
            <Text type="secondary">{book.averageRating.toFixed(1)} ({book.reviewCount})</Text>
          </div>
        </div>
      ]}
    >
      <Meta
        title={book.title}
        description={
          <div>
            <Paragraph style={{ margin: '0 0 8px 0' }}>{book.author}</Paragraph>
            {book.categoryName && (
              <Tag color="blue">{book.categoryName}</Tag>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default BookCard;