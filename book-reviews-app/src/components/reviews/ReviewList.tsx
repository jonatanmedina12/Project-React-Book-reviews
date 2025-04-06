// src/components/reviews/ReviewList.tsx
import React, { useState } from 'react';
import { List, Avatar, Rate, Typography, Space, Divider, Button, Popconfirm, Empty } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';
import { Review } from '../../types/Review';
import { useAuth } from '../../context/AuthContext';
import ReviewForm from './ReviewForm';

const { Text, Paragraph } = Typography;

moment.locale('es');

interface ReviewListProps {
  reviews: Review[];
  bookId?: string;
  loading?: boolean;
  onDeleteReview?: (reviewId: string) => Promise<void>;
  onUpdateReview?: (reviewId: string, rating: number, comment: string) => Promise<void>;
  showBookInfo?: boolean;
}

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

  const handleEditClick = (reviewId: string) => {
    setEditingReviewId(reviewId);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    if (onUpdateReview) {
      await onUpdateReview(reviewId, rating, comment);
      setEditingReviewId(null);
    }
  };

  if (!loading && reviews.length === 0) {
    return (
      <Empty
        description="No hay reseñas disponibles"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={reviews}
      loading={loading}
      renderItem={(review) => {
        const isCurrentUserReview = user?.id === review.userId;
        const isEditing = editingReviewId === review.id;

        return (
          <List.Item
            key={review.id}
            actions={
              isCurrentUserReview && !isEditing
                ? [
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditClick(review.id)}
                    >
                      Editar
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="¿Estás seguro que deseas eliminar esta reseña?"
                      onConfirm={() => onDeleteReview && onDeleteReview(review.id)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />}>
                        Eliminar
                      </Button>
                    </Popconfirm>,
                  ]
                : undefined
            }
          >
            {isEditing ? (
              <div style={{ marginBottom: 16 }}>
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
                  avatar={
                    <Avatar
                      src={review.userProfileImage}
                      icon={!review.userProfileImage ? <UserOutlined /> : undefined}
                    />
                  }
                  title={
                    <Space size="large">
                      <Text strong>{review.username}</Text>
                      <Rate disabled value={review.rating} />
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">
                        {moment(review.createdAt).format('LL')}
                        {review.createdAt !== review.updatedAt && ' (editado)'}
                      </Text>
                      {showBookInfo && (
                        <Text type="secondary">
                          Libro: <a href={`/books/${review.bookId}`}>{review.bookId}</a>
                        </Text>
                      )}
                    </Space>
                  }
                />
                <Paragraph
                  style={{ marginTop: 16 }}
                  ellipsis={{ rows: 3, expandable: true, symbol: 'más' }}
                >
                  {review.comment}
                </Paragraph>
              </>
            )}
            <Divider style={{ margin: '12px 0' }} />
          </List.Item>
        );
      }}
    />
  );
};

export default ReviewList;

