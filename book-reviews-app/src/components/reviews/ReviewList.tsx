// src/components/reviews/ReviewList.tsx
import React, { useState } from 'react';
import { List, Avatar, Rate, Typography, Space, Divider, Button, Popconfirm, Empty } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';
import { Review } from '../../types/Review';
import { useAuth } from '../../context/AuthContext';
import ReviewForm from './ReviewForm';
import './ReviewsComponents.css';

const { Text, Paragraph, Title } = Typography;

moment.locale('es');

interface ReviewListProps {
  reviews: Review[];
  bookId?: string;
  loading?: boolean;
  onDeleteReview?: (reviewId: string) => Promise<void>;
  onUpdateReview?: (reviewId: string, rating: number, comment: string) => Promise<void>;
  showBookInfo?: boolean;
}

/**
 * Componente para mostrar una lista de reseñas
 * Con estilo moderno que coincide con el diseño del sistema
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
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  /**
   * Maneja el clic en el botón de editar
   */
  const handleEditClick = (reviewId: string) => {
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
   */
  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    if (onUpdateReview) {
      await onUpdateReview(reviewId, rating, comment);
      setEditingReviewId(null);
    }
  };

  // Si no hay reseñas, mostrar mensaje vacío estilizado
  if (!loading && reviews.length === 0) {
    return (
      <div className="modern-reviews-container">
        <Title level={4} className="modern-reviews-title">Reseñas</Title>
        <Empty
          className="modern-empty-reviews"
          description="No hay reseñas disponibles"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="modern-reviews-container">
      <Title level={4} className="modern-reviews-title">Reseñas</Title>
      <List
        itemLayout="vertical"
        dataSource={reviews}
        loading={loading}
        renderItem={(review) => {
          const isCurrentUserReview = user?.id === review.userId;
          const isEditing = editingReviewId === review.id;

          return (
            <div className="modern-review-item">
              {isEditing ? (
                <div>
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
                  <div className="modern-review-user">
                    <Avatar
                      className="modern-review-avatar"
                      size={48}
                      src={review.userProfileImage}
                      icon={!review.userProfileImage ? <UserOutlined /> : undefined}
                    />
                    
                    <div>
                      <Text className="modern-review-username">{review.username}</Text>
                      <div>
                        <Rate 
                          className="modern-review-rating" 
                          disabled 
                          value={review.rating} 
                          allowHalf
                        />
                        <Text className="modern-review-date">
                          {moment(review.createdAt).format('LL')}
                          {review.createdAt !== review.updatedAt && ' (editado)'}
                        </Text>
                      </div>
                      
                      {showBookInfo && (
                        <Text type="secondary">
                          Libro: <a href={`/books/${review.bookId}`}>{review.bookId}</a>
                        </Text>
                      )}
                    </div>
                  </div>
                  
                  <Paragraph
                    className="modern-review-content"
                    ellipsis={{ rows: 3, expandable: true, symbol: 'más' }}
                  >
                    {review.comment}
                  </Paragraph>
                  
                  {isCurrentUserReview && (
                    <div className="modern-review-actions">
                      <Button
                        className="modern-action-button modern-edit-button"
                        icon={<EditOutlined />}
                        onClick={() => handleEditClick(review.id)}
                      >
                        Editar
                      </Button>
                      
                      <Popconfirm
                        title="¿Estás seguro que deseas eliminar esta reseña?"
                        onConfirm={() => onDeleteReview && onDeleteReview(review.id)}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button 
                          className="modern-action-button modern-delete-button" 
                          icon={<DeleteOutlined />}
                        >
                          Eliminar
                        </Button>
                      </Popconfirm>
                    </div>
                  )}
                </>
              )}
              <Divider className="modern-review-divider" />
            </div>
          );
        }}
      />
    </div>
  );
};

export default ReviewList;