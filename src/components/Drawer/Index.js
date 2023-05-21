import React from "react";
import axios from 'axios';


import Info from '../info';
import { useCart } from "../../hooks/useCart";

import styles from './Drawer.module.scss';


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }){
  const {cartItems, setCartItems, totalPrice} = useCart();
  const [orderId, setOrderId] = React.useState(null);
  const [isOrderComplite, setIsOrderComplite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);


  const onClickOrder = async () => {
   try {
    setIsLoading(true);
    const {data} = await axios.post("https://6445627c914c816083cd96ef.mockapi.io/orders", {
      items: cartItems,
    });
    setOrderId(data.id);
    setIsOrderComplite(true);
    setCartItems([]);

    // Костыль из-за свойств сервиса "mockapi.io" удаление товаров из бэкэнда
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
     await axios.delete("https://6426bee5d24d7e0de4772a40.mockapi.io/cart" + item.id);
     await delay(1000);
    }
   } catch (error) {
    alert("Ошибка при создании заказа!");
   }
   setIsLoading(false);
  }

    return (
      <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
        <div className={styles.drawer}>
          <h2 className="mb-30 justify-between d-flex">
            Корзина
            <img
              onClick={onClose}
              className="cu-p"
              src="/img/btn-remove.svg"
              alt="Close"
            />
          </h2>

          {items.length > 0 ? (
            <div className="d-flex flex-column flex">
              <div className="items flex">
                {items.map((obj) => (
                  <div
                    key={obj.id}
                    className="cartItem d-flex align-center mb-20"
                  >
                    <div
                      style={{ backgroundImage: `url(${obj.imageUrl})` }}
                      className="cartItemImg">
                    </div>

                    <div className="mr-20 flex">
                      <p className="mb-5">{obj.title}</p>
                      <b>{obj.price} руб.</b>
                    </div>
                    <img
                      onClick={() => onRemove(obj.id)}
                      className="removeBtn"
                      src="/img/btn-remove.svg"
                      alt="Remove"
                    />
                  </div>
                ))}
              </div>
              <div className="cartTotalBlock">
                <ul>
                  <li>
                    <span>Итого:</span>
                    <div></div>
                    <b>{totalPrice} руб.</b>
                  </li>
                  <li>
                    <span>Налог 5%:</span>
                    <div></div>
                    <b>{(totalPrice / 100) * 5} руб.</b>
                  </li>
                </ul>
                <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                  Оформить заказ <img src="/img/arrow.svg" alt="arrow" />
                </button>
              </div>
            </div>
          ) : (
            <Info
              title={isOrderComplite ? "Заказ офрмлен" : "Корзина пустая"}
              description={isOrderComplite ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` 
              : "Добавте хотя бы одну пару кроссовок, что бы сделать заказ."
            }
              image={isOrderComplite ? "/img/complete-order.jpg" : "/img/empty-cart.jpg"}
            />
          )}
        </div>
      </div>
    );

}

export default Drawer;