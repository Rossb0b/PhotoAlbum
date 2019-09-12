export interface Album {
  _id?: string;
  title: string;
  content: string;
  images: [{
    path: string,
    alt: string
  }];
  sharedUsers: string[];
  userId: string;
  created_date: string;
}
