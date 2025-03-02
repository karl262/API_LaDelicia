import cron from 'node-cron';
import OrderModel from '../models/orderModels.js';
import { pool } from '../config/db.js'; 

export function startOrderExpirationScheduler() {
  // Run every minute to check for expired orders
  cron.schedule('* * * * *', async () => {
    try {
      // Find expired orders
      const expiredOrdersQuery = `
        SELECT id FROM orders 
        WHERE status = 'pendiente' 
        AND expiration_time < CURRENT_TIMESTAMP
      `;
      const expiredOrdersResult = await pool.query(expiredOrdersQuery);
      
      // Cancel each expired order
      for (const order of expiredOrdersResult.rows) {
        try {
          await OrderModel.updateOrderStatus(order.id, 'cancelado');
          console.log(`Automatically cancelled expired order: ${order.id}`);
        } catch (cancelError) {
          console.error(`Error cancelling order ${order.id}:`, cancelError);
        }
      }

      console.log(`Checked and processed ${expiredOrdersResult.rowCount} expired orders`);
    } catch (error) {
      console.error('Order expiration scheduler error:', error);
    }
  });
}

// Optional: Add a method to manually process expired orders if needed
export async function processExpiredOrders() {
  try {
    const cancelledOrders = await OrderModel.cancelExpiredOrders();
    console.log(`Manually processed and cancelled ${cancelledOrders} expired orders`);
    return cancelledOrders;
  } catch (error) {
    console.error('Manual order expiration processing error:', error);
    throw error;
  }
}