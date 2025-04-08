export interface Review {
  id: number;
  bookId: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface NewReview {
  rating: number;
  comment: string;
}
