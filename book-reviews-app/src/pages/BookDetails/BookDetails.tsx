/**
 * @file BookDetails.tsx
 * @description Componente para mostrar los detalles de un libro junto con sus reseñas
 * @swagger
 *  components:
 *    schemas:
 *      BookDetails:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            description: ID del libro
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Row,
  Col,
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
import BookImage from '../../components/common/BookImage';
import { useAuth } from '../../context/AuthContext';
import './css/BookDetails.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

/**
 * Componente principal para mostrar los detalles de un libro
 * Sigue el principio de responsabilidad única (SRP) para la visualización de detalles de libro
 */
const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [book, setBook] = useState<BookDetailsType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [userReview, setUserReview] = useState<Review | null>(null);

  // Efecto para cargar los detalles del libro y sus reseñas
  useEffect(() => {
    if (id) {
      fetchBookDetails(id);
      fetchBookReviews(id);
    }
  }, [id]);

  /**
   * Obtiene los detalles del libro desde el servicio
   * @param bookId ID del libro a consultar
   */
  const fetchBookDetails = async (bookId: string) => {
    try {
      setLoading(true);
      const data = await getBookById(bookId);
      setBook(data);
    } catch (error) {
      console.error('Error al cargar los detalles del libro:', error);
      message.error('Error al cargar los detalles del libro');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene las reseñas del libro desde el servicio
   * @param bookId ID del libro a consultar
   */
  const fetchBookReviews = async (bookId: string) => {
    try {
      setReviewsLoading(true);
      const data = await getBookReviews(bookId);
      setReviews(data);
      
      // Verificar si el usuario actual tiene una reseña
      if (isAuthenticated && user) {
        const currentUserReview = data.find(review => review.userId === parseInt(user.id));
        setUserReview(currentUserReview || null);
      }
    } catch (error) {
      console.error('Error al cargar las reseñas:', error);
      message.error('Error al cargar las reseñas');
    } finally {
      setReviewsLoading(false);
    }
  };

  /**
   * Maneja la creación de una nueva reseña
   * @param rating Calificación de la reseña
   * @param comment Comentario de la reseña
   */
  const handleCreateReview = async (rating: number, comment: string) => {
    if (!id) return;
    
    try {
      // Pasamos rating y comment directamente en lugar de un objeto
      const newReview = await createReview(id, rating, comment);
      message.success('Reseña enviada correctamente');
      
      // Actualizar las reseñas y el userReview
      setReviews(prevReviews => [newReview, ...prevReviews]);
      setUserReview(newReview);
      
      // Actualizar los detalles del libro (promedio de calificaciones, etc.)
      fetchBookDetails(id);
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      message.error('Error al enviar la reseña');
    }
  };

  /**
   * Maneja la actualización de una reseña existente
   * @param reviewId ID de la reseña a actualizar
   * @param rating Nueva calificación
   * @param comment Nuevo comentario
   */
  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    if (!id) return;
    
    try {
      // Pasamos los parámetros correctamente: reviewId, rating, comment, bookId
      const updatedReview = await updateReview(reviewId, rating, comment, id);
      message.success('Reseña actualizada correctamente');
      
      // Actualizar las reseñas y el userReview
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === parseInt(reviewId) ? updatedReview : review
        )
      );
      setUserReview(updatedReview);
      
      // Actualizar los detalles del libro (promedio de calificaciones, etc.)
      fetchBookDetails(id);
    } catch (error) {
      console.error('Error al actualizar la reseña:', error);
      message.error('Error al actualizar la reseña');
    }
  };

  /**
   * Maneja la eliminación de una reseña
   * @param reviewId ID de la reseña a eliminar
   */
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      message.success('Reseña eliminada correctamente');
      
      // Actualizar las reseñas y el userReview
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== parseInt(reviewId))
      );
      setUserReview(null);
      
      // Actualizar los detalles del libro (promedio de calificaciones, etc.)
      if (id) {
        fetchBookDetails(id);
      }
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      message.error('Error al eliminar la reseña');
    }
  };

  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <div className="book-loading-container">
        <Spin size="large" />
      </div>
    );
  }

  // Si no hay datos del libro, no mostramos nada
  if (!book) {
    return null;
  }

  return (
    <div className="book-details-container">
      <Button
        icon={<ArrowLeftOutlined />}
        className="back-button"
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>
      
      <Row gutter={[32, 32]}>
        {/* Columna izquierda: Imagen y detalles básicos */}
        <Col xs={24} md={8} lg={6}>
          <div className="book-cover-container">
            <BookImage
              src={book.coverImageUrl}
              alt={book.title}
              width="100%"
              borderRadius="8px"
              className="book-cover-image"
            />
          </div>
          
          <Card className="book-info-card">
            <div className="book-rating-container">
              <Rate disabled value={book.averageRating} allowHalf className="book-rating" />
              <Text className="book-rating-text">
                {book.averageRating.toFixed(1)} de 5 ({book.reviewCount} reseñas)
              </Text>
            </div>
            {book.categoryName && (
              <Button
                icon={<BookOutlined />}
                className="book-category-button"
                onClick={() => navigate(`/?category=${encodeURIComponent(book.categoryName!)}`)}
              >
                {book.categoryName}
              </Button>
            )}
          </Card>
        </Col>
        
        {/* Columna derecha: Detalles del libro y reseñas */}
        <Col xs={24} md={16} lg={18}>
          <div className="book-main-content">
            <Title level={2} className="book-title">{book.title}</Title>
            <Title level={4} type="secondary" className="book-author">
              {book.author}
            </Title>
            
            <Tabs defaultActiveKey="info" className="book-tabs">
              <TabPane
                tab={<span><ReadOutlined /> Información</span>}
                key="info"
              >
                {/* Resumen del libro */}
                <div className="book-summary-container">
                  <Title level={4} className="book-summary-title">Resumen</Title>
                  <Paragraph className="book-summary-text">{book.summary}</Paragraph>
                </div>
                
                {/* Detalles adicionales */}
                <div className="book-details-section">
                  <Title level={4} className="book-details-title">Detalles</Title>
                  <Descriptions bordered column={{ xs: 1, sm: 2 }} className="book-details-table">
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
                </div>
              </TabPane>
              
              <TabPane
                tab={<span><BookOutlined /> Reseñas ({book.reviewCount})</span>}
                key="reviews"
              >
                <div className="book-reviews-container">
                  {/* Formulario para agregar o editar reseña */}
                  {isAuthenticated && (
                    !userReview ? (
                      <Card title="Deja tu reseña" className="user-review-card">
                        <ReviewForm
                          bookId={id || ''}
                          onSubmit={handleCreateReview}
                        />
                      </Card>
                    ) : (
                      <Card title="Tu reseña" className="user-review-card">
                        <ReviewList
                          reviews={[userReview]}
                          onDeleteReview={handleDeleteReview}
                          onUpdateReview={handleUpdateReview}
                        />
                      </Card>
                    )
                  )}
                  
                  <Divider className="reviews-divider" />
                  
                  {/* Lista de reseñas */}
                  <Title level={4} className="all-reviews-title">Todas las reseñas</Title>
                  <ReviewList
                    reviews={reviews.filter(review => !userReview || review.id !== userReview.id)}
                    onDeleteReview={isAuthenticated ? handleDeleteReview : undefined}
                    onUpdateReview={isAuthenticated ? handleUpdateReview : undefined}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BookDetails;