
// src/components/books/BookList.tsx
import React from 'react';
import { Row, Col, Empty, Pagination } from 'antd';
import BookCard from './BookCard';
import { Book } from '../../types/Book';

interface BookListProps {
  books: Book[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
}

const BookList: React.FC<BookListProps> = ({
  books,
  total,
  page,
  pageSize,
  onPageChange,
  loading,
}) => {
  if (!loading && books.length === 0) {
    return <Empty description="No se encontraron libros" />;
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {books.map((book) => (
          <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: 24 }}>
        <Pagination
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
