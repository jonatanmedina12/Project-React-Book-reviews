/**
 * @file Home.tsx
 * @description Página principal que muestra la lista de libros con filtros y paginación
 */
import React, { useEffect, useState } from 'react';
import { Typography, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import BookList from '../../components/books/BookList';
import BookFilters from '../../components/books/BookFilters';
import { getBooks } from '../../services/bookService';
import { Book } from '../../types/Book';
import './css/Home.css';

const { Title } = Typography;

/**
 * Componente de la página principal
 * Sigue el principio de responsabilidad única (SRP) para la página principal
 */
const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);

  // Obtener parámetros de búsqueda de la URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  // Cargar libros cuando cambian los filtros o la página
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category]);

  /**
   * Obtiene los libros desde el servicio con los filtros aplicados
   */
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const categoryId = category ? parseInt(category) : undefined;
      const data = await getBooks(page, pageSize, search, categoryId);
      setBooks(data.books);
      setTotal(data.total);
    } catch (error) {
      console.error('Error al obtener libros:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio de página
   * @param newPage Número de la nueva página
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  /**
   * Maneja la búsqueda por texto
   * @param searchValue Texto a buscar
   */
  const handleSearch = (searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
    setPage(1);
  };

  /**
   * Maneja el cambio de categoría
   * @param categoryValue ID de la categoría seleccionada
   */
  const handleCategoryChange = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryValue) {
      params.set('category', categoryValue);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div>
      <Title level={2}>Descubre Libros</Title>
      
      <BookFilters
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        defaultSearch={search}
        defaultCategory={category}
      />

      {loading && books.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <BookList
          books={books}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Home;