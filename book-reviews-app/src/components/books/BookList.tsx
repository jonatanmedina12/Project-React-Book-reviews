
import React from 'react';
import { Row, Col, Empty, Spin, Pagination } from 'antd';
import BookCard from './BookCard';
import { Book } from '../../types/Book';
import './css/BookComponents.css';

// Interfaz que define las propiedades del componente
interface BookListProps {
  books: Book[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onBookClick?: (book: Book) => void;
  className?: string;
}

/**
 * Componente para mostrar una lista de libros en formato de grid con paginación
 * Sigue el principio de responsabilidad única (SRP) para la visualización de listas de libros
 */
const BookList: React.FC<BookListProps> = ({
  books,
  loading = false,
  total = 0,
  page = 1,
  pageSize = 12,
  onPageChange,
  onBookClick,
  className = '',
}) => {
  // Si está cargando y no hay libros, mostramos un spinner
  if (loading && books.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Si no hay libros y no está cargando, mostramos un mensaje
  if (!loading && books.length === 0) {
    return (
      <Empty
        description="No se encontraron libros"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className={className}>
      <Row gutter={[16, 24]}>
        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <BookCard
              book={book}
              onClick={onBookClick ? () => onBookClick(book) : undefined}
            />
          </Col>
        ))}
      </Row>
      
      {/* Paginación */}
      {total > pageSize && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default BookList;