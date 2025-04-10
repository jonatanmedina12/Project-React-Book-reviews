
import React, { useState, useEffect } from 'react';
import { Input, Select, Row, Col, Form, Button } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types/Category';
import './css/BookComponents.css';

const { Option } = Select;

// Interfaz que define las propiedades del componente
interface BookFiltersProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  defaultSearch?: string;
  defaultCategory?: string;
  className?: string;
}

/**
 * Componente para filtrar libros por título y categoría
 * Sigue el principio de responsabilidad única (SRP) para los filtros de búsqueda
 */
const BookFilters: React.FC<BookFiltersProps> = ({
  onSearch,
  onCategoryChange,
  defaultSearch = '',
  defaultCategory = '',
  className = '',
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Establecer valores iniciales cuando cambian las props
  useEffect(() => {
    form.setFieldsValue({
      search: defaultSearch,
      category: defaultCategory || undefined,
    });
  }, [defaultSearch, defaultCategory, form]);

  /**
   * Obtiene las categorías desde el servicio
   */
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

  /**
   * Maneja el envío del formulario
   * @param values Valores del formulario
   */
  const handleSubmit = (values: { search: string; category: string }) => {
    const { search, category } = values;
    onSearch(search);
    onCategoryChange(category || '');
  };

  /**
   * Limpia todos los filtros
   */
  const handleClear = () => {
    form.resetFields();
    onSearch('');
    onCategoryChange('');
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className={className}
      style={{ marginBottom: '24px' }}
      initialValues={{
        search: defaultSearch,
        category: defaultCategory || undefined,
      }}
    >
      <Row gutter={16}>
    
        
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item name="category" label="Categoría">
            <Select
              placeholder="Selecciona una categoría"
              allowClear
              loading={loading}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id.toString()}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={24} md={8} lg={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ marginRight: 8 }}>
              Filtrar
            </Button>
            <Button icon={<ClearOutlined />} onClick={handleClear}>
              Limpiar
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default BookFilters;