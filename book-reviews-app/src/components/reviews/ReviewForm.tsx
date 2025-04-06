// src/components/reviews/ReviewForm.tsx
import React, { useState } from 'react';
import { Form, Rate, Input, Button, Space, Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';

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

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Title level={5}>Debes iniciar sesión para dejar una reseña</Title>
        <Button type="primary" href="/login">
          Iniciar Sesión
        </Button>
      </div>
    );
  }

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
    <Form
      form={form}
      layout="vertical"
      initialValues={{ rating: initialRating, comment: initialComment }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="rating"
        label="Calificación"
        rules={[{ required: true, message: 'Por favor, selecciona una calificación' }]}
      >
        <Rate allowHalf />
      </Form.Item>
      <Form.Item
        name="comment"
        label="Comentario"
        rules={[{ required: true, message: 'Por favor, escribe un comentario' }]}
      >
        <TextArea rows={4} placeholder="Comparte tu opinión sobre este libro..." />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isUpdate ? 'Actualizar Reseña' : 'Enviar Reseña'}
          </Button>
          {onCancel && (
            <Button onClick={onCancel}>Cancelar</Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;