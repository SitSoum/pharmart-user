"use client"

import FilterBar from "./components/filterBar"
import FilterdProducts from "./components/filterdProducts"
import { useState } from "react"  

const ProductsPage=()=>{

    const [numResult,setNumResult] = useState();

    return(
        <div className="page  w-screen mt-26.25 h-screen flex flex-row p-5">
            <FilterBar/>


            <div className="product-section flex-1 flex flex-col w-full h-full">
                <label className="text-2xl font-extrabold text-lime-400 px-10 pt-3 pb-5">
                    {numResult} Results
                </label>
                <FilterdProducts setNumResult={setNumResult}/>
            </div>
        </div>
    )
}

export default ProductsPage