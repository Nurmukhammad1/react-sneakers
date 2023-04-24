import React from "react";
import {Link} from 'react-router-dom';

function Header(props){

    return (
      <>
        <header className="d-flex justify-between align-center p-40">
          <Link to="/">
            <div className="d-flex align-center">
              <img width={40} height={40} src="/img/logo.png" alt="logo" />
              <div>
                <h3 className="text-uppercase">React Sneakers</h3>
                <p>Магазин лучших кроссовок</p>
              </div>
            </div>
          </Link>

          <ul className="d-flex">
            <li className="mr-30 cu-p" onClick={props.onClickCart}>
              <img width={18} height={18} src="/img/cart.svg" alt="Корзина" />
              <span>1205руб</span>
            </li>
            <li className="mr-20 cu-p">
              <Link to="/favorites">
                <img
                  width={18}
                  height={18}
                  src="/img/heart.svg"
                  alt="Закладки"
                />
              </Link>
            </li>
            <li>
              <img
                width={18}
                height={18}
                src="/img/user.svg"
                alt="Пользователи"
              />
              <span></span>
            </li>
          </ul>
        </header>
      </>
    );
}

export default Header; 