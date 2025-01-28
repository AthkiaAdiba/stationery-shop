export type IProduct = {
  name: string;
  title: string;
  brand: string;
  price: number;
  author?: string;
  image: string;
  category:
    | 'pens'
    | 'notebooks'
    | 'desk accessories'
    | 'markers & highlighters'
    | 'frames'
    | 'books';
  description: string;
  quantity: number;
  inStock: boolean;
};
