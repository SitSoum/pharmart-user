import ProductCart from "./productCard";
import {products} from "@/app/statics_data/product"

export default function ProductSection({ title }) {
  return (
    <section className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-10 mb-5 p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-extrabold text-2xl text-gray-800">{title}</h2>
        <a href="#" className="text-green-600 font-medium text-sm hover:text-green-800 hover:underline transition-colors">View more →</a>
      </div>

   
      <div className="flex gap-8 overflow-hidden">
              {products.map((product,key) => 
                <ProductCart data={product} key={key} />
              )}
      </div>
          
    </section> 
  );
}