import React, { useEffect, useState } from 'react';
import { Typography, Card, Avatar, Tabs, Button, Spin, Upload, message } from 'antd';
import { UserOutlined, BookOutlined, EditOutlined, UploadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserReviews, deleteReview, updateReview } from '../../services/reviewService';
import { Review } from '../../types/Review';
import ReviewList from '../../components/reviews/ReviewList';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  
  // Para la carga de imagen de perfil
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReviews();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

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

  const handleUpdateReview = async (reviewId: string, rating: number, comment: string) => {
    try {
      const updatedReview = await updateReview(reviewId, { rating, comment });
      message.success('Reseña actualizada correctamente');
      
      // Actualizar las reseñas - Convertir reviewId a número para comparación
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

  // Función para subir la imagen de perfil (simulada)
  const handleUpload = () => {
    setUploading(true);

    // Simulación de carga
    setTimeout(() => {
      setUploading(false);
      setFileList([]);
      message.success('Imagen de perfil actualizada correctamente');
    }, 2000);
  };

  const props: UploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      // Validación de tipo de archivo
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Solo puedes subir imágenes JPG/PNG');
        return Upload.LIST_IGNORE;
      }
      
      // Validación de tamaño
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('La imagen debe ser menor a 2MB');
        return Upload.LIST_IGNORE;
      }
      
      setFileList([file]);
      return false;
    },
    fileList,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Mi Perfil</Title>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar 
            size={100} 
            src={user?.profileImage} 
            icon={!user?.profileImage ? <UserOutlined /> : undefined}
          />
          
          <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
            {user?.username}
          </Title>
          
          <Text type="secondary" style={{ marginBottom: 16 }}>
            {user?.email}
          </Text>
          
          <Upload {...props} maxCount={1}>
            <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
          </Upload>
          
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Subiendo...' : 'Actualizar imagen de perfil'}
          </Button>
        </div>
      </Card>

      <Tabs defaultActiveKey="reviews">
        <TabPane
          tab={<span><BookOutlined /> Mis Reseñas</span>}
          key="reviews"
        >
          {reviewsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
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
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">Aún no has escrito ninguna reseña.</Text>
              <br />
              <Button type="primary" style={{ marginTop: 16 }} href="/">
                Explorar libros
              </Button>
            </div>
          )}
        </TabPane>
        
        <TabPane
          tab={<span><ClockCircleOutlined /> Actividad Reciente</span>}
          key="activity"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">Función en desarrollo.</Text>
          </div>
        </TabPane>
        
        <TabPane
          tab={<span><EditOutlined /> Editar Perfil</span>}
          key="edit"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">Función en desarrollo.</Text>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;