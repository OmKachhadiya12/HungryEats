import { useEffect, useState } from "react";
import axios from "axios";
import { riderService } from "../main";

interface IRideHistory {
  _id: string;

  restaurantName: string;

  riderAmount: number;

  distance: number;

  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  paymentMethod: "razorpay" | "stripe";

  paymentStatus: "paid" | "failed" | "pending";

  status: string;

  createdAt: string;
}

interface IRiderHistoryData {
  summary: {
    totalRides: number;
    totalEarnings: number;
    averageEarning: number;
  };

  orders: IRideHistory[];
}

type HistoryRange = "7" | "30" | "90";

const RiderHistory = () => {
  const [range, setRange] =
    useState<HistoryRange>("30");

  const [history, setHistory] =
    useState<IRiderHistoryData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        `${riderService}/api/rider/history`,
        {
          params: {
            range,
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setHistory(data);
    } catch (error) {
      console.log(error);

      setError("Unable to fetch ride history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [range]);

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

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[62.5] items-center justify-center">
        <p className="text-gray-500">
          Loading ride history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!history) {
    return null;
  }

  return (
    <div className="space-y-5">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Ride History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View your completed rides and earnings
          </p>
        </div>

        {/* Filter */}

        <div className="flex rounded-lg border bg-white p-1">

          {[
            {
              value: "7",
              label: "7 Days",
            },
            {
              value: "30",
              label: "30 Days",
            },
            {
              value: "90",
              label: "90 Days",
            },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() =>
                setRange(
                  item.value as HistoryRange
                )
              }
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                range === item.value
                  ? "bg-[#e23744] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Earnings */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Earnings
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {formatCurrency(
              history.summary.totalEarnings
            )}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            From completed rides
          </p>

        </div>

        {/* Rides */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Completed Rides
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {history.summary.totalRides}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Successfully delivered
          </p>

        </div>

        {/* Average */}

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Average Earning
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {formatCurrency(
              history.summary.averageEarning
            )}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Per completed ride
          </p>

        </div>

      </div>

      {/* Ride History */}

      <div className="rounded-xl bg-white shadow-sm">

        <div className="border-b p-5">

          <h3 className="font-semibold text-gray-800">
            Recent Rides
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Your completed delivery history
          </p>

        </div>

        {history.orders.length === 0 ? (

          <div className="py-12 text-center">

            <p className="text-gray-500">
              No completed rides found.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Your completed rides will appear here.
            </p>

          </div>

        ) : (

          <div className="divide-y">

            {history.orders.map((order) => (

              <div
                key={order._id}
                className="p-5"
              >

                {/* Top */}

                <div className="flex flex-col justify-between gap-3 sm:flex-row">

                  <div>

                    <p className="font-semibold text-gray-800">
                      {order.restaurantName}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(order.createdAt)}
                      {" • "}
                      {formatTime(order.createdAt)}
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-lg font-bold text-green-600">
                      +{formatCurrency(
                        order.riderAmount
                      )}
                    </p>

                    <p className="text-xs text-gray-400">
                      Delivery earning
                    </p>

                  </div>

                </div>

                {/* Ride information */}

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

                  <div className="rounded-lg bg-gray-50 p-3">

                    <p className="text-xs text-gray-400">
                      Distance
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {order.distance} km
                    </p>

                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">

                    <p className="text-xs text-gray-400">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                      {order.paymentMethod}
                    </p>

                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">

                    <p className="text-xs text-gray-400">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-green-600">
                      {order.status}
                    </p>

                  </div>

                </div>

                {/* Items */}

                <div className="mt-4">

                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Order Items
                  </p>

                  <div className="space-y-1">

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
                            item.price *
                              item.quantity
                          )}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>

                {/* Footer */}

                <div className="mt-4 flex items-center justify-between border-t pt-3">

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    Delivered
                  </span>

                  <span className="text-sm font-medium text-gray-700">
                    You earned{" "}
                    {formatCurrency(
                      order.riderAmount
                    )}
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

export default RiderHistory;