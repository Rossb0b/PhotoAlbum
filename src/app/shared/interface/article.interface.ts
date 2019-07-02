export interface Article {
  _id?: string;
  title: string;
  paragraphs: [{
    content: string;
    path: string;
    alt: string;
  }];
  creator: string;
  albumId: string;
  created_date: any;
}
