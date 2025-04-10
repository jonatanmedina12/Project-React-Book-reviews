import React, { useState, useEffect } from 'react';
import { Form, Rate, Input, Button, Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';
import './css/ReviewForm.css';

const { TextArea } = Input;
const { Title } = Typography;

interface ReviewFormProps {
  bookId?: string;
  initialRating?: number;
  initialComment?: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel?: () => void;
  isUpdate?: boolean;
  loading?: boolean;
}

/**
 * Componente para crear o editar reseñas de libros
 * Sigue el principio de responsabilidad única (SRP) para la gestión de formularios de reseñas
 */
const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  initialRating = 0,
  initialComment = '',
  onSubmit,
  onCancel,
  isUpdate = false,
  loading: externalLoading = false,
}) => {
  const { isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Asegurarnos de que el rating inicial sea un entero entre 1 y 5
  const defaultRating = Math.round(Math.max(1, Math.min(5, initialRating || 3)));
  const [currentRating, setCurrentRating] = useState(defaultRating);

  // Establecer los valores iniciales cuando cambian las props, asegurando que sean enteros
  useEffect(() => {
    const validRating = Math.round(Math.max(1, Math.min(5, initialRating || 3)));
    form.setFieldsValue({
      rating: validRating,
      comment: initialComment || ''
    });
    setCurrentRating(validRating);
  }, [initialRating, initialComment, form]);

  // Si el usuario no está autenticado, mostrar mensaje para iniciar sesión
  if (!isAuthenticated) {
    return (
      <div className="review-login-container">
        <Title level={5} className="review-login-title">
          Debes iniciar sesión para dejar una reseña
        </Title>
        <Button type="primary" href="/login" className="review-login-button">
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  /**
   * Maneja el envío del formulario
   * @param values Valores del formulario (rating y comment)
   */
  const handleSubmit = async (values: { rating: number; comment: string }) => {
    try {
      setLoading(true);
      // Verificar que rating sea un valor entero entre 1 y 5
      const validRating = Math.round(Math.max(1, Math.min(5, values.rating || 3)));
      
      console.log('Enviando reseña con rating:', validRating, 'y comentario:', values.comment);
      
      // Pasamos rating y comment directamente
      await onSubmit(validRating, values.comment);
      if (!isUpdate) {
        form.resetFields();
        setCurrentRating(3); // Restablecer a 3 estrellas
      }
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio en la calificación
   * @param value Nueva calificación
   */
  const handleRatingChange = (value: number) => {
    // Asegurarse de que no sea undefined, null o 0 y que sea un entero
    const validValue = Math.round(Math.max(1, Math.min(5, value || 3)));
    setCurrentRating(validValue);
    form.setFieldsValue({ rating: validValue });
  };

  // Obtener el texto correspondiente a la calificación actual
  const getRatingText = (rating: number) => {
    const texts = ['Sin calificar', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
    return texts[Math.min(5, Math.max(0, Math.round(rating)))];
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ 
        rating: defaultRating,
        comment: initialComment || '' 
      }}
      onFinish={handleSubmit}
      className="review-form"
    >
      <Title level={4} className="review-form-title">
        {isUpdate ? 'Editar tu reseña' : 'Escribe una reseña'}
      </Title>
      
      <Form.Item
        name="rating"
        label="Calificación"
        rules={[{ required: true, message: 'Por favor, selecciona una calificación' }]}
        className="review-form-item"
      >
        <div className="review-rating-container">
          <Rate 
            allowHalf={false} // Deshabilitar valores de media estrella
            className="review-rating" 
            onChange={handleRatingChange}
            value={currentRating}
          />
          <span className="review-rating-text">{getRatingText(currentRating)}</span>
        </div>
      </Form.Item>
      
      <Form.Item
        name="comment"
        label="Comentario"
        rules={[{ required: true, message: 'Por favor, escribe un comentario' }]}
        className="review-form-item"
      >
        <TextArea 
          rows={4} 
          placeholder="Comparte tu opinión sobre este libro..." 
          className="review-form-textarea"
          maxLength={1000}
          showCount
        />
      </Form.Item>
      
      <Form.Item>
        <div className="review-form-buttons">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading || externalLoading}
            className="review-submit-button"
          >
            {isUpdate ? 'Actualizar Reseña' : 'Enviar Reseña'}
          </Button>
          
          {onCancel && (
            <Button 
              onClick={onCancel}
              className="review-cancel-button"
            >
              Cancelar
            </Button>
          )}
        </div>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;