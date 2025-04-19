let cart = [];

function addToCart(canteenSlug, itemId, itemName, itemPrice) {
  const existingItem = cart.find(
    (item) => item.id === itemId && item.canteen === canteenSlug
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      canteen: canteenSlug,
      id: itemId,
      name: itemName,
      price: itemPrice,
      quantity: 1,
    });
  }

  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItemsElement = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  let total = 0;

  cartItemsElement.innerHTML = ""; // Clear previous cart display

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} x ${item.quantity} - ₹${
      item.price * item.quantity
    }`;
    cartItemsElement.appendChild(listItem);
    total += item.price * item.quantity;
  });

  cartTotalElement.textContent = `Total: ₹${total}`;
}

function placeOrder(canteenSlug) {
  if (cart.length > 0) {
    const orderItems = cart
      .filter((item) => item.canteen === canteenSlug)
      .map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

    if (orderItems.length > 0) {
      fetch(`/api/order/${canteenSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: orderItems }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Order successful:", data);
          cart = cart.filter((item) => item.canteen !== canteenSlug); // Clear cart for this canteen
          updateCartDisplay();
          alert(data.message || "Order placed successfully!");
        })
        .catch((error) => {
          console.error("Error placing order:", error);
          alert("Error placing order.");
        });
    } else {
      alert("Your cart is empty for this canteen.");
    }
  } else {
    alert("Your cart is empty.");
  }
}

// Initial cart load from local storage (optional)
// document.addEventListener('DOMContentLoaded', () => {
//     const storedCart = localStorage.getItem('cart');
//     if (storedCart) {
//         cart = JSON.parse(storedCart);
//         updateCartDisplay();
//     }
// });

// Save cart to local storage on unload (optional)
// window.addEventListener('beforeunload', () => {
//     localStorage.setItem('cart', JSON.stringify(cart));
// });
