// Telegram webhook handler for Vercel
// This file should be placed in the api/ directory for Vercel deployment

const axios = require('axios');

const BOT_TOKEN = '1941939105:AAHJ9XhL9uRyzQ9uhi3F4rKAQIbQ9D7YRs8';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Firebase Admin SDK setup (simplified for webhook)
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { callback_query } = req.body;
    
    if (callback_query) {
      const { data: callbackData, message, from } = callback_query;
      const chatId = message.chat.id;
      
      // Handle order approval/rejection
      if (callbackData.startsWith('approve_order_') || callbackData.startsWith('reject_order_')) {
        const orderId = callbackData.replace(/^(approve_order_|reject_order_)/, '');
        const isApproval = callbackData.startsWith('approve_order_');
        
        try {
          if (isApproval) {
            // Get pending order from Firestore
            const pendingOrderDoc = await db.collection('pendingOrders').doc(orderId).get();
            
            if (pendingOrderDoc.exists) {
              const pendingOrder = { id: orderId, ...pendingOrderDoc.data() };
              
              // Create approved order
              const approvedOrder = {
                ...pendingOrder,
                status: 'approved',
                paymentStatus: 'pending',
                timestamp: new Date().toISOString(),
              };
              
              // Add to orders collection
              const orderRef = await db.collection('orders').add(approvedOrder);
              
              // Add items to table bill
              await addToTableBill(pendingOrder.userId, pendingOrder.tableNumber, pendingOrder.items);
              
              // Send to departments
              await sendOrderToDepartments(orderRef.id, { ...approvedOrder, id: orderRef.id }, pendingOrder.userId);
              
              // Remove pending order
              await db.collection('pendingOrders').doc(orderId).delete();
              
              const responseMessage = `✅ Order ${orderId.slice(0, 8)} has been approved and sent to kitchen/bar!`;
              
              await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: chatId,
                text: responseMessage,
                parse_mode: 'HTML'
              });
            } else {
              throw new Error('Pending order not found');
            }
          } else {
            // Reject order
            await db.collection('pendingOrders').doc(orderId).delete();
            
            const responseMessage = `❌ Order ${orderId.slice(0, 8)} has been rejected.`;
            
            await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
              chat_id: chatId,
              text: responseMessage,
              parse_mode: 'HTML'
            });
          }
          
          // Answer the callback query
          await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
            callback_query_id: callback_query.id,
            text: isApproval ? 'Order approved!' : 'Order rejected!',
            show_alert: false
          });
          
        } catch (error) {
          console.error('Error processing order:', error);
          
          await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
            callback_query_id: callback_query.id,
            text: 'Error processing order. Please try again.',
            show_alert: true
          });
        }
      }
      
      // Handle payment confirmation approval/rejection
      else if (callbackData.startsWith('approve_payment_') || callbackData.startsWith('reject_payment_')) {
        const confirmationId = callbackData.replace(/^(approve_payment_|reject_payment_)/, '');
        const isApproval = callbackData.startsWith('approve_payment_');
        
        try {
          if (isApproval) {
            // Get payment confirmation
            const confirmationDoc = await db.collection('paymentConfirmations').doc(confirmationId).get();
            
            if (confirmationDoc.exists) {
              const confirmation = confirmationDoc.data();
              
              // Mark table bill as paid
              const tableBillQuery = await db.collection('tableBills')
                .where('userId', '==', confirmation.userId)
                .where('tableNumber', '==', confirmation.tableNumber)
                .where('status', '==', 'active')
                .get();
              
              if (!tableBillQuery.empty) {
                const tableBillDoc = tableBillQuery.docs[0];
                await tableBillDoc.ref.update({
                  status: 'paid',
                  paymentConfirmationId: confirmationId,
                  updatedAt: new Date().toISOString()
                });
              }
              
              // Update confirmation status
              await db.collection('paymentConfirmations').doc(confirmationId).update({
                status: 'approved',
                processedAt: new Date().toISOString()
              });
            }
          } else {
            // Reject payment
            await db.collection('paymentConfirmations').doc(confirmationId).update({
              status: 'rejected',
              processedAt: new Date().toISOString()
            });
          }
          
          const responseMessage = isApproval 
            ? `✅ Payment ${confirmationId.slice(0, 8)} has been approved!`
            : `❌ Payment ${confirmationId.slice(0, 8)} has been rejected.`;
          
          await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: responseMessage,
            parse_mode: 'HTML'
          });
          
          await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
            callback_query_id: callback_query.id,
            text: isApproval ? 'Payment approved!' : 'Payment rejected!',
            show_alert: false
          });
          
        } catch (error) {
          console.error('Error processing payment:', error);
          
          await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
            callback_query_id: callback_query.id,
            text: 'Error processing payment. Please try again.',
            show_alert: true
          });
        }
      }
      
      // Handle kitchen/bar ready/delay responses
      else if (callbackData.includes('ready_') || callbackData.includes('delay_')) {
        const [action, department, orderId] = callbackData.split('_');
        const isReady = action === 'ready';
        const departmentName = department === 'kitchen' ? 'Kitchen' : 'Bar';
        
        const responseMessage = isReady 
          ? `✅ ${departmentName} marked order ${orderId.slice(0, 8)} as READY!`
          : `⏰ ${departmentName} reported delay for order ${orderId.slice(0, 8)}`;
        
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
          chat_id: chatId,
          text: responseMessage,
          parse_mode: 'HTML'
        });
        
        await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
          callback_query_id: callback_query.id,
          text: isReady ? 'Marked as ready!' : 'Delay reported!',
          show_alert: false
        });
      }
    }
    
    res.status(200).json({ ok: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper functions
async function addToTableBill(userId, tableNumber, items) {
  try {
    const tableBillQuery = await db.collection('tableBills')
      .where('userId', '==', userId)
      .where('tableNumber', '==', tableNumber)
      .where('status', '==', 'active')
      .get();
    
    if (!tableBillQuery.empty) {
      // Update existing bill
      const tableBillDoc = tableBillQuery.docs[0];
      const existingBill = tableBillDoc.data();
      const updatedItems = [...existingBill.items];
      
      items.forEach(newItem => {
        const idx = updatedItems.findIndex(item => item.id === newItem.id);
        if (idx >= 0) {
          updatedItems[idx].quantity += newItem.quantity;
          updatedItems[idx].total += newItem.total;
        } else {
          updatedItems.push(newItem);
        }
      });
      
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.15;
      const total = subtotal + tax;
      
      await tableBillDoc.ref.update({
        items: updatedItems,
        subtotal,
        tax,
        total,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new bill
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.15;
      const total = subtotal + tax;
      
      await db.collection('tableBills').add({
        tableNumber,
        userId,
        items,
        subtotal,
        tax,
        total,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error adding to table bill:', error);
  }
}

async function sendOrderToDepartments(orderId, order, userId) {
  try {
    // Get menu items to determine departments
    const menuItemsQuery = await db.collection('menuItems').where('userId', '==', userId).get();
    const menuItems = menuItemsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Group items by department
    const kitchenItems = [];
    const barItems = [];
    
    for (const orderItem of order.items) {
      const menuItem = menuItems.find(mi => mi.id === orderItem.id);
      if (menuItem?.department === 'bar') {
        barItems.push(orderItem);
      } else {
        kitchenItems.push(orderItem);
      }
    }
    
    // Send to kitchen if has kitchen items
    if (kitchenItems.length > 0) {
      await sendToDepartment(order, 'kitchen', kitchenItems, -1002660493020);
    }
    
    // Send to bar if has bar items
    if (barItems.length > 0) {
      await sendToDepartment(order, 'bar', barItems, -1002859150516);
    }
  } catch (error) {
    console.error('Error sending order to departments:', error);
  }
}

async function sendToDepartment(order, department, departmentItems, chatId) {
  const emoji = department === 'kitchen' ? '👨‍🍳' : '🍹';
  const departmentName = department === 'kitchen' ? 'Kitchen' : 'Bar';

  const orderItems = departmentItems
    .map(item => `• ${item.name} x${item.quantity}`)
    .join('\n');

  const message = `
${emoji} <b>${departmentName} Order - Table ${order.tableNumber}</b>

${orderItems}

🕐 <b>Time:</b> ${new Date(order.timestamp).toLocaleString()}
📋 <b>Order ID:</b> ${order.id.slice(0, 8)}

<b>Status: APPROVED - Start Preparation</b>
  `.trim();

  const buttons = [
    [
      { text: '✅ Ready', callback_data: `ready_${department}_${order.id}` },
      { text: '⏰ Delay', callback_data: `delay_${department}_${order.id}` }
    ]
  ];

  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  } catch (error) {
    console.error(`Error sending to ${department}:`, error);
  }
}