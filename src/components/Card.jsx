import React from "react";

 function  Card (){
    return (
      <div className="card">
        <div className="favorite">
          <img src="/img/unliked.svg" alt="unliked" />
        </div>
        <img
          width={133}
          height={112}
          src="/img/sneakers/1.jpg"
          alt="Sneakers"
        />
        <p>Мужские кроссовки Nike Blazer Mid Suede</p>
        <div className="d-flex justify-between align-center">
          <div className="d-flex flex-column ">
            <span>Цена:</span>
            <b>12 990 руб.</b>
          </div>
          <button>
            <img width={11} height={11} src="/img/plus.svg" alt="Plus" />
          </button>
        </div>
      </div>
    );
}

 export default Card;