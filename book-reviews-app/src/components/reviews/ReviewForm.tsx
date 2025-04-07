// src/components/reviews/ReviewForm.tsx
import React, { useState } from 'react';
import { Form, Rate, Input, Button, Space, Typography } from 'antd';
import { StarOutlined, CommentOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './ReviewsComponents.css';

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
 * Componente para crear o editar reseñas
 * Con estilo moderno que coincide con el diseño del sistema
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

  // Si el usuario no está autenticado, mostrar mensaje de inicio de sesión
  if (!isAuthenticated) {
    return (
      <div className="modern-auth-required">
        <Title level={5}>Debes iniciar sesión para dejar una reseña</Title>
        <Button 
          type="primary" 
          href="/login" 
          icon={<LoginOutlined />}
          className="modern-login-button"
        >
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (values: { rating: number; comment: string }) => {
    try {
      setLoading(true);
      await onSubmit(values.rating, values.comment);
      if (!isUpdate) {
        form.resetFields();
      }
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-review-form">
      <Title level={4} className="modern-form-title">
        {isUpdate ? 'Actualizar reseña' : 'Dejar una reseña'}
      </Title>
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{ rating: initialRating, comment: initialComment }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="rating"
          label={
            <span>
              <StarOutlined style={{ marginRight: 8 }} />
              Calificación
            </span>
          }
          rules={[{ required: true, message: 'Por favor, selecciona una calificación' }]}
        >
          <Rate className="modern-rate-input" allowHalf />
        </Form.Item>
        
        <Form.Item
          name="comment"
          label={
            <span>
              <CommentOutlined style={{ marginRight: 8 }} />
              Comentario
            </span>
          }
          rules={[{ required: true, message: 'Por favor, escribe un comentario' }]}
        >
          <TextArea 
            className="modern-textarea"
            rows={4} 
            placeholder="Comparte tu opinión sobre este libro..."
          />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="modern-submit-button"
            >
              {isUpdate ? 'Actualizar Reseña' : 'Enviar Reseña'}
            </Button>
            
            {onCancel && (
              <Button 
                onClick={onCancel}
                className="modern-cancel-button"
              >
                Cancelar
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ReviewForm;