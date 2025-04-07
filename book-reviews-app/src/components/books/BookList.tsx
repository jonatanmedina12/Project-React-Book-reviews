import React from 'react';
import { Row, Col, Empty, Pagination, Spin } from 'antd';
import BookCard from './BookCard';
import { Book } from '../../types/Book';
import './BooksComponents.css';

interface BookListProps {
  books: Book[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
}

/**
 * Componente para mostrar una lista de libros en formato de cuadrícula
 * Incluye paginación y estados de carga/vacío
 */
const BookList: React.FC<BookListProps> = ({
  books,
  total,
  page,
  pageSize,
  onPageChange,
  loading = false,
}) => {
  // Mostrar indicador de carga
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Mostrar mensaje cuando no hay libros
  if (!loading && books.length === 0) {
    return (
      <Empty 
        className="modern-empty"
        description="No se encontraron libros" 
      />
    );
  }

  return (
    <div className="modern-books-list-container">
      <Row gutter={[16, 16]}>
        {books.map((book) => (
          <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: 24 }}>
        <Pagination
          className="modern-pagination"
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </Row>
    </div>
  );
};

export default BookList;