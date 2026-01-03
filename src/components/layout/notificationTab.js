"use client"
import { useSelector, useDispatch } from "react-redux";
// import CartItem from "./cartItem";

import { toggleNotificationTab } from "@/app/redux/cart";

import { XCircle } from "lucide-react";
import { useEffect } from "react";

const NotificationTab = ({notificationTabStatus}) => {
   
   
   const dispatch = useDispatch()
   const handleCloseNotificationTab = () => {
      dispatch(toggleNotificationTab())
   }

   useEffect(() => {
              console.log(notificationTabStatus)
           }, [notificationTabStatus]);


 return (
    <div className={` fixed right-0 pt-25.25 h-full z-498 bg-gray-700 shadow-2xl w-96  flex  flex-col 
    transform transition-transform duration-500 ease-in-out border-b rounded-b-lg ${notificationTabStatus ? '' : 'translate-x-1000'} `}
    >
      <div className="flex-1 overflow-y-auto w-full">
         <div className="p-5 flex w-full justify-between items-center ">
            <h2 className=" text-white text-2xl font-extrabold" >NotificationTab</h2>
            <XCircle size={24} className="text-green-600 hover:text-green-700 cursor-pointer"
               onClick={handleCloseNotificationTab}
            />
         </div>
        
         <div className="p-5">
            {/* {carts.map(
               (item,key) => <CartItem data={item} key={key}></CartItem>
            )} */}

         </div>

         

      </div>

      {/* <div className="p-5 w-full">
         {/* <button className="bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition" onClick={handleCloseCart}>CLOSE</button> 
         <button className="bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition  flex justify-center w-full mb-5">CHECKOUT</button>
      </div> */}

   </div>
 )   
}

export default NotificationTab;