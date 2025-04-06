import React from 'react';
import { Card, Rate, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types/Book';

const { Meta } = Card;
const { Text } = Typography;

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/books/${book.id}`);
  };

  // Imagen de portada predeterminada si no hay una disponible
  const coverImage = book.coverImage || 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <Card
      hoverable
      style={{ width: '100%', marginBottom: 16 }}
      cover={
        <div style={{ overflow: 'hidden', height: 300 }}>
          <img
            alt={book.title}
            src={coverImage}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      }
      onClick={handleClick}
    >
      <Meta
        title={book.title}
        description={
          <>
            <Text style={{ display: 'block' }}>{book.author}</Text>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              {book.category}
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Rate disabled defaultValue={book.averageRating} allowHalf style={{ fontSize: 14 }} />
              <Text type="secondary">({book.reviewCount})</Text>
            </div>
          </>
        }
      />
    </Card>
  );
};

export default BookCard;