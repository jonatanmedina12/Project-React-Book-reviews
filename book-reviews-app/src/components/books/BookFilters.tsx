import React, { useState, useEffect } from 'react';
import { Select, Space, Form, Input, Button, Divider } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { getCategories } from '../../services/bookService';

const { Option } = Select;

interface BookFiltersProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  defaultSearch?: string;
  defaultCategory?: string;
}

const BookFilters: React.FC<BookFiltersProps> = ({
  onSearch,
  onCategoryChange,
  defaultSearch = '',
  defaultCategory = '',
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>(defaultSearch);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange(value);
  };

  const handleSearch = () => {
    onSearch(search);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    onSearch('');
    onCategoryChange('');
  };

  return (
    <Form layout="vertical" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <Form.Item
          label="Buscar libros"
          style={{ flex: 1, minWidth: '250px' }}
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Título, autor..."
            value={search}
            onChange={handleSearchChange}
            onPressEnter={handleSearch}
          />
        </Form.Item>
        <Form.Item
          label="Categoría"
          style={{ flex: 1, minWidth: '200px' }}
        >
          <Select
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
            >
              Filtrar
            </Button>
            <Button onClick={handleReset}>Limpiar</Button>
          </Space>
        </Form.Item>
      </div>
      <Divider />
    </Form>
  );
};

export default BookFilters;