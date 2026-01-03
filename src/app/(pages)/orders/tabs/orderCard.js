
  const OrderCard = ({ order, arrowUp = true }) => (
    <div className="border border-gray-300 rounded-lg mb-4">
      <div className="flex justify-between p-3 bg-white rounded-t-lg">
        <span>{order.no}</span>
        <span>{order.store}</span>
        <span>{order.total}</span>
        <span>{arrowUp ? "↑" : "↓"}</span>
      </div>
      <div className="p-3 space-y-1">
        {order.products.map((p, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{p.name}</span>
            <span>{p.price}</span>
            <span>{p.qty}</span>
          </div>
        ))}
        <div className="text-right text-blue-600 mt-2 cursor-pointer">
          link to store page
        </div>
      </div>
    </div>
  );

export default OrderCard;