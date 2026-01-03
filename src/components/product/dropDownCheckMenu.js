"use client"

import { useState , useEffect} from "react";
import { IoIosArrowDropdown } from 'react-icons/io';
import { AiOutlineCheck } from 'react-icons/ai';


export function DropDownCheckMenu({ menuName, choices, chosenChoice, setChoice}){
   
  const [menuActive, toggleMenuActive] = useState(false)
  
  const handleToggleMenuActive =()=>{
    toggleMenuActive(!menuActive)
    console.log(menuActive)
  }

   useEffect(() => {
    if (menuActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuActive]);
  
  const handleSetChoice=(value)=>{
    setChoice(value)
    toggleMenuActive(!menuActive)
  
  }
    
 return(
  <div>
      <div className="relative">
        <button className={`text-[14px] cursor-pointer font-bold uppercase  border-gray-200 rounded-lg flex items-center py-2 px-4  hover:text-[#107A1D]  ${choices.includes(chosenChoice)? "text-[#107A1D]":""}`} onClick={handleToggleMenuActive}>
            {/* Menu Group  */}
            {menuName}
            <IoIosArrowDropdown size={24} className="ml-2"/>
        </button>

        {menuActive == true ?
         <div className="fixed z-999 flex flex-col p-3 bg-white border border-gray-200 rounded-lg text-[14px]">
            <ul>
           
              {choices.map((choice, key)=>
                  <li className={`py-1.5 pr-2 relative flex items-center  gap-3 cursor-pointer hover:text-[#107A1D] ${chosenChoice==choice? "text-[#107A1D] font-bold":""}`} value={choice} key={key} onClick={()=>handleSetChoice(choice)}>
                    {chosenChoice==choice ? <AiOutlineCheck/> :  <span className="w-3.5 h-3.5"/>}
                      {choice}
                  </li>
                )
              }
              
            </ul>
        </div>
         :<></> }

         

      </div>
            {menuActive == true ? <div className="absolute top-0 left-0 z-700 w-full h-full bg-transparent" onClick={handleToggleMenuActive}/> :<></> }

      </div>
 )
}