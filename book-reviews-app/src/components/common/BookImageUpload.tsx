import React, { useState, useEffect } from 'react';
import { Upload, message, Button, Modal, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { uploadCoverImage } from '../../services/bookService';
import { getImageUrl } from '../../services/api';
import './css/BookImageUpload.css';

// Interfaz que define las propiedades del componente
interface BookImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  bookId?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente para cargar y previsualizar imágenes de portada de libros
 * Sigue el principio de responsabilidad única (SRP) para la carga de imágenes
 */
const BookImageUpload: React.FC<BookImageUploadProps> = ({
  value,
  onChange,
  bookId,
  disabled = false,
  className = '',
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Inicializar fileList si hay una imagen existente
  useEffect(() => {
    if (value) {
      // Si el valor es una URL o una cadena base64
      const isBase64 = value.startsWith('data:');
      
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: isBase64 ? value : getImageUrl(value),
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  /**
   * Verifica si un archivo es una imagen válida (por su extensión)
   * @param file Archivo a verificar
   * @returns Verdadero si es válido, falso en caso contrario
   */
  const isImageFile = (file: RcFile): boolean => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const isAcceptedType = acceptedTypes.includes(file.type);
    
    if (!isAcceptedType) {
      message.error('Solo puedes subir archivos JPG, PNG, GIF o WEBP');
    }
    
    // Verificar tamaño (máximo 5MB)
    const isLessThan5MB = file.size / 1024 / 1024 < 5;
    if (!isLessThan5MB) {
      message.error('La imagen debe ser menor que 5MB');
    }
    
    return isAcceptedType && isLessThan5MB;
  };

  /**
   * Maneja la subida de archivos
   * @param options Opciones de subida
   */
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    // Si no hay un ID de libro, solo guardamos la imagen en base64 para enviarla después
    if (!bookId) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          const base64Image = reader.result as string;
          onChange?.(base64Image);
          onSuccess("ok", file);
        } catch (error) {
          onError(error);
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setLoading(false);
        onError();
      };
      return;
    }
    
    // Si hay un ID de libro, subimos la imagen al servidor
    try {
      setLoading(true);
      const imageUrl = await uploadCoverImage(bookId, file);
      onChange?.(imageUrl);
      onSuccess("ok", file);
      message.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      message.error('Error al subir la imagen');
      onError();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja los cambios en el componente de carga
   * @param info Información del cambio
   */
  const handleChange = (info: UploadChangeParam) => {
    setFileList(info.fileList.slice(-1)); // Solo mantener el último archivo
    
    if (info.file.status === 'removed') {
      onChange?.('');
    }
  };

  /**
   * Maneja el clic en la previsualización
   * @param file Archivo a previsualizar
   */
  const handlePreview = async (file: UploadFile) => {
    if (file.url) {
      setPreviewImage(file.url);
    } else if (file.thumbUrl) {
      setPreviewImage(file.thumbUrl);
    } else if (value && value.startsWith('data:')) {
      setPreviewImage(value);
    } else if (value) {
      setPreviewImage(getImageUrl(value));
    }
    
    setPreviewVisible(true);
  };

  return (
    <div className={`book-image-upload ${className}`}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={isImageFile}
        customRequest={handleUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        disabled={disabled || loading}
      >
        {fileList.length >= 1 ? null : (
          <div className="upload-button">
            {loading ? (
              <div className="loading-container">
                <Spin />
                <div className="upload-text">Cargando</div>
              </div>
            ) : (
              <>
                <PlusOutlined />
                <div className="upload-text">Subir</div>
              </>
            )}
          </div>
        )}
      </Upload>
      
      {fileList.length > 0 && (
        <Button 
          icon={<DeleteOutlined />} 
          onClick={() => {
            setFileList([]);
            onChange?.('');
          }}
          disabled={disabled || loading}
          danger
          className="delete-button"
        >
          Eliminar imagen
        </Button>
      )}
      
      <Modal
        title="Previsualización de imagen"
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        className="image-preview-modal"
      >
        <img alt="Previsualización" src={previewImage} />
      </Modal>
    </div>
  );
};

export default BookImageUpload;