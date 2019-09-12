export interface Article {
  _id?: string;
  title: string;
  paragraphs: [{
    content: string;
    image: {
      path: string;
      alt: string;
    }
  }];
  userId: string;
  albumId: string;
  created_date: any;
}
