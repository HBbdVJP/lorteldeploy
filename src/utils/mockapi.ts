// MockAPI utilities for CRUD operations with localStorage fallback
const MOCKAPI_BASE_URL = 'https://69d0c66890cd06523d5d7d21.mockapi.io';
const CUSTOMER_API_BASE_URL = 'https://69fc193bfce564e2591748b5.mockapi.io';
const USE_LOCAL_STORAGE = false; // Set to false once MockAPI resources are created

// Updated endpoints: /room, /booking, /customer (singular forms)

// Helper function to get data from localStorage
const getLocalData = (key: string) => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper function to save data to localStorage
const saveLocalData = (key: string, data: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Room API functions
export const roomAPI = {
  // Get all rooms
  getAll: async () => {
    if (USE_LOCAL_STORAGE) {
      return getLocalData('mockapi_rooms');
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/room`);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      return getLocalData('mockapi_rooms');
    }
  },

  // Get room by ID
  getById: async (id: string) => {
    if (USE_LOCAL_STORAGE) {
      const rooms = getLocalData('mockapi_rooms');
      return rooms.find((room: any) => room.roomid === id || room.id === id);
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/room/${id}`);
      if (!response.ok) throw new Error('Failed to fetch room');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const rooms = getLocalData('mockapi_rooms');
      return rooms.find((room: any) => room.roomid === id || room.id === id);
    }
  },

  // Create new room
  create: async (roomData: any) => {
    if (USE_LOCAL_STORAGE) {
      const rooms = getLocalData('mockapi_rooms');
      const newRoom = { ...roomData, roomid: Date.now().toString(), id: Date.now().toString() };
      rooms.push(newRoom);
      saveLocalData('mockapi_rooms', rooms);
      return newRoom;
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) throw new Error('Failed to create room');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const rooms = getLocalData('mockapi_rooms');
      const newRoom = { ...roomData, roomid: Date.now().toString(), id: Date.now().toString() };
      rooms.push(newRoom);
      saveLocalData('mockapi_rooms', rooms);
      return newRoom;
    }
  },

  // Update room
  update: async (id: string, roomData: any) => {
    if (USE_LOCAL_STORAGE) {
      const rooms = getLocalData('mockapi_rooms');
      const index = rooms.findIndex((room: any) => room.roomid === id || room.id === id);
      if (index !== -1) {
        rooms[index] = { ...rooms[index], ...roomData };
        saveLocalData('mockapi_rooms', rooms);
        return rooms[index];
      }
      throw new Error('Room not found');
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/room/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) throw new Error('Failed to update room');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const rooms = getLocalData('mockapi_rooms');
      const index = rooms.findIndex((room: any) => room.roomid === id || room.id === id);
      if (index !== -1) {
        rooms[index] = { ...rooms[index], ...roomData };
        saveLocalData('mockapi_rooms', rooms);
        return rooms[index];
      }
      throw new Error('Room not found');
    }
  },

  // Delete room
  delete: async (id: string) => {
    if (USE_LOCAL_STORAGE) {
      const rooms = getLocalData('mockapi_rooms');
      const filteredRooms = rooms.filter((room: any) => room.roomid !== id && room.id !== id);
      saveLocalData('mockapi_rooms', filteredRooms);
      return { success: true };
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/room/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete room');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const rooms = getLocalData('mockapi_rooms');
      const filteredRooms = rooms.filter((room: any) => room.roomid !== id && room.id !== id);
      saveLocalData('mockapi_rooms', filteredRooms);
      return { success: true };
    }
  },
};

// Booking API functions
export const bookingAPI = {
  // Get all bookings
  getAll: async () => {
    if (USE_LOCAL_STORAGE) {
      return getLocalData('mockapi_bookings');
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/booking`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      return getLocalData('mockapi_bookings');
    }
  },

  // Get booking by ID
  getById: async (id: string) => {
    if (USE_LOCAL_STORAGE) {
      const bookings = getLocalData('mockapi_bookings');
      return bookings.find((booking: any) => booking.bookingid === id || booking.id === id);
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/booking/${id}`);
      if (!response.ok) throw new Error('Failed to fetch booking');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const bookings = getLocalData('mockapi_bookings');
      return bookings.find((booking: any) => booking.bookingid === id || booking.id === id);
    }
  },

  // Create new booking
  create: async (bookingData: any) => {
    if (USE_LOCAL_STORAGE) {
      const bookings = getLocalData('mockapi_bookings');
      const newBooking = { ...bookingData, bookingid: Date.now().toString(), id: Date.now().toString() };
      bookings.push(newBooking);
      saveLocalData('mockapi_bookings', bookings);
      return newBooking;
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const bookings = getLocalData('mockapi_bookings');
      const newBooking = { ...bookingData, bookingid: Date.now().toString(), id: Date.now().toString() };
      bookings.push(newBooking);
      saveLocalData('mockapi_bookings', bookings);
      return newBooking;
    }
  },

  // Update booking
  update: async (id: string, bookingData: any) => {
    if (USE_LOCAL_STORAGE) {
      const bookings = getLocalData('mockapi_bookings');
      const index = bookings.findIndex((booking: any) => booking.bookingid === id || booking.id === id);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...bookingData };
        saveLocalData('mockapi_bookings', bookings);
        return bookings[index];
      }
      throw new Error('Booking not found');
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/booking/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const bookings = getLocalData('mockapi_bookings');
      const index = bookings.findIndex((booking: any) => booking.bookingid === id || booking.id === id);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...bookingData };
        saveLocalData('mockapi_bookings', bookings);
        return bookings[index];
      }
      throw new Error('Booking not found');
    }
  },

  // Delete booking
  delete: async (id: string) => {
    if (USE_LOCAL_STORAGE) {
      const bookings = getLocalData('mockapi_bookings');
      const filteredBookings = bookings.filter((booking: any) => booking.bookingid !== id && booking.id !== id);
      saveLocalData('mockapi_bookings', filteredBookings);
      return { success: true };
    }
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/booking/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete booking');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const bookings = getLocalData('mockapi_bookings');
      const filteredBookings = bookings.filter((booking: any) => booking.bookingid !== id && booking.id !== id);
      saveLocalData('mockapi_bookings', filteredBookings);
      return { success: true };
    }
  },
};

// Customer API functions
export const customerAPI = {
  // Get all customers
  getAll: async () => {
    if (USE_LOCAL_STORAGE) {
      return getLocalData('mockapi_customers');
    }
    try {
      const response = await fetch(`${CUSTOMER_API_BASE_URL}/customer`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      return getLocalData('mockapi_customers');
    }
  },

  // Get customer by ID
  getById: async (id: string) => {
    if (USE_LOCAL_STORAGE) {
      const customers = getLocalData('mockapi_customers');
      return customers.find((customer: any) => customer.id === id);
    }
    try {
      const response = await fetch(`${CUSTOMER_API_BASE_URL}/customer/${id}`);
      if (!response.ok) throw new Error('Failed to fetch customer');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const customers = getLocalData('mockapi_customers');
      return customers.find((customer: any) => customer.id === id);
    }
  },

  // Create new customer
  create: async (customerData: any) => {
    if (USE_LOCAL_STORAGE) {
      const customers = getLocalData('mockapi_customers');
      const newCustomer = { ...customerData, id: Date.now().toString() };
      customers.push(newCustomer);
      saveLocalData('mockapi_customers', customers);
      return newCustomer;
    }
    try {
      const response = await fetch(`${CUSTOMER_API_BASE_URL}/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) throw new Error('Failed to create customer');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const customers = getLocalData('mockapi_customers');
      const newCustomer = { ...customerData, id: Date.now().toString() };
      customers.push(newCustomer);
      saveLocalData('mockapi_customers', customers);
      return newCustomer;
    }
  },

  // Update customer
  update: async (id: string, customerData: any) => {
    if (USE_LOCAL_STORAGE) {
      const customers = getLocalData('mockapi_customers');
      const index = customers.findIndex((customer: any) => customer.id === id);
      if (index !== -1) {
        customers[index] = { ...customers[index], ...customerData };
        saveLocalData('mockapi_customers', customers);
        return customers[index];
      }
      throw new Error('Customer not found');
    }
    try {
      const response = await fetch(`${CUSTOMER_API_BASE_URL}/customer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) throw new Error('Failed to update customer');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const customers = getLocalData('mockapi_customers');
      const index = customers.findIndex((customer: any) => customer.id === id);
      if (index !== -1) {
        customers[index] = { ...customers[index], ...customerData };
        saveLocalData('mockapi_customers', customers);
        return customers[index];
      }
      throw new Error('Customer not found');
    }
  },

  // Delete customer
  delete: async (id: string) => {
    if (USE_LOCAL_STORAGE) {
      const customers = getLocalData('mockapi_customers');
      const filteredCustomers = customers.filter((customer: any) => customer.id !== id);
      saveLocalData('mockapi_customers', filteredCustomers);
      return { success: true };
    }
    try {
      const response = await fetch(`${CUSTOMER_API_BASE_URL}/customer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete customer');
      return response.json();
    } catch (error) {
      console.warn('MockAPI failed, using localStorage fallback:', error);
      const customers = getLocalData('mockapi_customers');
      const filteredCustomers = customers.filter((customer: any) => customer.id !== id);
      saveLocalData('mockapi_customers', filteredCustomers);
      return { success: true };
    }
  },
};