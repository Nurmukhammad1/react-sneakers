import React from "react";
import cardStyles from './Card.module.scss';


 function  Card ({id, title, imageUrl,  price, onFavorite, onPlus, favorited = false}){
  const [isAdded, setIsAdded] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(favorited);


  const onClickPlus = () => {
    onPlus({ title, imageUrl, price});
    setIsAdded(!isAdded);
  }
  //  функция для отметки "сердца"
  const onClickFavorite = () =>{
    onFavorite({ title, imageUrl, price, id })
    setIsFavorite(!isFavorite);
  }
    return (
      <>
      <div className={cardStyles.card}>
        <div className={cardStyles.favorite} onClick={onClickFavorite}>
          <img src={isFavorite ? '/img/liked.svg' : "/img/unliked.svg"} alt="unliked"/>
        </div>
        <img width={133} height={112} src={imageUrl} alt="Sneakers"/>
        <h5>{title}</h5>
        <div className="d-flex justify-between align-center">
          <div className="d-flex flex-column ">
            <span>Цена:</span>
            <b>{price} руб.</b>
          </div>
            <img 
            className={cardStyles.plus} 
            onClick={onClickPlus}  
            src={isAdded ? "/img/btn-checked.svg" : "img/btn-plus.svg"} alt="Plus" />
        </div>
      </div>
      </>
    );
}

 export default Card;