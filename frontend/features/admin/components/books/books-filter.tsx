import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const booksFilter = () => {
    return (
        <div className="rounded-2xl border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search books..."
              className="pl-9"
            />
          </div>

          <select className="h-10 rounded-md border px-3">
            <option>All Categories</option>
          </select>

          <select className="h-10 rounded-md border px-3">
            <option>All Types</option>
          </select>

          <select className="h-10 rounded-md border px-3">
            <option>All Status</option>
          </select>
        </div>
      </div>
    );
};

export default booksFilter;