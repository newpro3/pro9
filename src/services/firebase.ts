import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { 
  MenuItem, Category, Order, Bill, User, MenuStats, 
  PendingOrder, TableBill, RestaurantSettings, PaymentConfirmation, OrderItem
} from '../types';

class FirebaseService {
  // =======================
  // Menu Items
  // =======================
  async getMenuItems(userId: string): Promise<MenuItem[]> {
    try {
      // First check if user has any menu items, if not create sample data
      const q = query(
        collection(db, 'menuItems'), 
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Create sample menu items and categories
        await this.createSampleData(userId);
        // Fetch again after creating sample data
        const newSnapshot = await getDocs(q);
        const items = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        return items.sort((a, b) => a.category.localeCompare(b.category));
      }
      
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      return items.sort((a, b) => a.category.localeCompare(b.category));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  private async createSampleData(userId: string): Promise<void> {
    try {
      // Create sample categories
      const categories = [
        { name: 'Appetizers', order: 1 },
        { name: 'Main Dishes', order: 2 },
        { name: 'Pizza', order: 3 },
        { name: 'Pasta', order: 4 },
        { name: 'Desserts', order: 5 },
        { name: 'Beverages', order: 6 }
      ];

      for (const category of categories) {
        await addDoc(collection(db, 'categories'), {
          ...category,
          userId,
          created_at: new Date().toISOString(),
        });
      }

      // Create sample menu items
      const sampleItems = [
        {
          name: 'Bruschetta Trio',
          description: 'Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella',
          price: 12.99,
          photo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          category: 'Appetizers',
          department: 'kitchen' as const,
          available: true,
          preparation_time: 8,
          ingredients: 'Bread, Tomatoes, Basil, Mozzarella, Olive Oil',
          allergens: 'Gluten, Dairy',
          popularity_score: 92,
          views: 245,
          orders: 78,
        },
        {
          name: 'Grilled Salmon',
          description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon butter sauce',
          price: 24.99,
          photo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          category: 'Main Dishes',
          department: 'kitchen' as const,
          available: true,
          preparation_time: 18,
          ingredients: 'Atlantic Salmon, Herbs, Lemon, Butter',
          allergens: 'Fish, Dairy',
          popularity_score: 88,
          views: 189,
          orders: 56,
        },
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza with fresh tomatoes, mozzarella, and basil on our wood-fired crust',
          price: 16.99,
          photo: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
          category: 'Pizza',
          department: 'kitchen' as const,
          available: true,
          preparation_time: 15,
          ingredients: 'Pizza Dough, Tomatoes, Mozzarella, Basil',
          allergens: 'Gluten, Dairy',
          popularity_score: 95,
          views: 312,
          orders: 124,
        },
        {
          name: 'Truffle Carbonara',
          description: 'Creamy pasta with pancetta, egg yolk, parmesan, and black truffle shavings',
          price: 22.99,
          photo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          category: 'Pasta',
          department: 'kitchen' as const,
          available: true,
          preparation_time: 12,
          ingredients: 'Pasta, Pancetta, Eggs, Parmesan, Black Truffle',
          allergens: 'Gluten, Dairy, Eggs',
          popularity_score: 90,
          views: 156,
          orders: 43,
        },
        {
          name: 'Tiramisu',
          description: 'Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
          price: 8.99,
          photo: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
          category: 'Desserts',
          department: 'kitchen' as const,
          available: true,
          preparation_time: 5,
          ingredients: 'Ladyfingers, Coffee, Mascarpone, Cocoa',
          allergens: 'Gluten, Dairy, Eggs',
          popularity_score: 87,
          views: 134,
          orders: 67,
        },
        {
          name: 'Craft Beer Selection',
          description: 'Rotating selection of local craft beers on tap',
          price: 6.99,
          photo: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg',
          category: 'Beverages',
          department: 'bar' as const,
          available: true,
          preparation_time: 2,
          ingredients: 'Local Craft Beer',
          allergens: 'Gluten',
          popularity_score: 82,
          views: 98,
          orders: 45,
        },
        {
          name: 'Signature Cocktail',
          description: 'House special cocktail with premium spirits and fresh ingredients',
          price: 12.99,
          photo: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg',
          category: 'Beverages',
          department: 'bar' as const,
          available: true,
          preparation_time: 5,
          ingredients: 'Premium Spirits, Fresh Fruits, Herbs',
          allergens: 'None',
          popularity_score: 89,
          views: 167,
          orders: 78,
        },
        {
          name: 'Mediterranean Bowl',
          description: 'Fresh quinoa bowl with grilled vegetables, feta cheese, and tahini dressing',
          price: 18.99,
          photo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          category: 'Main Dishes',
          department: 'kitchen' as const,
          available: true,
          preparation_time: 10,
          ingredients: 'Quinoa, Mixed Vegetables, Feta, Tahini',
          allergens: 'Dairy, Sesame',
          popularity_score: 86,
          views: 123,
          orders: 34,
        }
      ];

      for (const item of sampleItems) {
        await addDoc(collection(db, 'menuItems'), {
          ...item,
          userId,
          last_updated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  }

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'menuItems'), {
        ...item,
        created_at: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'menuItems', id), {
        ...updates,
        last_updated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  // =======================
  // Categories
  // =======================
  async getCategories(userId: string): Promise<Category[]> {
    try {
      const q = query(
        collection(db, 'categories'), 
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        created_at: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // =======================
  // Pending Orders
  // =======================
  async getPendingOrders(userId: string): Promise<PendingOrder[]> {
    try {
      const q = query(
        collection(db, 'pendingOrders'), 
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PendingOrder));
      return orders.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      return [];
    }
  }

  async addPendingOrder(order: Omit<PendingOrder, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'pendingOrders'), {
        ...order,
        timestamp: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding pending order:', error);
      throw error;
    }
  }

  async approvePendingOrder(pendingOrderId: string, pendingOrder: PendingOrder): Promise<string> {
    try {
      const approvedOrder: Omit<Order, 'id'> = {
        ...pendingOrder,
        status: 'approved',
        paymentStatus: 'pending',
      };
      
      // Add the order to orders collection
      const orderId = await this.addOrder(approvedOrder);
      
      // Add items to table bill
      await this.addToTableBill(pendingOrder.userId, pendingOrder.tableNumber, pendingOrder.items);
      
      // Send order to appropriate departments after approval
      await this.sendOrderToDepartments(orderId, { ...approvedOrder, id: orderId }, pendingOrder.userId);
      
      // Remove the pending order
      await deleteDoc(doc(db, 'pendingOrders', pendingOrderId));
      return orderId;
    } catch (error) {
      console.error('Error approving pending order:', error);
      throw error;
    }
  }

  async sendOrderToDepartments(orderId: string, order: Order, userId: string): Promise<void> {
    try {
      // Get menu items to determine departments
      const menuItems = await this.getMenuItems(userId);
      const { telegramService } = await import('./telegram');
      
      // Group items by department
      const kitchenItems: OrderItem[] = [];
      const barItems: OrderItem[] = [];
      
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
        await telegramService.sendOrderToDepartment(order, 'kitchen', kitchenItems);
      }
      
      // Send to bar if has bar items
      if (barItems.length > 0) {
        await telegramService.sendOrderToDepartment(order, 'bar', barItems);
      }
    } catch (error) {
      console.error('Error sending order to departments:', error);
      // Don't throw error to prevent order approval from failing
      console.warn('Order approved but Telegram notification failed');
    }
  }

  async rejectPendingOrder(pendingOrderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'pendingOrders', pendingOrderId));
    } catch (error) {
      console.error('Error rejecting pending order:', error);
      throw error;
    }
  }

  // =======================
  // Table Bills
  // =======================
  async getTableBills(userId: string): Promise<TableBill[]> {
    try {
      const q = query(
        collection(db, 'tableBills'), 
        where('userId', '==', userId),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      const bills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TableBill));
      return bills.sort((a, b) => parseInt(a.tableNumber) - parseInt(b.tableNumber));
    } catch (error) {
      console.error('Error fetching table bills:', error);
      return [];
    }
  }

  async getTableBill(userId: string, tableNumber: string): Promise<TableBill | null> {
    try {
      const q = query(
        collection(db, 'tableBills'), 
        where('userId', '==', userId),
        where('tableNumber', '==', tableNumber),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docData = snapshot.docs[0];
      return { id: docData.id, ...docData.data() } as TableBill;
    } catch (error) {
      console.error('Error fetching table bill:', error);
      return null;
    }
  }

  async addToTableBill(userId: string, tableNumber: string, items: OrderItem[]): Promise<void> {
    try {
      const existingBill = await this.getTableBill(userId, tableNumber);
      if (existingBill) {
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
        await updateDoc(doc(db, 'tableBills', existingBill.id), {
          items: updatedItems,
          subtotal,
          tax,
          total,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        const newBill: Omit<TableBill, 'id'> = {
          tableNumber,
          userId,
          items,
          subtotal,
          tax,
          total,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await addDoc(collection(db, 'tableBills'), newBill);
      }
    } catch (error) {
      console.error('Error adding to table bill:', error);
      throw error;
    }
  }

  async removeItemFromTableBill(userId: string, tableNumber: string, itemId: string): Promise<void> {
    try {
      const bill = await this.getTableBill(userId, tableNumber);
      if (!bill) return;
      const updatedItems = bill.items.filter(item => item.id !== itemId);
      if (updatedItems.length === 0) {
        await updateDoc(doc(db, 'tableBills', bill.id), {
          status: 'cancelled',
          updatedAt: new Date().toISOString(),
        });
      } else {
        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        await updateDoc(doc(db, 'tableBills', bill.id), {
          items: updatedItems,
          subtotal,
          tax,
          total,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error removing item from table bill:', error);
      throw error;
    }
  }

  async markTableBillAsPaid(userId: string, tableNumber: string, confirmationId?: string): Promise<void> {
    try {
      const bill = await this.getTableBill(userId, tableNumber);
      if (!bill) return;
      const updates: Partial<TableBill> = {
        status: 'paid',
        updatedAt: new Date().toISOString()
      };
      if (confirmationId) {
        updates.paymentConfirmationId = confirmationId;
      }
      await updateDoc(doc(db, 'tableBills', bill.id), updates);
    } catch (error) {
      console.error('Error marking table bill as paid:', error);
      throw error;
    }
  }

  // =======================
  // Payment Confirmations
  // =======================
  async addPaymentConfirmation(confirmation: Omit<PaymentConfirmation, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'paymentConfirmations'), {
        ...confirmation,
        timestamp: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding payment confirmation:', error);
      throw error;
    }
  }

  async getPaymentConfirmations(userId: string): Promise<PaymentConfirmation[]> {
    try {
      const q = query(
        collection(db, 'paymentConfirmations'), 
        where('userId', '==', userId),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PaymentConfirmation));
    } catch (error) {
      console.error('Error fetching payment confirmations:', error);
      return [];
    }
  }

  async updatePaymentConfirmation(id: string, status: 'approved' | 'rejected'): Promise<void> {
    try {
      await updateDoc(doc(db, 'paymentConfirmations', id), {
        status,
        processedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating payment confirmation:', error);
      throw error;
    }
  }

  // =======================
  // Orders
  // =======================
  async getOrders(userId: string, limit_count?: number): Promise<Order[]> {
    try {
      let q = query(
        collection(db, 'orders'), 
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      const sortedOrders = orders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return limit_count ? sortedOrders.slice(0, limit_count) : sortedOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async addOrder(order: Omit<Order, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        timestamp: new Date().toISOString(),
      });
      await this.createBill(docRef.id, order);
      return docRef.id;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    try {
      await updateDoc(doc(db, 'orders', id), updates);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // =======================
  // Bills
  // =======================
  async createBill(orderId: string, order: Omit<Order, 'id'>): Promise<string> {
    try {
      const subtotal = order.totalAmount;
      const tax = subtotal * 0.15;
      const total = subtotal + tax;
      const bill: Omit<Bill, 'id'> = {
        orderId,
        userId: order.userId,
        tableNumber: order.tableNumber,
        items: order.items,
        subtotal,
        tax,
        total,
        timestamp: new Date().toISOString(),
        status: 'draft',
      };
      const docRef = await addDoc(collection(db, 'bills'), bill);
      return docRef.id;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    }
  }

  async getBills(userId: string): Promise<Bill[]> {
    try {
      const q = query(
        collection(db, 'bills'), 
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const bills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
      return bills.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  }

  async updateBill(id: string, updates: Partial<Bill>): Promise<void> {
    try {
      await updateDoc(doc(db, 'bills', id), updates);
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  }

  // =======================
  // Analytics
  // =======================
  async getMenuStats(userId: string): Promise<MenuStats> {
    try {
      const orders = await this.getOrders(userId);
      const menuItems = await this.getMenuItems(userId);
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalViews = menuItems.reduce((sum, item) => sum + item.views, 0);
      const itemOrderCounts: Record<string, { name: string; orders: number }> = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!itemOrderCounts[item.id]) {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            itemOrderCounts[item.id] = { name: menuItem?.name || item.name, orders: 0 };
          }
          itemOrderCounts[item.id].orders += item.quantity;
        });
      });
      const popularItems = Object.entries(itemOrderCounts)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);
      const monthlyRevenue = this.calculateMonthlyRevenue(orders);
      return {
        totalOrders,
        totalRevenue,
        totalViews,
        popularItems,
        recentOrders: orders.slice(0, 10),
        monthlyRevenue,
      };
    } catch (error) {
      console.error('Error fetching menu stats:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalViews: 0,
        popularItems: [],
        recentOrders: [],
        monthlyRevenue: [],
      };
    }
  }

  private calculateMonthlyRevenue(orders: Order[]): Array<{ month: string; revenue: number }> {
    const monthlyData: Record<string, number> = {};
    orders.forEach(order => {
      const date = new Date(order.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + order.totalAmount;
    });
    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }

  // =======================
  // File Upload
  // =======================
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // =======================
  // User Profile
  // =======================
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userId, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      // Handle nested settings update
      if (updates.settings) {
        const currentUser = await this.getUserProfile(userId);
        if (currentUser) {
          updates.settings = { ...currentUser.settings, ...updates.settings };
        }
      }
      
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();