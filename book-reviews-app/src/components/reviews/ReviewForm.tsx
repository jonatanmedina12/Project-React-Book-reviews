import React, { useState } from 'react';
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
}) => {
  const { isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentRating, setCurrentRating] = useState(initialRating);

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
      await onSubmit(values.rating, values.comment);
      if (!isUpdate) {
        form.resetFields();
        setCurrentRating(0);
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
    setCurrentRating(value);
  };

  // Obtener el texto correspondiente a la calificación actual
  const getRatingText = (rating: number) => {
    const texts = ['Sin calificar', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
    return texts[Math.floor(rating)];
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ rating: initialRating, comment: initialComment }}
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
            allowHalf 
            className="review-rating" 
            onChange={handleRatingChange}
          />
          {currentRating > 0 && (
            <span className="review-rating-text">{getRatingText(currentRating)}</span>
          )}
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
        />
      </Form.Item>
      
      <Form.Item>
        <div className="review-form-buttons">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
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