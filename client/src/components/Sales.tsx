import { useEffect, useState } from "react";
import axios from "axios";
import { restaurantService } from "../main";

interface IDailySale {
  date: string;
  sales: number;
  orders: number;
}

interface ISalesOrder {
  _id: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
  totalAmount: number;
  paymentMethod: "razorpay" | "stripe";
  paymentStatus: "paid" | "failed" | "pending";
  status: string;
  createdAt: string;
}

interface ISalesData {
  summary: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
  };

  dailySales: IDailySale[];

  orders: ISalesOrder[];
}

interface SalesProps {
  restaurantId: string;
}

type SalesRange = "7" | "30" | "90";

const Sales = ({ restaurantId }: SalesProps) => {
  const [range, setRange] = useState<SalesRange>("7");

  const [salesData, setSalesData] =
    useState<ISalesData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        `${restaurantService}/api/order/restaurant/${restaurantId}/sales`,
        {
          params: {
            range,
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSalesData(data);
    } catch (error) {
      console.log(error);

      setError("Unable to fetch sales data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchSales();
    }
  }, [restaurantId, range]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[75] items-center justify-center">
        <p className="text-gray-500">
          Loading sales...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!salesData) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track your restaurant's sales and orders
          </p>
        </div>

        {/* Range Filter */}
        <div className="flex rounded-lg border bg-white p-1">
          {[
            { value: "7", label: "Last 7 Days" },
            { value: "30", label: "Last 30 Days" },
            { value: "90", label: "Last 90 Days" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() =>
                setRange(item.value as SalesRange)
              }
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                range === item.value
                  ? "bg-red-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Sales
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {formatCurrency(
              salesData.summary.totalSales
            )}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            From delivered orders
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {salesData.summary.totalOrders}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Completed orders
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Order Value
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {formatCurrency(
              salesData.summary.averageOrderValue
            )}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Average food order value
          </p>
        </div>

      </div>

      {/* Daily Sales */}

      <div className="rounded-xl border bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h3 className="font-semibold text-gray-800">
            Daily Sales
          </h3>

          <p className="text-sm text-gray-500">
            Your sales performance during the selected period
          </p>
        </div>

        {salesData.dailySales.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              No sales found for this period.
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {salesData.dailySales.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(day.date)}
                  </p>

                  <p className="text-xs text-gray-400">
                    {day.orders}{" "}
                    {day.orders === 1
                      ? "order"
                      : "orders"}
                  </p>
                </div>

                <p className="font-semibold text-gray-800">
                  {formatCurrency(day.sales)}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* Order History */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="border-b p-5">
          <h3 className="font-semibold text-gray-800">
            Sales History
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Orders included in your sales
          </p>
        </div>

        {salesData.orders.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              No orders found.
            </p>
          </div>
        ) : (
          <div className="divide-y">

            {salesData.orders.map((order) => (
              <div
                key={order._id}
                className="p-5"
              >

                <div className="flex flex-col justify-between gap-3 sm:flex-row">

                  <div>
                    <p className="font-medium text-gray-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(order.subTotal)}
                    </p>

                    <p className="text-xs capitalize text-gray-400">
                      {order.paymentMethod}
                    </p>
                  </div>

                </div>

                {/* Items */}

                <div className="mt-4 space-y-2">

                  {order.items.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>

                      <span className="text-gray-700">
                        {formatCurrency(
                          item.price * item.quantity
                        )}
                      </span>
                    </div>
                  ))}

                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-600">
                    {order.status}
                  </span>

                  <span className="text-sm font-medium text-gray-700">
                    Food Total:{" "}
                    {formatCurrency(order.subTotal)}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Sales;