document.addEventListener("DOMContentLoaded", () => {
      const productList = document.getElementById("product-container");
      const cartItems = document.getElementById("cart-items");
      const cartTotal = document.getElementById("cart-total");
      const clearCartBtn = document.getElementById("clear-cart");
      const viewCartBtn = document.getElementById("view-cart-btn");
      const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
      const cartEmptyMessage = document.getElementById("cart-empty-message");
      const productDetails = document.getElementById("product-details");
  
      let cart = [];
      let productsCache = [];
  
      // Fetch products once and cache
      const fetchProducts = async () => {
          try {
              const response = await fetch("https://fakestoreapi.com/products");
              productsCache = await response.json();
              displayProducts(productsCache);
          } catch (error) {
              console.error("Failed to fetch products:", error);
          }
      };
  
      const displayProducts = (products) => {
          productList.innerHTML = "";
          products.forEach(product => {
              const productDiv = document.createElement("div");
              productDiv.classList.add("col-md-3", "mb-3");
              productDiv.innerHTML = `
                  <div class="card h-100 text-center">
                      <img src="${product.image}" class="card-img-top p-2" style="max-height: 150px;" alt="${product.title}">
                      <div class="card-body">
                          <h6 class="card-title text-truncate">${product.title}</h6>
                          <p class="text-muted">Price: $${product.price.toFixed(2)}</p>
                          <button class="btn btn-info btn-sm w-100 mb-1" onclick="viewDetails(${product.id})">See More</button>
                          <button class="btn btn-success btn-sm w-100" onclick="addToCart(${product.id})">Add to Cart</button>
                      </div>
                  </div>
              `;
              productList.appendChild(productDiv);
          });
      };
  
      window.viewDetails = (id) => {
          const product = productsCache.find(item => item.id === id);
          if (product) {
              productDetails.innerHTML = `
                  <div class="d-flex flex-column align-items-center">
                      <img src="${product.image}" alt="${product.title}" class="img-fluid mb-3" style="max-height: 300px;">
                      <h4>${product.title}</h4>
                      <p class="text-muted">${product.description}</p>
                      <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                  </div>
              `;
              const productModal = new bootstrap.Modal(document.getElementById("productModal"));
              productModal.show();
          }
      };
  
      window.addToCart = (id) => {
          const product = cart.find(item => item.id === id);
          if (product) {
              product.quantity++;
          } else {
              const selectedProduct = productsCache.find(item => item.id === id);
              cart.push({ ...selectedProduct, quantity: 1 });
          }
          updateCart();
      };
  
      const updateCart = () => {
          cartItems.innerHTML = ""; 
          let total = 0;
  
          if (cart.length === 0) {
              cartEmptyMessage.classList.remove("d-none"); // Show "Empty Cart" message
              cartTotal.textContent = "0.00"; // Set total to 0
              return; // Exit the function early
          }
  
          cartEmptyMessage.classList.add("d-none"); // Hide "Empty Cart" message
  
          cart.forEach(item => {
              const cartItem = document.createElement("div");
              cartItem.classList.add("mb-2");
              cartItem.innerHTML = `
                  <div class="d-flex justify-content-between align-items-center">
                      <div>
                          <img src="${item.image}" alt="${item.title}" class="img-fluid mr-2" style="max-height: 50px;">
                          <span>${item.title}</span>
                      </div>
                      <div>
                          <input type="number" min="1" value="${item.quantity}" class="form-control form-control-sm w-25 me-2" onchange="updateQuantity(${item.id}, this.value)">
                          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                      </div>
                  </div>
              `;
              cartItems.appendChild(cartItem);
              total += item.price * item.quantity;
          });
  
          cartTotal.textContent = total.toFixed(2);
      };
  
      window.updateQuantity = (id, quantity) => {
          const product = cart.find(item => item.id === id);
          if (quantity > 0) {
              product.quantity = Number(quantity);
          } else {
              alert("Quantity must be at least 1!");
          }
          updateCart();
      };
  
      window.removeFromCart = (id) => {
          cart = cart.filter(item => item.id !== id);
          updateCart();
      };
  
      clearCartBtn.addEventListener("click", () => {
          cart = [];
          updateCart();
          cartModal.hide(); // Close the modal after clearing the cart
      });
  
      viewCartBtn.addEventListener("click", () => {
          if (cart.length === 0) {
              cartModal.show(); // Show the modal even if the cart is empty
          } else {
              updateCart();
              cartModal.show();
          }
      });
  
      // Initialize
      fetchProducts();
      updateCart();
  });