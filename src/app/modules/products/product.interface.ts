export type IProduct = {
  name: string;
  title: string;
  brand: string;
  price: number;
  author?: string;
  image: string;
  category:
    | 'pen'
    | 'notebook'
    | 'desk accessory'
    | 'markers & highlighter'
    | 'frame'
    | 'book';
  description: string;
  quantity: number;
  inStock: boolean;
};
