import React from "react";
import { Routes, Route} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from "./context";



import  Home from './pages/Home';
import Favorites from './pages/Favorites';



function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const  [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

 React.useEffect(() => {
  // добавление асинхронной функции для корректной прогрузки корзины, favorites и карточек

    async function fetchData(){
      setIsLoading(true); //начала отображение состоянии загрузки лeндинга
      // 1. Вывод данных:
      const cartResponse = await axios.get('https://6426bee5d24d7e0de4772a40.mockapi.io/cart');
      const favoritesResponse = await axios.get('https://6445627c914c816083cd96ef.mockapi.io/favorites');
      const itemsResponse = await axios.get('https://6426bee5d24d7e0de4772a40.mockapi.io/items');

      setIsLoading(false); //конец отображение состоянии загрузки лендинга

      // 2. Сохранение информации в следующей последовательности:
      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
    }
    fetchData();
 }, []);

 // функция по добавлению данных на сервер при заполнении корзины
 const onAddToCart = (obj) => {
  console.log(obj)
  try {
    //поиск на идентичность товара в корзине. если его нет то
  if(cartItems.find((item) => Number(item.id) === Number(obj.id))){
    axios.delete(`https://6426bee5d24d7e0de4772a40.mockapi.io/cart/${obj.id}`)
    setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
  }else{
    // то тогда он добавляется в корзину
    axios.post('https://6426bee5d24d7e0de4772a40.mockapi.io/cart', obj);
    setCartItems((prev) => [...prev, obj]);
  }
  } catch (error) {
    alert('не удалось добавить в корзину')
  }
};



// функция по удалении данных на сервере при очистке корзины
const onRemoveCart = (id) => {
   axios.delete(`https://6426bee5d24d7e0de4772a40.mockapi.io/cart/${id}`);
   setCartItems((prev) => prev.filter((item) => item.id !== id ));
};

// функция по сохранению закладок товаров в массив favorites и опеределения наличия существующих по id с последующим удалением дубликатов из favorites
const onAddToFavorite = async (obj) => {
  try{
    if(favorites.find((favObj) => Number(favObj.id) === Number(obj.id))){
      axios.delete(`https://6445627c914c816083cd96ef.mockapi.io/favorites/${obj.id}`);
      setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
    }else{
     const { data } = await axios.post('https://6445627c914c816083cd96ef.mockapi.io/favorites', obj);
      setFavorites((prev) => [...prev,  data]);
    }
  }catch(error){
    alert('не удалось добавить в фавориты');
  }
};



const onChangeSearchInput = (event) =>{
   setSearchValue(event.target.value);
};

const isItemAdded = (id) => {
  return cartItems.some((obj) => Number(obj.id) === Number(id))
}

  return (
    //Добавление  useContext
    <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, setCartOpened, setCartItems }}>
      <div className="wrapper clear">
        {cartOpened && (
          <Drawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveCart}
          />
        )}
        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          ></Route>

          <Route
            path="/favorites"
            exact
            element={
              <Favorites />
            }
          ></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;


