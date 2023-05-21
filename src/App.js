import React from "react";
import { Routes, Route} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer/Index';
import AppContext from "./context";



import  Home from './pages/Home';
import Favorites from './pages/Favorites';
import  Orders  from "./pages/Orders";



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
      try {
        setIsLoading(true); //начала отображение состоянии загрузки лeндинга
      // 1. Вывод данных:
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all(
       [
         await axios.get("https://6426bee5d24d7e0de4772a40.mockapi.io/cart"),
         await axios.get("https://6445627c914c816083cd96ef.mockapi.io/favorites"),
         await axios.get("https://6426bee5d24d7e0de4772a40.mockapi.io/items"),
       ]
     );

      setIsLoading(false); //конец отображение состоянии загрузки лендинга

      // 2. Сохранение информации в следующей последовательности:
      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
      }
      catch (error) {
        alert('Ошибка при запросе данных!')
      }
    }
    fetchData();
 }, []);

 // функция по добавлению данных на сервер при заполнении корзины
 const onAddToCart = async (obj) => {
  try {
    //поиск на идентичность товара в корзине. если его нет то
    const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
  if(findItem) {
    setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
    await axios.delete(`https://6426bee5d24d7e0de4772a40.mockapi.io/cart/${findItem.id}`);
  }else{
    // то тогда он добавляется в корзину
    setCartItems((prev) => [...prev, obj]);
   const {data} = await axios.post('https://6426bee5d24d7e0de4772a40.mockapi.io/cart', obj);
    setCartItems((prev) => prev.map((item) => {
      if(item.parentId === data.parentId){ //если  parentId из массива равен parentId который приходит из back-end
        //то тогда произведи замену старого id объекта на новый id который приходит из back-end
        return {
          ...item, //id старого объекта
          id: data.id //id замена на новый id из back-end
        };
      }
      return item; //иначе просто верни item
    }),
    );
  }
  } catch (error) {
    alert('не удалось добавить в корзину')
    console.error(error);
  }
};



// функция по удалении данных на сервере при очистке корзины
const onRemoveItem = (id) => {
  try {
    axios.delete(`https://6426bee5d24d7e0de4772a40.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
  } catch (error) {
    alert('Ошибка при удалении из корзины');
    console.error(error);
  }
};

// функция по сохранению закладок товаров в массив favorites и опеределения наличия существующих по id с последующим удалением дубликатов из favorites
const onAddToFavorite = async (obj) => {
  try{
    if(favorites.find((favObj) => Number(favObj.id) === Number(obj.id))){
      axios.delete(`https://6445627c914c816083cd96ef.mockapi.io/favorites/${obj.id}`);
      setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
    }else{
     const { data } = await axios.post('https://6445627c914c816083cd96ef.mockapi.io/favorites', obj,);
      setFavorites((prev) => [...prev,  data]);
    }
  }catch(error){
    alert('не удалось добавить в фавориты');
    console.error(error)
  }
};



const onChangeSearchInput = (event) =>{
   setSearchValue(event.target.value);
};

// функция по сравнению id массивов товаров в Корзине с id товаров передающихся с Cart
const isItemAdded = (id) => {
  return cartItems.some((obj) => Number(obj.parentId) === Number(id))
}

  return (
    //Добавление  useContext
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
      <Drawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveItem}
            opened={cartOpened}
          />
      
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

          <Route path="/favorites" exact element={<Favorites />}></Route>
          <Route path="/orders" exact element={<Orders />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;


