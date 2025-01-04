interface ProductProps {
    title: string;
    price: string;
    description: string;
    imgSrc: string;
    buttonLabel: string;
    buttonAction: () => void;
    showDescription?: boolean; 
  }
  
  export default function ProductCard(props: ProductProps) {
    return (
      <div className="product-card">
        <img src={props.imgSrc} alt={props.title} className="product-image" />
        <h3 className="product-title">{props.title}</h3>
        <p className="product-price">Custo total: {props.price} €</p>
        {props.showDescription && ( // Condicional para mostrar ou não a descrição
          <p className="product-description">{props.description}</p>
        )}
        <button className="add-to-cart-button" onClick={props.buttonAction}>
          {props.buttonLabel}
        </button>
      </div>
    );
  }