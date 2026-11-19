const cart = [
  { name: "Notebook", price: 120, qty: 1, detail: "Lined · 160 pages", artwork: "▤", style: "art-notebook" },
  { name: "Pen pack", price: 60, qty: 1, detail: "Fine tip · Set of 5", artwork: "✎", style: "art-pens" },
  { name: "Water bottle", price: 360, qty: 1, detail: "Reusable · 750 ml", artwork: "♧", style: "art-bottle" }
];

const discountThreshold = 1000;
const discountRate = 0.10;
const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function formatRupees(amount) {
  return `Rs. ${currency.format(amount)}`;
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const emptyState = document.getElementById("empty-state");
  const cartFootnote = document.getElementById("cart-footnote");
  const checkoutButton = document.getElementById("checkout-button");
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);

  document.getElementById("item-count").textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  emptyState.hidden = cart.length > 0;
  cartFootnote.hidden = cart.length === 0;
  checkoutButton.disabled = cart.length === 0;

  let subtotal = 0;
  let rows = "";

  for (let index = 0; index < cart.length; index += 1) {
    const item = cart[index];
    const rowTotal = item.price * item.qty;
    subtotal += rowTotal;

    rows += `
      <tr>
        <td>
          <div class="product-cell">
            <span class="product-art ${item.style}" aria-hidden="true">${item.artwork}</span>
            <span><span class="product-name">${item.name}</span><span class="product-detail">${item.detail}</span></span>
          </div>
        </td>
        <td class="unit-price">${formatRupees(item.price)}</td>
        <td>
          <div class="quantity-control" aria-label="Quantity for ${item.name}">
            <button type="button" onclick="changeQuantity(${index}, -1)" aria-label="Decrease ${item.name} quantity" ${item.qty === 1 ? "disabled" : ""}>−</button>
            <span class="quantity-value" aria-live="polite">${item.qty}</span>
            <button type="button" onclick="changeQuantity(${index}, 1)" aria-label="Increase ${item.name} quantity">+</button>
          </div>
        </td>
        <td class="row-total">${formatRupees(rowTotal)}</td>
        <td><button class="remove-button" type="button" onclick="removeItem(${index})" aria-label="Remove ${item.name}">Remove</button></td>
      </tr>`;
  }

  cartItems.innerHTML = rows;

  const hasDiscount = subtotal >= discountThreshold;
  const discount = hasDiscount ? Math.round(subtotal * discountRate) : 0;
  const total = subtotal - discount;
  const discountLine = document.getElementById("discount-line");
  const discountNote = document.getElementById("discount-note");

  document.getElementById("subtotal").textContent = formatRupees(subtotal);
  document.getElementById("discount").textContent = `- ${formatRupees(discount)}`;
  document.getElementById("total").textContent = formatRupees(total);
  discountLine.hidden = !hasDiscount;
  discountNote.hidden = hasDiscount || cart.length === 0;

  if (!hasDiscount && cart.length > 0) {
    document.getElementById("amount-to-discount").textContent = formatRupees(discountThreshold - subtotal);
  }
}

function changeQuantity(index, amount) {
  if (cart[index] && cart[index].qty + amount >= 1) {
    cart[index].qty += amount;
    renderCart();
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

renderCart();