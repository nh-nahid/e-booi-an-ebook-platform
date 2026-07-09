"use client";

import DashboardChart from "@/features/admin/components/dashboard/dashboard-chart";
import LatestUsers from "@/features/admin/components/dashboard/latest-users";
import RecentOrders from "@/features/admin/components/dashboard/recent-orders";
import SalesChart from "@/features/admin/components/dashboard/sales-chart";
import StatCard from "@/features/admin/components/dashboard/stat-card";
import TopBooks from "@/features/admin/components/dashboard/top-books";

import {
  useDashboard,
  useSales,
  useTopBooks,
} from "@/features/admin/hooks/admin.hooks";
import AdminLoading from "./loading";

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();

  const { data: sales, isLoading: salesLoading } = useSales();

  const { data: topBooks, isLoading: topBooksLoading } = useTopBooks();

  if (dashboardLoading || salesLoading || topBooksLoading) {
    return <AdminLoading />;
  }

  const statistics = dashboard?.statistics;

  const salesData =
    sales?.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      sales: item.totalSales,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* ================= Stats ================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`৳ ${statistics?.totalRevenue ?? 0}`}
          icon="dollar"
          accent="teal"
        />

        <StatCard
          label="Total Books"
          value={statistics?.totalBooks ?? 0}
          icon="book"
          accent="teal"
        />

        <StatCard
          label="Total Users"
          value={statistics?.totalUsers ?? 0}
          icon="users"
          accent="teal"
        />

        <StatCard
          label="Total Orders"
          value={statistics?.totalOrders ?? 0}
          icon="shopping"
          accent="teal"
        />
      </div>

      {/* ================= Charts ================= */}

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <SalesChart data={salesData} />

        <DashboardChart data={dashboard?.categoryAnalytics || []} />
      </div>

      {/* ================= Widgets ================= */}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders
            orders={
              dashboard?.recentOrders.map((order) => ({
                id: order._id,
                customerName: order.shippingAddress.fullName,
                bookTitle:
                  order.items.length > 0
                    ? `${order.items.length} Book${
                        order.items.length > 1 ? "s" : ""
                      }`
                    : "-",
                amount: order.finalAmount,
                status: order.orderStatus,
                date: new Date(order.createdAt).toLocaleDateString(),
              })) ?? []
            }
          />
        </div>

        <LatestUsers
          users={
            dashboard?.latestUsers.map((user) => ({
              id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              joinedAt: new Date(user.createdAt).toLocaleDateString(),
            })) ?? []
          }
        />
      </div>

      <TopBooks
        books={
          topBooks?.map((book) => ({
            id: book._id,

            title: book.title,

            author: book.author,

            sales: book.sold,

            rating: 0,

            coverUrl: book.coverImage
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/uploads/books/${book.coverImage}`
        : undefined,
    })) ?? []
        }
      />
    </div>
  );
}
