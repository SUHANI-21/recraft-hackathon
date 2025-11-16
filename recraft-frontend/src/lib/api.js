// This is the base URL of your running backend server
const API_URL = 'http://localhost:5001';

/**
 * A helper function to handle API responses consistently.
 * It checks if the response was successful, and if not, throws an error with the backend's message.
 * @param {Response} response The raw response from the fetch call.
 * @returns {Promise<any>} The JSON data from the response.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * A helper function to safely get the auth token from localStorage.
 * @returns {string|null} The auth token or null if not found.
 */
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('recraft_user'));
    return user ? user.token : null;
  } catch (e) {
    console.error("Could not parse user from localStorage", e);
    return null;
  }
};

// === USER AUTHENTICATION & PROFILES ===
export const register = (userData) => fetch(`${API_URL}/api/users`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData),
}).then(handleResponse);

export const login = (loginData) => fetch(`${API_URL}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData),
}).then(handleResponse);

export const updateUserProfile = (profileData) => {
  const token = getToken();
  return fetch(`${API_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  }).then(handleResponse);
};

// === ARTISANS (Public Data) ===
// Note: These routes need to be built in the backend
export const fetchArtisans = () => fetch(`${API_URL}/api/users/artisans`).then(handleResponse);
export const fetchArtisanById = (id) => fetch(`${API_URL}/api/users/${id}`).then(handleResponse);

// === PRODUCTS ===
export const fetchProducts = () => fetch(`${API_URL}/api/products`).then(handleResponse);
export const fetchProductById = (id) => fetch(`${API_URL}/api/products/${id}`).then(handleResponse);

export const fetchMyProducts = () => {
  const token = getToken();
  return fetch(`${API_URL}/api/products/myproducts`, {
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(handleResponse);
};

export const fetchMyProductById = (id) => {
  const token = getToken();
  return fetch(`${API_URL}/api/products/myproducts/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(handleResponse);
};

export const createProduct = (productData) => {
  const token = getToken();
  const dataToSend = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        tags: productData.tags,
        photos: [productData.photos], // Create a simple array: ['the-url-string']
      };
         console.log('--- FRONTEND: Data being sent to backend ---', JSON.stringify(dataToSend, null, 2));
      
  return fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dataToSend),
  }).then(handleResponse);
};

// ... (other API functions)

export const updateProduct = (id, productData) => {
  const token = getToken();
  return fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  }).then(handleResponse);
};

// ...

export const deleteProduct = (id) => {
  const token = getToken();
  return fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(handleResponse);
};

// === INSPIRATION POSTS ===






// ... (all other functions in api.js)

// === INSPIRATION POSTS ===
export const fetchPosts = () => fetch(`${API_URL}/api/posts`).then(handleResponse);
export const fetchPostById = (id) => fetch(`${API_URL}/api/posts/${id}`).then(handleResponse);

// --- ADD THIS NEW FUNCTION ---
export const fetchMyPosts = () => {
  const token = getToken();
  return fetch(`${API_URL}/api/posts/myposts`, {
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(handleResponse);
};
// --- END OF NEW FUNCTION ---




export const createPost = (postData) => {
  const token = getToken();
  return fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  }).then(handleResponse);
};

export const updatePost = (id, postData) => {
  const token = getToken();
  return fetch(`${API_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  }).then(handleResponse);
};

export const deletePost = (id) => {
  const token = getToken();
  return fetch(`${API_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(handleResponse);
};

// === ORDERS ===
export const createOrder = (orderData) => {
  const token = getToken();
  return fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  }).then(handleResponse);
};

export const fetchMyOrders = () => {
  const token = getToken();
  return fetch(`${API_URL}/api/orders/myorders`, {
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(handleResponse);
};