import React, { useEffect, useState } from 'react';
import { Typography, Card, Avatar, Tabs, Button, Spin, message } from 'antd';
import { UserOutlined, BookOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserReviews, deleteReview, updateReview } from '../../services/reviewService';
import { Review } from '../../types/Review';
import ReviewList from '../../components/reviews/ReviewList';
import ProfileEditTab from './ProfileEditTab';
import './css/Profile.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Componente de página de perfil
 * Sigue el principio de responsabilidad única (SRP) para la gestión del perfil de usuario
 */
const Profile: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('reviews');

  // Cargar reseñas del usuario al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReviews();
    }
  }, [isAuthenticated]);

  // Redireccionar si no está autenticado
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  /**
   * Obtiene las reseñas del usuario actual
   */
  const fetchUserReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviews = await getUserReviews();
      setUserReviews(reviews);
    } catch (error) {
      message.error('Error al cargar tus reseñas');
      console.error('Error al cargar reseñas del usuario:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  /**
   * Maneja la actualización de una reseña
   * @param reviewId ID de la reseña a actualizar
   * @param rating Nueva calificación
   * @param comment Nuevo comentario
   */
  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    try {
      // Buscar la reseña original para obtener el bookId
      const originalReview = userReviews.find(review => review.id === parseInt(reviewId));
      
      if (!originalReview) {
        throw new Error('No se encontró la reseña a actualizar');
      }
      
      // Llamar al servicio con los parámetros en orden correcto
      const updatedReview = await updateReview(
        reviewId,
        rating,
        comment,
        originalReview.bookId.toString()
      );
      
      message.success('Reseña actualizada correctamente');
      
      // Actualizar las reseñas en el estado local
      setUserReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === parseInt(reviewId) ? updatedReview : review
        )
      );
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
      
      // Actualizar las reseñas - Convertir reviewId a número para comparación
      setUserReviews(prevReviews => 
        prevReviews.filter(review => review.id !== parseInt(reviewId))
      );
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      message.error('Error al eliminar la reseña');
    }
  };

  /**
   * Maneja el cambio de pestaña
   * @param key Clave de la pestaña activa
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="profile-loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Title level={2} className="profile-title">Mi Perfil</Title>

      <Card className="profile-card">
        <div className="profile-avatar-container">
          <Avatar 
            className="profile-avatar"
            size={100} 
            src={user?.profileImage} 
            icon={!user?.profileImage ? <UserOutlined /> : undefined}
          />
          
          <Title level={3} className="profile-username">
            {user?.username}
          </Title>
          
          <Text type="secondary" className="profile-email">
            {user?.email}
          </Text>
        </div>
      </Card>

      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange} 
        className="profile-tabs"
      >
        <TabPane
          tab={<span><BookOutlined /> Mis Reseñas</span>}
          key="reviews"
        >
          {reviewsLoading ? (
            <div className="profile-loading-container">
              <Spin />
            </div>
          ) : userReviews.length > 0 ? (
            <ReviewList
              reviews={userReviews}
              onDeleteReview={handleDeleteReview}
              onUpdateReview={handleUpdateReview}
              showBookInfo
            />
          ) : (
            <div className="profile-empty-reviews">
              <Text type="secondary" className="profile-empty-reviews-text">
                Aún no has escrito ninguna reseña.
              </Text>
              <Button 
                type="primary" 
                className="profile-explore-btn" 
                href="/"
              >
                Explorar libros
              </Button>
            </div>
          )}
        </TabPane>
        
        <TabPane
          tab={<span><EditOutlined /> Editar Perfil</span>}
          key="edit"
        >
          <ProfileEditTab />
        </TabPane>
        
        <TabPane
          tab={<span><ClockCircleOutlined /> Actividad Reciente</span>}
          key="activity"
        >
          <div className="profile-tab-placeholder">
            <Text type="secondary">Función en desarrollo.</Text>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;