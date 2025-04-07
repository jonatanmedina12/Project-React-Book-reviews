export interface Review {
    id: string;
    bookId: string;
    userId: string;
    username: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    userProfileImage?: string;
  }
  
  export interface NewReview {
    rating: number;
    comment: string;
  }