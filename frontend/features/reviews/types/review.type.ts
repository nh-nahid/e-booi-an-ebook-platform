export interface Review {
  _id: string;

  rating: number;
  comment: string;

  createdAt: string;
  updatedAt: string;

  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review[];
}

