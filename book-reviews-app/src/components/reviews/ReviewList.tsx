import React, { useState } from 'react';
import { List, Rate, Typography, Space, Divider, Button, Popconfirm, Empty } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';
import { Review } from '../../types/Review';
import { useAuth } from '../../context/AuthContext';
import ReviewForm from './ReviewForm';
import './css/ReviewList.css';

const { Text, Paragraph, Title } = Typography;

// Configuramos el locale para moment
moment.locale('es');

// Interfaz para las propiedades del componente
interface ReviewListProps {
  reviews: Review[];
  bookId?: string;
  loading?: boolean;
  onDeleteReview?: (reviewId: string) => Promise<void>;
  onUpdateReview?: (reviewId: string, rating: number, comment: string) => Promise<void>;
  showBookInfo?: boolean;
}

/**
 * Componente para mostrar una lista de reseñas con funcionalidades de edición y eliminación
 * Sigue el principio de responsabilidad única (SRP) para manejar la visualización y edición de reseñas
 */
const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  bookId,
  loading = false,
  onDeleteReview,
  onUpdateReview,
  showBookInfo = false,
}) => {
  const { user } = useAuth();
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  /**
   * Maneja el clic en el botón de editar
   * @param reviewId ID de la reseña a editar
   */
  const handleEditClick = (reviewId: number) => {
    setEditingReviewId(reviewId);
  };

  /**
   * Maneja la cancelación de la edición
   */
  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  /**
   * Maneja la actualización de una reseña
   * @param reviewId ID de la reseña a actualizar
   * @param rating Nueva calificación
   * @param comment Nuevo comentario
   */
  const handleUpdateReview = async (reviewId: number, rating: number, comment: string) => {
    if (onUpdateReview) {
      // Convertir reviewId a string para la llamada a la API
      await onUpdateReview(reviewId.toString(), rating, comment);
      setEditingReviewId(null);
    }
  };

  // Si no hay reseñas, mostramos un mensaje
  if (!loading && reviews.length === 0) {
    return (
      <div className="review-list-container">
        <Empty
          description="No hay reseñas disponibles"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="review-list-empty"
        />
      </div>
    );
  }

  return (
    <div className="review-list-container">
      <List
        itemLayout="vertical"
        dataSource={reviews}
        loading={loading}
        className="review-list"
        renderItem={(review) => {
          // Convertir user.id a número para comparar con review.userId
          const isCurrentUserReview = user ? parseInt(user.id) === review.userId : false;
          const isEditing = editingReviewId === review.id;

          return (
            <List.Item
              key={review.id}
              actions={
                isCurrentUserReview && !isEditing
                  ? [
                      <div className="review-action-buttons" key="actions">
                        <Button
                          key="edit"
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEditClick(review.id)}
                          className="review-action-btn review-edit-btn"
                        >
                          Editar
                        </Button>
                        <Popconfirm
                          key="delete"
                          title="¿Estás seguro que deseas eliminar esta reseña?"
                          onConfirm={() => onDeleteReview && onDeleteReview(review.id.toString())}
                          okText="Sí"
                          cancelText="No"
                        >
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />}
                            className="review-action-btn review-delete-btn"
                          >
                            Eliminar
                          </Button>
                        </Popconfirm>
                      </div>
                    ]
                  : undefined
              }
            >
              {isEditing ? (
                <div className="review-form-container">
                  <ReviewForm
                    initialRating={review.rating}
                    initialComment={review.comment}
                    onSubmit={(rating, comment) => handleUpdateReview(review.id, rating, comment)}
                    onCancel={handleCancelEdit}
                    isUpdate
                  />
                </div>
              ) : (
                <>
                  <List.Item.Meta
                    title={
                      <div className="review-list-item-meta-title">
                        <Text strong className="review-username">{review.username}</Text>
                        <Rate disabled value={review.rating} className="review-rating" />
                      </div>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <div className="review-date">
                          {moment(review.createdAt).format('LL')}
                          {review.updatedAt && review.createdAt.getTime() !== review.updatedAt.getTime() && 
                            <span className="review-edited">(editado)</span>
                          }
                        </div>
                        {showBookInfo && (
                          <div className="review-book-info">
                            Libro: <a href={`/books/${review.bookId}`} className="review-book-link">
                              {review.username || review.bookId}
                            </a>
                          </div>
                        )}
                      </Space>
                    }
                  />
                  <Paragraph
                    className="review-comment"
                    ellipsis={{ rows: 3, expandable: true, symbol: 'más' }}
                  >
                    {review.comment}
                  </Paragraph>
                </>
              )}
              <Divider className="review-divider" />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ReviewList;