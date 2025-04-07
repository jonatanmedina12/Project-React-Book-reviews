import React, { useState, useEffect } from 'react';
import { Select, Space, Form, Input, Button, Divider } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { getCategories } from '../../services/bookService';
import './BooksComponents.css';

const { Option } = Select;

interface BookFiltersProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  defaultSearch?: string;
  defaultCategory?: string;
}

/**
 * Componente para filtrar y buscar libros
 * Utiliza estilos modernos que coinciden con el diseño del login
 */
const BookFilters: React.FC<BookFiltersProps> = ({
  onSearch,
  onCategoryChange,
  defaultSearch = '',
  defaultCategory = '',
}) => {
  // Estado local
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>(defaultSearch);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Cargar categorías al montar el componente
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Maneja cambios en el campo de búsqueda
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  /**
   * Maneja cambios en la selección de categoría
   */
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange(value);
  };

  /**
   * Aplica los filtros de búsqueda
   */
  const handleSearch = () => {
    onSearch(search);
  };

  /**
   * Restablece todos los filtros
   */
  const handleReset = () => {
    setSearch('');
    setCategory('');
    onSearch('');
    onCategoryChange('');
  };

  return (
    <div className="modern-filters-container">
      <Form layout="vertical" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <Form.Item
            label="Buscar libros"
            className="modern-filters-form-item"
            style={{ flex: 2, minWidth: '250px' }}
          >
            <Input
              className="modern-input-search"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Título, autor..."
              value={search}
              onChange={handleSearchChange}
              onPressEnter={handleSearch}
            />
          </Form.Item>
          <Form.Item
            label="Categoría"
            className="modern-filters-form-item"
            style={{ flex: 1, minWidth: '200px' }}
          >
            <Select
              className="modern-select"
              placeholder="Selecciona una categoría"
              style={{ width: '100%' }}
              value={category || undefined}
              onChange={handleCategoryChange}
              loading={loading}
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label=" " style={{ alignSelf: 'flex-end' }}>
            <Space>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleSearch}
                className="modern-filter-button"
              >
                Filtrar
              </Button>
              <Button 
                onClick={handleReset} 
                className="modern-reset-button"
                icon={<ReloadOutlined />}
              >
                Limpiar
              </Button>
            </Space>
          </Form.Item>
        </div>
        <Divider style={{ margin: '8px 0 0 0' }} />
      </Form>
    </div>
  );
};

export default BookFilters;