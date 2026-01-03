"use client"
import Home from "./home/page"
import { setCart } from "../redux/cart"
import { loadCartFromSupabase } from "../services/cartService"


export default function App() {

  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) return;

    const userId = JSON.parse(userInfo).id;

    loadCartFromSupabase(userId).then(cart => {
      dispatch(setCart(cart));
    });
  }, []);



  return(

    <Home/>
  )
  
}
