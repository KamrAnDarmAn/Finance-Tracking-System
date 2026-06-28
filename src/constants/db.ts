import { Category, Product, Review, User } from "../types/index.js";

interface DB {
  product: Product[];
  users: User[];
  category: Category[];
  reviews: Review[];
}
export const db = {
  products: [
    {
      id: "1",
      name: "Iphone 12 pro",
      price: 499.99,
      ownerId: "1",
      description: "this is amazing mobile",
      quantity: "12",
      onSale: true,
      categoryId: "1",
    },
    {
      id: "2",
      name: "Iphone 13 pro",
      price: 636.99,
      ownerId: 2,
      description: "this is amazing mobile 1",
      quantity: 1,
      onSale: false,
      categoryId: "2",
    },
    {
      id: "3",
      name: "Iphone 14 pro",
      price: 636.99,
      ownerId: "3",
      description: "this is amazing yep!!!",
      quantity: 10,
      onSale: true,
      categoryId: "3",
    },
    {
      id: "4",
      name: "Iphone 17 pro max",
      price: 1636.99,
      ownerId: 1,
      description: "this is amazing yep!!!",
      quantity: 5,
      onSale: false,
      categoryId: "1",
    },
  ],
  users: [
    {
      id: "1",
      name: "kamran",
      email: "kamran@gmail.com",
      address: "USA",
    },
    {
      id: "2",
      name: "ali",
      email: "ali@gmail.com",
      address: "Khost",
    },
    {
      id: "3",
      name: "jane",
      email: "jane@gmail.com",
      address: "UAE",
    },
  ],
  category: [
    {
      id: "1",
      name: "sport",
    },
    {
      id: "2",
      name: "fornature",
    },
    {
      id: "3",
      name: "digital devices",
    },
  ],
  reviews: [
    {
      id: "1",
      date: Date.now().toLocaleString(),
      title: "Best experience ever.",
      comment: "I like it's battery power the most",
      rating: 5,
      productId: "4",
    },
    {
      id: "2",
      date: Date.now().toLocaleString(),
      title: "Best experience ever.",
      comment: "I like it's battery power the most",
      rating: 3,
      productId: "4",
    },

    {
      id: "3",
      date: Date.now().toLocaleString(),
      title: "Best experience ever.",
      comment: "I like it's battery power the most",
      rating: 5,
      productId: "4",
    },

    {
      id: "2",
      date: Date.now().toLocaleString(),
      title: "Best experience ever.",
      comment: "I like it's battery power the most",
      rating: 2,
      productId: "4",
    },
    {
      id: "5",
      date: Date.now().toLocaleString(),
      title: "Best experience ever.",
      comment: "I like it's battery power the most",
      rating: 2,
      productId: "3",
    },
    {
      id: "6",
      date: Date.now().toLocaleString(),
      title: "Best experience ever.",
      comment: "I like it's battery power the most",
      rating: 2,
      productId: "2",
    },
  ],
};
