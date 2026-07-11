import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type {
  DashboardResponse,
  SalesResponse,
  TopBooksResponse,
  BooksResponse,
  UsersResponse,
  NewUserValues, // <-- add
} from "../types/admin.types";

// ==============================
// Dashboard
// ==============================

export const getDashboard = async (): Promise<DashboardResponse> => {
  const { data } = await api.get(ENDPOINTS.ADMIN.DASHBOARD);
  return data;
};

export const getSales = async (): Promise<SalesResponse> => {
  const { data } = await api.get(ENDPOINTS.ADMIN.SALES);
  return data;
};

export const getTopBooks = async (): Promise<TopBooksResponse> => {
  const { data } = await api.get(ENDPOINTS.ADMIN.TOP_BOOKS);
  return data;
};

// ==============================
// Books
// ==============================

export async function getBooks(params: {
  page: number;
  search?: string;
  category?: string;
  bookType?: string;
  status?: string;
}) {
  const { data } = await api.get(ENDPOINTS.BOOKS.LIST, {
    params,
  });

  return data;
}

export async function createBook(formData: FormData) {
  const { data } = await api.post(
    ENDPOINTS.BOOKS.CREATE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function updateBook(
  id: string,
  formData: FormData
) {
  const { data } = await api.put(
    ENDPOINTS.BOOKS.UPDATE(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function deleteBook(id: string) {
  const { data } = await api.delete(
    ENDPOINTS.BOOKS.DELETE(id)
  );

  return data;
}

// ==============================
// Users
// ==============================

export async function getUsers(params: {
  page: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<UsersResponse> {
  const { data } = await api.get(
    ENDPOINTS.USERS.LIST,
    {
      params,
    }
  );

  return data;
}

export async function createUser(formData: FormData) {
  const { data } = await api.post(
    ENDPOINTS.USERS.REGISTER,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function updateUser(
  id: string,
  formData: FormData
) {
  const { data } = await api.put(
    ENDPOINTS.USERS.UPDATE(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(
    ENDPOINTS.USERS.DELETE(id)
  );

  return data;
}

// ==============================
// Users (Admin)
// ==============================

export async function getAdminUsers(params: {
  page: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<UsersResponse> {
  const queryParams = {
    page: params.page,
    ...(params.search?.trim() && {
      search: params.search.trim(),
    }),
    ...(params.role && {
      role: params.role,
    }),
    ...(params.status && {
      status: params.status,
    }),
  };

  const { data } = await api.get(ENDPOINTS.ADMIN.USERS, {
    params: queryParams,
  });

  return data;
}

export async function createAdminUser(values: NewUserValues) {
  const { data } = await api.post(
    ENDPOINTS.ADMIN.USERS,
    {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: values.role,
    }
  );

  return data;
}

export async function updateAdminUser(
  id: string,
  formData: FormData
) {
  const { data } = await api.put(
    `${ENDPOINTS.ADMIN.USERS}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function deleteAdminUser(id: string) {
  const { data } = await api.delete(
    `${ENDPOINTS.ADMIN.USERS}/${id}`
  );

  return data;
}