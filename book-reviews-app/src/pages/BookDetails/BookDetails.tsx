import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Row,
  Col,
  Image,
  Descriptions,
  Rate,
  Divider,
  Card,
  Spin,
  Button,
  message,
  Tabs,
} from 'antd';
import { ArrowLeftOutlined, ReadOutlined, BookOutlined } from '@ant-design/icons';
import { getBookById } from '../../services/bookService';
import { getBookReviews, createReview, updateReview, deleteReview } from '../../services/reviewService';
import { BookDetails as BookDetailsType } from '../../types/Book';
import { Review } from '../../types/Review';
import ReviewList from '../../components/reviews/ReviewList';
import ReviewForm from '../../components/reviews/ReviewForm';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [book, setBook] = useState<BookDetailsType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    if (id) {
      fetchBookDetails(id);
      fetchBookReviews(id);
    }
  }, );

  const fetchBookDetails = async (bookId: string) => {
    try {
      setLoading(true);
      const data = await getBookById(bookId);
      setBook(data);
    } catch (error) {
      message.error('Error al cargar los detalles del libro');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookReviews = async (bookId: string) => {
    try {
      setReviewsLoading(true);
      const data = await getBookReviews(bookId);
      setReviews(data);
      
      // Verificar si el usuario actual tiene una reseña
      if (isAuthenticated && user) {
        const currentUserReview = data.find(review => review.userId === user.id);
        setUserReview(currentUserReview || null);
      }
    } catch (error) {
      message.error('Error al cargar las reseñas');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleCreateReview = async (rating: number, comment: string) => {
    if (!id) return;
    
    try {
      const newReview = await createReview(id, { rating, comment });
      message.success('Reseña enviada correctamente');
      
      // Actualizar las reseñas y el userReview
      setReviews(prevReviews => [newReview, ...prevReviews]);
      setUserReview(newReview);
      
      // Actualizar los detalles del libro (promedio de calificaciones, etc.)
      fetchBookDetails(id);
    } catch (error) {
      message.error('Error al enviar la reseña');
    }
  };

  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    try {
      const updatedReview = await updateReview(reviewId, { rating, comment });
      message.success('Reseña actualizada correctamente');
      
      // Actualizar las reseñas y el userReview
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId ? updatedReview : review
        )
      );
      setUserReview(updatedReview);
      
      // Actualizar los detalles del libro (promedio de calificaciones, etc.)
      if (id) {
        fetchBookDetails(id);
      }
    } catch (error) {
      message.error('Error al actualizar la reseña');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      message.success('Reseña eliminada correctamente');
      
      // Actualizar las reseñas y el userReview
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== reviewId)
      );
      setUserReview(null);
      
      // Actualizar los detalles del libro (promedio de calificaciones, etc.)
      if (id) {
        fetchBookDetails(id);
      }
    } catch (error) {
      message.error('Error al eliminar la reseña');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>
      
      <Row gutter={[32, 32]}>
        {/* Columna izquierda: Imagen y detalles básicos */}
        <Col xs={24} md={8} lg={6}>
          <Image
            src={book.coverImage || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={book.title}
            style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
            fallback="https://via.placeholder.com/300x450?text=No+Image"
          />
          
          <Card style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Rate disabled value={book.averageRating} allowHalf />
              <Text style={{ display: 'block' }}>
                {book.averageRating.toFixed(1)} de 5 ({book.reviewCount} reseñas)
              </Text>
            </div>
            
            {book.category && (
              <Button
                icon={<BookOutlined />}
                style={{ width: '100%', marginBottom: 8 }}
                onClick={() => navigate(`/?category=${encodeURIComponent(book.category)}`)}
              >
                {book.category}
              </Button>
            )}
            
            {/* Aquí podrían ir más acciones como "Añadir a favoritos", etc. */}
          </Card>
        </Col>
        
        {/* Columna derecha: Detalles del libro y reseñas */}
        <Col xs={24} md={16} lg={18}>
          <Title level={2}>{book.title}</Title>
          <Title level={4} type="secondary" style={{ marginTop: 0 }}>
            {book.author}
          </Title>
          
          <Tabs defaultActiveKey="info">
            <TabPane
              tab={<span><ReadOutlined /> Información</span>}
              key="info"
            >
              {/* Resumen del libro */}
              <div style={{ marginBottom: 24 }}>
                <Title level={4}>Resumen</Title>
                <Text>{book.summary}</Text>
              </div>
              
              {/* Detalles adicionales */}
              <Title level={4}>Detalles</Title>
              <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                {book.publisher && (
                  <Descriptions.Item label="Editorial">{book.publisher}</Descriptions.Item>
                )}
                {book.publishedYear && (
                  <Descriptions.Item label="Año de publicación">{book.publishedYear}</Descriptions.Item>
                )}
                {book.isbn && (
                  <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
                )}
                {book.pages && (
                  <Descriptions.Item label="Páginas">{book.pages}</Descriptions.Item>
                )}
                {book.language && (
                  <Descriptions.Item label="Idioma">{book.language}</Descriptions.Item>
                )}
              </Descriptions>
            </TabPane>
            
            <TabPane
              tab={<span><BookOutlined /> Reseñas ({book.reviewCount})</span>}
              key="reviews"
            >
              {/* Formulario para agregar o editar reseña */}
              {!userReview ? (
                <Card title="Deja tu reseña" style={{ marginBottom: 24 }}>
                  <ReviewForm
                    bookId={id}
                    onSubmit={handleCreateReview}
                  />
                </Card>
              ) : (
                <Card title="Tu reseña" style={{ marginBottom: 24 }}>
                  <ReviewList
                    reviews={[userReview]}
                    onDeleteReview={handleDeleteReview}
                    onUpdateReview={handleUpdateReview}
                  />
                </Card>
              )}
              
              <Divider />
              
              {/* Lista de reseñas */}
              <Title level={4}>Todas las reseñas</Title>
              <ReviewList
                reviews={reviews.filter(review => !userReview || review.id !== userReview.id)}
                loading={reviewsLoading}
                onDeleteReview={isAuthenticated ? handleDeleteReview : undefined}
                onUpdateReview={isAuthenticated ? handleUpdateReview : undefined}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default BookDetails;