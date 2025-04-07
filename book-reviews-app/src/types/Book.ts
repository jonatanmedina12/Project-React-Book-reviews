export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    coverImage?: string;
    averageRating: number;
    reviewCount: number;
  }
  
  export interface BookDetails extends Book {
    summary: string;
    publishedYear?: number;
    publisher?: string;
    isbn?: string;
    pages?: number;
    language?: string;
  }