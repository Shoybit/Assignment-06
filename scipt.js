

const treeContainer = document.getElementById("tree-container");
const categoryList = document.getElementById("category-list");


const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => {
      const categories = [{ category_name: "All Trees", id: "all" }, ...(data.categories || [])];
      displayCategories(categories);
    })
    .catch(err => console.error(err));
};

const displayCategories = (categories) => {
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.id = cat.id;
    li.className = "category-btn w-full text-left px-3 py-2 rounded hover:bg-green-600 hover:text-white cursor-pointer";
    li.innerText = cat.category_name;
    categoryList.appendChild(li);
  });

  categoryList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      document.querySelectorAll(".category-btn").forEach(li => {
        li.classList.remove("bg-green-600", "text-white");
      });
      e.target.classList.add("bg-green-600", "text-white");
      loadTrees(e.target.id);
    }
  });
};


const loadTrees = (id) => {
  showSpinner(true);
  let url = id === "all"
    ? "https://openapi.programming-hero.com/api/plants"
    : `https://openapi.programming-hero.com/api/category/${id}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayTrees(data.plants);
      showSpinner(false);
    })
    .catch(err => {
      console.error(err);
      treeContainer.innerHTML = "";
      showSpinner(false);
    });
};


const displayTrees = (plants) => {
  treeContainer.innerHTML = "";
  plants.forEach(tre => {
    treeContainer.innerHTML += `
      <div class="bg-gray-50 p-3 rounded-lg shadow flex flex-col h-full">
        <div class="h-[180px] w-full bg-gray-200 rounded overflow-hidden mb-2">
          <img src="${tre.image}" alt="${tre.name}" class="w-full h-full object-cover"/>
        </div>
        <h3 class="font-semibold text-base mb-4 cursor-pointer" onclick="openModal('${tre.id}')">${tre.name}</h3>
        <p class="text-xs text-gray-500 mb-4 line-clamp-2">${tre.description || "No description available."}</p>
        <div class="flex justify-between items-center mb-4">
          <p class="text-[#15803d] bg-[#dcfce7] rounded-full px-2 py-0.5 text-xs">${tre.category}</p>
          <p class="text-[#1f2937] font-semibold text-sm mb-4">৳${tre.price}</p>
        </div>
        <button onclick='addToCart({name: "${tre.name}", price: ${tre.price}})' class="mt-auto w-full bg-green-600 text-white py-1.5 text-sm rounded-full hover:bg-green-700 transition-colors">
          Add to Cart
        </button>
      </div>
    `;
  });
};

const showSpinner = (show) => {
  if (!document.getElementById("spinner")) {
    const spinnerDiv = document.createElement("div");
    spinnerDiv.id = "spinner";
    spinnerDiv.className = "col-span-8 flex justify-center items-center py-10";
    spinnerDiv.innerHTML = `<span class="loading loading-dots loading-xl"></span>`;
    treeContainer.parentNode.insertBefore(spinnerDiv, treeContainer);
  }
  document.getElementById("spinner").style.display = show ? "flex" : "none";
  treeContainer.style.display = show ? "none" : "grid";
};

const cartTotal = document.getElementById("cart-total");
const cartItemsContainer = document.getElementById("cart-items");


let cart = [];
let total = 0;

const addToCart = (item) => {
  cart.push(item);
  total += item.price;
  renderCart();
  alert(`${item.name} has been added to the cart`);
};

const removeFromCart = (index) => {
  total -= cart[index].price;
  cart.splice(index, 1);
  renderCart();
};

const renderCart = () => {
  cartItemsContainer.innerHTML = "";
  cart.forEach((item, index) => {
    cartItemsContainer.innerHTML += `
      <li class="bg-[#f0fdf4] p-3 rounded">
        <div class="flex justify-between items-center">
          <span>${item.name}</span>
          <button onclick="removeFromCart(${index})" class="text-red-500 font-bold mt-1">X</button>
        </div>
        <span class="text-[#889396]">৳${item.price} X 1</span>
      </li>
    `;
  });
  cartTotal.innerText = `৳${total}`;
};



loadCategories();
loadTrees("all");
