'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Product } from './models/interfaces';
import ProductCard from './components/CardProduto/ProdutoCard';


export default function Page() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR<Product[]>('/api/products', fetcher);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [postResponse, setPostResponse] = useState<string | null>(null);


  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
  };

  const buy = () => {
    const isEstudante = (
      document.querySelector('input[name="estudante_deisi"]') as HTMLInputElement
    )?.checked || false;
  
    const cupao = (
      document.getElementById('cupao') as HTMLInputElement
    )?.value || '';
  
    const nomeCliente = prompt("Digite o seu nome para concluir a compra:");
  
    if (!nomeCliente) {
      alert("O nome é obrigatório para concluir a compra.");
      return;
    }
  
    const body = {
      products: cart.map((product) => product.id), 
      student: isEstudante, 
      coupon: cupao, 
      name: nomeCliente, 
    };
  
    fetch('/api/products/deisishop/buy', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Erro desconhecido");
          });
        }
        return response.json();
      })
      .then((response) => {
        setPostResponse(
          `Compra realizada com sucesso!\n
          ${response.message}\n
          ${response.address}\n
          Total: ${response.totalCost} €\n
          Referência de pagamento: ${response.reference}`
        );
        
        setCart([]); 
      })
      .catch((error) => {
        setPostResponse(`Erro ao processar a compra: ${error.message}`);
      });
  };
  
  
  

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const filteredProducts = data.filter((prod) =>
    prod.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Produtos</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
  
      <div className="product-grid">
  {filteredProducts.map((product) => (
    <ProductCard
      key={product.id}
      title={product.title}
      price={product.price}
      description={product.description}
      imgSrc={product.image}
      buttonLabel="+ Adicionar ao Carrinho"
      buttonAction={() => addToCart(product)}
      showDescription={true}
    />
  ))}
</div>

<h1>Carrinho</h1>
<div className="product-grid cart-grid">
  {cart.map((item) => (
    <ProductCard
      key={item.id}
      title={item.title}
      price={item.price}
      description={item.description}
      imgSrc={item.image}
      buttonLabel="- Remover"
      buttonAction={() => removeFromCart(item.id)}
      showDescription={false}
    />
  ))}
</div>
      <p>
        Total: {cart.reduce((total, item) => total + Number(item.price), 0).toFixed(2)} €
      </p>
  
      <section id="menu-compra">
  <p>
    És estudante do DEISI?
    <input type="checkbox" name="estudante_deisi" value="sim" />
  </p>
  <p>
    Cupão de desconto: <input type="text" id="cupao" />
  </p>
  <button id='botao-comprar' onClick={buy}>Comprar</button>
  
  {postResponse &&
  postResponse.split("\n").map((line, index) => (
    <p key={index} className="post-response">
      {line}
    </p>
  ))}

</section>

    </div>
  );
}