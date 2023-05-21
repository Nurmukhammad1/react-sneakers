import React from "react";
import axios from "axios";

import Card from "../components/Card/Index.js";
import AppContext from "../context.js";

 function Orders(){
   const {onAddToFavorite, onAddToCart} = React.useContext(AppContext);
   const [orders, setOrders] = React.useState([]);
   const [isLoading, setIsLoading] = React.useState(true);

   React.useEffect(() =>{
        (async () =>{
            try {
                const {data} =  await axios.get('https://6445627c914c816083cd96ef.mockapi.io/orders');
                setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
                setIsLoading(false);
            } catch (error) {
                alert("ошибка при запросе заказов!");
                console.error(error);
            }
        }) ();
   }, []);
    return(
      <div className="content p-40">
          <div className="d-flex align-center justify-between mb-40">
            <h1>МОИ ЗАКАЗЫ</h1>
          </div>

        <div className="d-flex flex-wrap">
        
          {(isLoading ? [...Array(8)] : orders).map((item, index) =>(
          <Card
          key={index}
          loading={isLoading}
          {...item}
        />
           ))}
        </div>
      </div>
    );
}

export default Orders;