import React from "react";
import styles from "./Card.module.css";
import { Produto } from "@/app/models/interfaces";

interface CardProps{
  produto: Produto,    
  addToCart: (produto: Produto) => void
}

const Card = ({ produto,addToCart}:CardProps) => {
  return (

    <div className={styles.card} >
      <h2 className={styles.title}>{produto.title}</h2>
      <img src={produto.image} alt={produto.title} className={styles.image} />      
      <p className={styles.price}>{produto.price}€</p>
      <button onClick={() => {
        addToCart(produto);
      }} className={styles.button}>+ Adicionar</button>      
      <p className={styles.description}>{produto.description}</p>    

    </div>
  );
};

export default Card;