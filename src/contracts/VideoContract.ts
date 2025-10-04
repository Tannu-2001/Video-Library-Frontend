export interface VideoContract {
  categoryName: string | undefined;
  thumbnail: string;
  _id?: string;
  title: string;
  description: string;
  url: string;
  category?: string;  // category _id
}