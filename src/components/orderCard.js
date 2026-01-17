

// export default StoreOrderCard;
import { supabase } from "@/app/supabase";
import Image from "next/image";
import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Truck, 
  Package, 
  Clock, 
  MapPin,
  User,
  CreditCard,
  DollarSign
} from "lucide-react";

const StoreOrderCard = ({ order, refresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState(null);

  const updateStatus = async (status) => {
    setIsUpdating(true);
    setActionError(null);
    
    try {
      // ACCEPT → deduct stock
      if (status === "ACCEPTED") {
        for (const item of order.order_items) {
          const product = item.products[0];
          if (!product) continue;

          const { data } = await supabase
            .from("product_sale_units")
            .select("stock_quantity")
            .eq("product_id", product.id)
            .eq("unit_name", item.product_sale_unit)
            .single();

          const newStock = Math.max((data?.stock_quantity ?? 0) - item.quantity, 0);

          await supabase
            .from("product_sale_units")
            .update({ stock_quantity: newStock })
            .eq("product_id", product.id)
            .eq("unit_name", item.product_sale_unit);
        }
      }

      // COMPLETED → payment
      if (status === "COMPLETED") {
        if (order.payment_method === "card") {
          const res = await fetch("/api/capture-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.id }),
          });

          const result = await res.json();
          if (!result.success) {
            throw new Error("Payment capture failed");
          }
        }

        if (order.payment_method === "cash") {
          await supabase
            .from("payments")
            .update({ status: "CASH_PAID" })
            .eq("order_id", order.id);
        }
      }

      // Update order status
      await supabase.from("orders").update({ status }).eq("id", order.id);

      refresh();
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const customer = order.users[0];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'READY_FOR_PICKUP': return 'bg-purple-100 text-purple-800';
      case 'OUT_FOR_DELIVERY': return 'bg-indigo-100 text-indigo-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = () => {
    return order.payment_method === 'card' ? 
      <CreditCard className="w-4 h-4" /> : 
      <DollarSign className="w-4 h-4" />;
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 mt-4 backdrop-blur-sm bg-linear-to-br from-white to-gray-50/50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-full absolute top-0 opacity-50 animate-ping"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Order #{order.id}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <User className="w-3.5 h-3.5" />
              <span>{customer?.first_name} {customer?.last_name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)} inline-flex items-center gap-1.5`}>
            <Clock className="w-3.5 h-3.5" />
            {order.status.replace(/_/g, ' ')}
          </div>
          <div className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            ${parseFloat(order.total_amount).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          {order.shipping_method === "delivery" ? (
            <>
              <Truck className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Delivery to</p>
                <p className="text-sm font-medium text-gray-900 truncate">{order.full_location}</p>
              </div>
            </>
          ) : (
            <>
              <Package className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Store Pickup</p>
                <p className="text-sm font-medium text-gray-900">Customer will collect</p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          {getPaymentIcon()}
          <div>
            <p className="text-xs text-gray-500">Payment Method</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{order.payment_method}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Order Items
        </h4>
        <div className="space-y-3">
          {order.order_items.map((item, idx) => {
            const product = item.products[0];
            if (!product) return null;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="relative">
                  {product.image_url ? (
                    <div className="w-14 h-14 relative overflow-hidden rounded-lg bg-linear-to-br from-gray-100 to-gray-200">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {item.product_sale_unit}
                    </span>
                    <span>× ${parseFloat(item.price_at_purchase).toFixed(2)}</span>
                    <span className="ml-auto font-semibold text-gray-900">
                      ${(item.quantity * item.price_at_purchase).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-gray-200">
        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              {actionError}
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {order.status === "PENDING" && (
            <>
              <button
                onClick={() => updateStatus("ACCEPTED")}
                disabled={isUpdating}
                className="px-4 py-2.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Accept Order
              </button>
              <button
                onClick={() => updateStatus("REJECTED")}
                disabled={isUpdating}
                className="px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                <XCircle className="w-4 h-4" />
                Reject Order
              </button>
            </>
          )}

          {order.status === "ACCEPTED" && order.shipping_method === "pickup" && (
            <button
              onClick={() => updateStatus("READY_FOR_PICKUP")}
              disabled={isUpdating}
              className="px-4 py-2.5 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Package className="w-4 h-4" />
              )}
              Mark as Ready for Pickup
            </button>
          )}

          {order.status === "ACCEPTED" && order.shipping_method === "delivery" && (
            <button
              onClick={() => updateStatus("OUT_FOR_DELIVERY")}
              disabled={isUpdating}
              className="px-4 py-2.5 bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Truck className="w-4 h-4" />
              )}
              Out for Delivery
            </button>
          )}

          {(order.status === "READY_FOR_PICKUP" || order.status === "OUT_FOR_DELIVERY") && (
            <button
              onClick={() => updateStatus("COMPLETED")}
              disabled={isUpdating}
              className="px-4 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOrderCard;