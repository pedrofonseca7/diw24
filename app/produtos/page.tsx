'use client'

import React, { useEffect, useState } from 'react';
import { Produto } from '../models/interfaces';
import useSWR from 'swr';
import Card from '../components/Card/Card';
import CardCart from '../components/Card/CardCart';

const ProductsPage = () => {
  const fetchProdutos = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  };

  const { data, error } = useSWR<Produto[]>('/api/produtos', fetchProdutos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Produto[]>([]);
  const [cartItems, setCartItems] = useState<Produto[]>([]);

  const handlePurchase = async () => {
    try {
      const response = await fetch('/api/deisishop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cartItems.map(item => item.id),
          name: '',
          student: false,
          coupon: ''
        })
      });

      if (!response.ok) throw new Error('Purchase failed');
      
      await response.json();
      setCartItems([]);
    } catch {
      console.error('Error during purchase');
    }
  };

  useEffect(() => {
    if (data) {
      const filtered = data.filter(produto =>
        produto.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (produto: Produto) => {
    setCartItems(prevCart => [...prevCart, produto]);
  };

  const removeItemFromCart = (produtoId: string) => {
    setCartItems(prevCart =>
      prevCart.filter(item => item.id !== produtoId)
    );
  };

  if (error) return <div>Error loading products</div>;
  if (!data) return <div>Loading products...</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a product..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      
      <div>
        {filteredProducts.map(produto => (
          <Card key={produto.id} produto={produto} addToCart={addItemToCart} />
        ))}
      </div>

      <h2>Shopping Cart</h2>
      <div>
        {cartItems.map(produto => (
          <CardCart key={produto.id} produto={produto} removeFromCart={removeItemFromCart} />
        ))}
      </div>

      <button onClick={handlePurchase}>Checkout</button>
    </div>
  );
};

export default ProductsPage;
