import api from "./api";
import { SessionStorage } from "quasar";

/**
 * Get all orders (admin)
 * New API structure: { success: true, data: [...], message: "...", status_code: 200 }
 */
export async function getAllOrders() {
  try {
    const response = await api.get("/api/v1/orders");
    // Extract orders array from response.data.data
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Get orders error:", error);
    throw error;
  }
}

/**
 * Get orders by user ID
 * New API structure: { success: true, data: [...], message: "...", status_code: 200 }
 */
export async function getOrdersByUser(userId) {
  try {
    const response = await api.post("/api/v1/ordersByUser", {
      user_id: userId,
    });
    // Extract orders array from response.data.data
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Get user orders error:", error);
    throw error;
  }
}

/**
 * Create new order
 */
export async function createOrder(orderData) {
  try {
    const response = await api.post("/api/v1/orders", {
      customer_name: orderData.customerName,
      destiny: orderData.destiny,
      start_date: orderData.startDate,
      return_date: orderData.returnDate,
      status: "Pending",
      user_id: SessionStorage.getItem("user_id"),
    });
    return response.data;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
}

/**
 * Update order
 */
export async function updateOrder(orderId, orderData) {
  try {
    const response = await api.put(`/api/v1/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error("Update order error:", error);
    throw error;
  }
}

/**
 * Filter orders by criteria
 * Supports filtering by destination only, dates only, or any combination
 * API requires all fields to be sent, even if empty
 * New API structure: { success: true, data: [...], message: "...", status_code: 200 }
 */
export async function filterOrders(filters) {
  try {
    // API requires all fields to be sent, even if empty
    const filterPayload = {
      destination: filters.destination ? filters.destination.trim() : "",
      start_date: filters.startDate ? filters.startDate.trim() : "",
      end_date: filters.endDate ? filters.endDate.trim() : "",
    };

    const response = await api.post("/api/v1/filterOrders", filterPayload);
    // Extract orders array from response.data.data
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Filter orders error:", error);
    throw error;
  }
}
