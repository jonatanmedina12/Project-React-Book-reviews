
import React from 'react';
import { Image } from 'antd';
import { getImageUrl } from '../../services/api'; // Importamos la función para obtener URLs de imágenes

// Interfaz que define las propiedades del componente siguiendo el principio de segregación de interfaces (SOLID)
interface BookImageProps {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  borderRadius?: string;
  onClick?: () => void;
  maxWidth?: string | number;
}

/**
 * Componente para mostrar imágenes de libros con fallback para imágenes no disponibles
 * Sigue el principio de responsabilidad única (SRP) para manejar la visualización de imágenes
 */
const BookImage: React.FC<BookImageProps> = ({
  src,
  alt = 'Portada del libro',
  width = '100%',
  height,
  className = '',
  borderRadius = '8px',
  onClick,
  maxWidth,
}) => {
  // Procesar la URL de la imagen utilizando la utilidad getImageUrl
  const imageUrl = getImageUrl(src);
  
  // Constante para la URL del placeholder
  const PLACEHOLDER_URL = 'https://via.placeholder.com/300x450?text=No+Image';
  
  // Estilo base para la imagen
  const imageStyle: React.CSSProperties = {
    width,
    height,
    borderRadius,
    cursor: onClick ? 'pointer' : 'default',
    maxWidth: maxWidth || 'auto',
  };

  return (
    <Image
      src={imageUrl}
      alt={alt}
      style={imageStyle}
      fallback={PLACEHOLDER_URL}
      preview={!!src}
      className={className}
      onClick={onClick}
    />
  );
};

export default BookImage;