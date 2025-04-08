/**
 * @file BookCardImage.tsx
 * @description Componente reutilizable para mostrar imágenes de portada en tarjetas de libros
 * @swagger
 *  components:
 *    schemas:
 *      BookCardImage:
 *        type: object
 *        required:
 *          - src
 *        properties:
 *          src:
 *            type: string
 *            description: URL de la imagen de portada
 *          alt:
 *            type: string
 *            description: Texto alternativo para la imagen
 *          height:
 *            type: number | string
 *            description: Altura de la imagen
 *          onClick:
 *            type: function
 *            description: Función a ejecutar al hacer clic en la imagen
 */
import React from 'react';
import { Image } from 'antd';
import { getImageUrl } from '../../services/api'; // Importamos la función para obtener URLs de imágenes

// Interfaz que define las propiedades del componente
interface BookCardImageProps {
  src?: string;
  alt?: string;
  height?: string | number;
  onClick?: () => void;
  className?: string;
}

/**
 * Componente para mostrar imágenes de portada en tarjetas de libros con manejo de fallback
 * Sigue el principio de responsabilidad única (SRP) para la visualización de imágenes en tarjetas
 */
const BookCardImage: React.FC<BookCardImageProps> = ({
  src,
  alt = 'Portada del libro',
  height = '200px',
  onClick,
  className = '',
}) => {
  // Procesar la URL de la imagen utilizando la utilidad getImageUrl
  const imageUrl = getImageUrl(src);
  
  // Constante para la URL del placeholder
  const PLACEHOLDER_URL = 'https://via.placeholder.com/200x300?text=No+Image';
  
  // Estilos para el contenedor
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: typeof height === 'number' ? `${height}px` : height,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '8px 8px 0 0',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  // Estilos para la imagen dentro del contenedor
  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div style={containerStyle} className={className} onClick={onClick}>
      <Image
        src={imageUrl}
        alt={alt}
        style={imageStyle}
        fallback={PLACEHOLDER_URL}
        preview={false}
      />
    </div>
  );
};

export default BookCardImage;