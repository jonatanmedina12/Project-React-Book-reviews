import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, InputNumber, Select, message } from 'antd';
import { Book } from '../../types/Book';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types/Category';
import BookImageUpload from '../common/BookImageUpload';
import './css/BookForm.css';

const { TextArea } = Input;
const { Option } = Select;

// Interfaz que define las propiedades del componente
interface BookFormProps {
  initialValues?: Partial<Book>;
  onSubmit: (bookData: Partial<Book>) => Promise<void>;
  loading?: boolean;
  isUpdate?: boolean;
}

/**
 * Componente de formulario para crear o editar libros
 * Sigue el principio de responsabilidad única (SRP) para la gestión de formularios de libros
 */
const BookForm: React.FC<BookFormProps> = ({
  initialValues,
  onSubmit,
  loading = false,
  isUpdate = false,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [summaryValue, setSummaryValue] = useState<string>('');

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Establecer valores iniciales cuando cambian
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setCoverImageUrl(initialValues.coverImageUrl || '');
      setSummaryValue(initialValues.summary || '');
    }
  }, [initialValues, form]);

  /**
   * Obtiene las categorías desde el servicio
   */
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      message.error('Error al cargar las categorías');
    } finally {
      setLoadingCategories(false);
    }
  };

  /**
   * Maneja el cambio en el campo de resumen
   * @param e Evento de cambio
   */
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSummaryValue(value);
    // Actualiza el valor en el formulario para mantenerlos sincronizados
    form.setFieldsValue({ summary: value });
  };

  /**
   * Maneja el envío del formulario
   * @param values Valores del formulario
   */
  const handleSubmit = async (values: any) => {
    // Incluir la URL de la imagen en los valores del formulario
    const bookData = {
      ...values,
      coverImageUrl,
      summary: summaryValue, // Asegura que se usa el valor controlado
    };
    
    try {
      await onSubmit(bookData);
      if (!isUpdate) {
        form.resetFields();
        setCoverImageUrl('');
        setSummaryValue('');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues || {}}
      disabled={loading}
      className="book-form"
    >
      <Row gutter={[16, 16]}>
        {/* Columna izquierda: Imagen */}
        <Col xs={24} sm={8} md={6} lg={5}>
          <Form.Item label="Imagen de portada" required={false} className="book-form-item">
            <div className="book-cover-container">
              <div className="book-cover-preview">
                <BookImageUpload
                  value={coverImageUrl}
                  onChange={url => setCoverImageUrl(url)}
                  disabled={loading}
                />
              </div>
            </div>
          </Form.Item>
        </Col>
        
        {/* Columna derecha: Datos del libro */}
        <Col xs={24} sm={16} md={18} lg={19}>
          <Row gutter={[16, 16]}>
            {/* Título */}
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Título"
                rules={[{ required: true, message: 'Por favor ingresa el título' }]}
                className="book-form-item"
              >
                <Input 
                  placeholder="Título del libro" 
                  maxLength={200} 
                  className="book-form-input"
                />
              </Form.Item>
            </Col>
            
            {/* Autor */}
            <Col xs={24} md={12}>
              <Form.Item
                name="author"
                label="Autor"
                rules={[{ required: true, message: 'Por favor ingresa el autor' }]}
                className="book-form-item"
              >
                <Input 
                  placeholder="Nombre del autor" 
                  maxLength={150} 
                  className="book-form-input"
                />
              </Form.Item>
            </Col>
            
            {/* Categoría */}
            <Col xs={24} md={12}>
              <Form.Item
                name="categoryId"
                label="Categoría"
                rules={[{ required: true, message: 'Por favor selecciona una categoría' }]}
                className="book-form-item"
              >
                <Select
                  placeholder="Selecciona una categoría"
                  loading={loadingCategories}
                  disabled={loading || loadingCategories}
                  className="book-form-input"
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            {/* ISBN */}
            <Col xs={24} md={12}>
              <Form.Item
                name="isbn"
                label="ISBN"
                className="book-form-item"
              >
                <Input 
                  placeholder="ISBN del libro" 
                  maxLength={20} 
                  className="book-form-input"
                />
              </Form.Item>
            </Col>
            
            {/* Año de publicación */}
            <Col xs={24} md={8}>
              <Form.Item
                name="publishedYear"
                label="Año de publicación"
                rules={[
                  { 
                    type: 'number', 
                    min: 1000, 
                    max: new Date().getFullYear() + 5, 
                    message: 'Ingresa un año válido' 
                  }
                ]}
                className="book-form-item"
              >
                <InputNumber 
                  placeholder="Año" 
                  style={{ width: '100%' }} 
                  min={1000} 
                  max={new Date().getFullYear() + 5} 
                  className="book-form-input"
                />
              </Form.Item>
            </Col>
            
            {/* Editorial */}
            <Col xs={24} md={8}>
              <Form.Item
                name="publisher"
                label="Editorial"
                className="book-form-item"
              >
                <Input 
                  placeholder="Editorial" 
                  maxLength={100}
                  className="book-form-input"
                />
              </Form.Item>
            </Col>
            
            {/* Número de páginas */}
            <Col xs={24} md={8}>
              <Form.Item
                name="pages"
                label="Páginas"
                rules={[
                  { 
                    type: 'number', 
                    min: 1, 
                    message: 'Ingresa un número válido de páginas' 
                  }
                ]}
                className="book-form-item"
              >
                <InputNumber 
                  placeholder="Número de páginas" 
                  style={{ width: '100%' }} 
                  min={1} 
                  className="book-form-input"
                />
              </Form.Item>
            </Col>
            
            {/* Idioma */}
            <Col xs={24} md={12}>
              <Form.Item
                name="language"
                label="Idioma"
                className="book-form-item"
              >
                <Input 
                  placeholder="Idioma del libro" 
                  maxLength={50}
                  className="book-form-input"
                />
              </Form.Item>
            </Col>
            
            {/* Resumen - Control manual */}
            <Col xs={24}>
              <Form.Item
                name="summary"
                label="Resumen"
                rules={[{ required: true, message: 'Por favor ingresa un resumen' }]}
                className="book-form-item"
              >
                <TextArea 
                  placeholder="Resumen del libro" 
                  rows={4} 
                  maxLength={1000}
                  showCount
                  value={summaryValue}
                  onChange={handleSummaryChange}
                  className="book-form-textarea"
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      
      {/* Botones de acción */}
      <div className="book-form-actions">
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          className="book-form-button"
        >
          {isUpdate ? 'Actualizar libro' : 'Crear libro'}
        </Button>
      </div>
    </Form>
  );
};

export default BookForm;