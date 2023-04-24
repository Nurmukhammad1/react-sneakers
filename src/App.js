import React from "react";
import axios from 'axios';
import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Drawer from './components/Drawer';
import  Home from './pages/Home';
import Favorites from './pages/Favorites'


function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const  [cartOpened, setCartOpened] = React.useState(false);

 React.useEffect(() => {
     axios.get('https://6426bee5d24d7e0de4772a40.mockapi.io/items').then((res) => {
      setItems(res.data);
     });
     axios.get('https://6426bee5d24d7e0de4772a40.mockapi.io/cart').then((res) => {
      setCartItems(res.data);
     });
     axios.get('https://6445627c914c816083cd96ef.mockapi.io/favorites').then((res) => {
      setFavorites(res.data)
     })
 }, []);

// функция по добавлению данных на сервер при заполнении корзины
const onAddToCart = (obj) => {
  axios.post('https://6426bee5d24d7e0de4772a40.mockapi.io/cart', obj);
   setCartItems((prev) => [...prev, obj]);
};



// функция по удалении данных на сервере при очистке корзины
const onRemoveCart = (id) => {
   axios.delete(`https://6426bee5d24d7e0de4772a40.mockapi.io/cart/${id}`);
   setCartItems((prev) => prev.filter((item) => item.id !== id ));
}

// функция по сохранению закладок товаров в массив favorites и опеределения наличия существующих по id с последующим удалением дубликатов из favorites
const onAddToFavorite = async (obj) => {
  try{
    if(favorites.find((favObj) => favObj.id === obj.id)){
      axios.delete(`https://6445627c914c816083cd96ef.mockapi.io/favorites/${obj.id}`);
    }else{
     const {data} = await axios.post('https://6445627c914c816083cd96ef.mockapi.io/favorites', obj);
      setFavorites((prev) => [...prev,  data]);
    }
  }catch(error){
    alert('не удалось добавить в фавориты')
  }
}



const onChangeSearchInput = (event) =>{
   setSearchValue(event.target.value);
}
  return(
    <div className="wrapper clear">
      {cartOpened &&  <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveCart}/>}
      <Header onClickCart={() => setCartOpened(true)}/>
      
      <Routes >
          <Route  path='/'  exact
          element= {
          <Home 
          items={items}
          cartItems={cartItems}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onChangeSearchInput={onChangeSearchInput}
          onAddToFavorite={onAddToFavorite}
          onAddToCart={onAddToCart}
          /> } >
          </Route>

          <Route  path='/favorites'  exact
          element={
            <Favorites items={favorites} onAddToFavorite={onAddToFavorite}/> 

          }
          >
          </Route>
      </Routes>
      
     
      
    </div>
  );
}

export default App;
