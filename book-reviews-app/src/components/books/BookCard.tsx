import React from 'react';
import { Card, Rate, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types/Book';
import './BooksComponents.css';

const { Text } = Typography;

interface BookCardProps {
  book: Book;
}

/**
 * Componente para mostrar la tarjeta de un libro
 * Implementa el estilo moderno que coincide con el diseño del login
 */
const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  /**
   * Navega al detalle del libro cuando se hace clic en la tarjeta
   */
  const handleClick = () => {
    navigate(`/books/${book.id}`);
  };

  // Imagen de portada predeterminada si no hay una disponible
  const coverImage = book.coverImage || 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <Card
      hoverable
      className="modern-book-card"
      bodyStyle={{ padding: 0 }}
      onClick={handleClick}
      cover={
        <div className="modern-book-cover-wrapper">
          <img
            alt={book.title}
            src={coverImage}
            className="modern-book-cover"
          />
        </div>
      }
    >
      <div className="modern-book-info">
        <Text className="modern-book-title" title={book.title}>
          {book.title}
        </Text>
        <Text className="modern-book-author">{book.author}</Text>
        <Text className="modern-book-category">{book.category}</Text>
        <div className="modern-book-rating">
          <Rate 
            disabled 
            defaultValue={book.averageRating} 
            allowHalf 
            style={{ fontSize: 14 }} 
          />
          <Text className="modern-book-reviews">({book.reviewCount})</Text>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;