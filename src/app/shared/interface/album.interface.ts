export interface Album {
  _id?: string;
  title: string;
  content: string;
  images: [{
    path: string,
    alt: string
  }];
  linked_friendsId: string[];
  creator: string;
  created_date: string;
}
