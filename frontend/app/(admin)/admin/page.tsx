import { BookOpen, Users, ShoppingBag, DollarSign } from "lucide-react";

import StatCard from "@/features/admin/components/stat-card";
import SalesChart from "@/features/admin/components/sales-chart";
import DashboardChart from "@/features/admin/components/dashboard-chart";
import RecentOrders from "@/features/admin/components/recent-orders";
import LatestUsers from "@/features/admin/components/latest-users";
import TopBooks from "@/features/admin/components/top-books";

// TODO: replace all of this with real data fetching (server actions / API calls)
const salesData = [
  { label: "Mon", sales: 4200 },
  { label: "Tue", sales: 5100 },
  { label: "Wed", sales: 3800 },
  { label: "Thu", sales: 6200 },
  { label: "Fri", sales: 7400 },
  { label: "Sat", sales: 8900 },
  { label: "Sun", sales: 6700 },
];

const categoryData = [
  { name: "Novel", value: 420 },
  { name: "Religious", value: 260 },
  { name: "Science", value: 180 },
  { name: "Business", value: 140 },
  { name: "Literature", value: 95 },
  { name: "Education", value: 60 },
];

const recentOrders = [
  {
    id: "10234",
    customerName: "Rahim Ahmed",
    bookTitle: "The Silent Ocean",
    amount: 450,
    status: "completed" as const,
    date: "Jul 07",
  },
  {
    id: "10233",
    customerName: "Fatima Khan",
    bookTitle: "Letters from Dhaka",
    amount: 320,
    status: "processing" as const,
    date: "Jul 07",
  },
  {
    id: "10232",
    customerName: "Karim Hasan",
    bookTitle: "The Last Chapter",
    amount: 610,
    status: "pending" as const,
    date: "Jul 06",
  },
  {
    id: "10231",
    customerName: "Nusrat Jahan",
    bookTitle: "Whispers of Time",
    amount: 275,
    status: "cancelled" as const,
    date: "Jul 06",
  },
];

const latestUsers = [
  {
    id: "u1",
    name: "Tanvir Islam",
    email: "tanvir@example.com",
    joinedAt: "2h ago",
  },
  {
    id: "u2",
    name: "Sadia Rahman",
    email: "sadia@example.com",
    joinedAt: "5h ago",
  },
  {
    id: "u3",
    name: "Arif Chowdhury",
    email: "arif@example.com",
    joinedAt: "1d ago",
    role: "admin" as const,
  },
  { id: "u4", name: "Mim Akter", email: "mim@example.com", joinedAt: "2d ago" },
];

const topBooks = [
  {
    id: "b1",
    title: "The Silent Ocean",
    author: "Ayesha Noor",
    sales: 320,
    rating: 4.8,
  },
  {
    id: "b2",
    title: "Letters from Dhaka",
    author: "Rafiq Islam",
    sales: 275,
    rating: 4.6,
  },
  {
    id: "b3",
    title: "The Last Chapter",
    author: "Nadia Hossain",
    sales: 240,
    rating: 4.5,
  },
  {
    id: "b4",
    title: "Whispers of Time",
    author: "Kamal Uddin",
    sales: 198,
    rating: 4.3,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value="৳ 4,52,300"
          icon="dollar"
          trend={12.4}
          accent="teal"
        />

        <StatCard
          label="Total Books"
          value="1,156"
          icon="book"
          trend={4.1}
          accent="teal"
        />

        <StatCard
          label="Total Users"
          value="8,924"
          icon="users"
          trend={8.7}
          accent="teal"
        />

        <StatCard
          label="Total Orders"
          value="2,341"
          icon="shopping"
          trend={-2.3}
          accent="teal"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <SalesChart data={salesData} />
        <DashboardChart data={categoryData} />
      </div>

      {/* Widgets */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <LatestUsers users={latestUsers} />
      </div>

      <TopBooks books={topBooks} />
    </div>
  );
}
