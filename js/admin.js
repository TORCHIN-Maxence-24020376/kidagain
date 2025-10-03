const STORAGE_KEY = "kidagain_products";

const form = document.querySelector(".admin-actions form");
const fileInput = document.querySelector("#file");
const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const stockInput = document.querySelector("#stock");
const statusSelect = document.querySelector("#status");
const grid = document.querySelector(".products-grid");
const saveBtn = document.querySelector("main > div .submit-btn");

function toNumber(v, isFloat) {
    const n = isFloat ? parseFloat(v) : parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
}

function getProductsFromDOM() {
    const cards = Array.from(grid.querySelectorAll(".product-card"));
    return cards.map(card => {
        const name = card.querySelector(".product-name")?.textContent?.trim() || "";
        const imgSrc = card.querySelector("img.product-img")?.getAttribute("src") || "";
        const price = toNumber(card.querySelector('input[type="number"][step]')?.value || "0", true);
        const inputs = card.querySelectorAll('input[type="number"]');
        const stock = toNumber(inputs.length > 1 ? inputs[1].value : "0", false);
        const status = card.querySelector("select")?.value || "bon";
        return { name, price, stock, status, imgSrc };
    });
}

function loadProducts() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const arr = JSON.parse(saved);
            if (Array.isArray(arr)) return arr;
        } catch (_) {}
    }
    return getProductsFromDOM();
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function showToast(text, ok) {
    let el = document.getElementById("flash");
    if (!el) {
        el = document.createElement("div");
        el.id = "flash";
        document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.position = "fixed";
    el.style.top = "16px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.padding = "10px 16px";
    el.style.borderRadius = "12px";
    el.style.boxShadow = "0 4px 10px rgba(0,0,0,.15)";
    el.style.background = ok ? "#e6ffed" : "#ffe6e6";
    el.style.color = ok ? "#046b2c" : "#8a1f1f";
    el.style.fontWeight = "600";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none";
    el.style.transition = "opacity .25s ease";
    el.style.opacity = "1";
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = "0"; }, 1600);
}

function createCard(p, index) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <div class="product-image">
            <img loading="lazy" src="${p.imgSrc}" alt="${p.name}" class="product-img">
        </div>
        <div class="product-info">
            <h3 class="product-name">${p.name}</h3>
            <label>Prix (€): <input type="number" step="0.01" value="${p.price.toFixed(2)}"></label>
            <label>Stock: <input type="number" value="${p.stock}"></label>
            <label>État:
                <select>
                    <option value="neuf"${p.status==="neuf"?" selected":""}>Neuf</option>
                    <option value="tres-bon"${p.status==="tres-bon"?" selected":""}>Très bon état</option>
                    <option value="bon"${p.status==="bon"?" selected":""}>Bon état</option>
                    <option value="moyen"${p.status==="moyen"?" selected":""}>État moyen</option>
                </select>
            </label>
            <button type="button" class="remove-item">Retirer</button>
        </div>
    `;
    const priceEl = card.querySelector('input[step]');
    const stockEl = card.querySelectorAll('input[type="number"]')[1];
    const statusEl = card.querySelector('select');
    const removeBtn = card.querySelector('.remove-item');
    priceEl.addEventListener("input", () => {
        products[index].price = toNumber(priceEl.value, true);
    });
    stockEl.addEventListener("input", () => {
        products[index].stock = toNumber(stockEl.value, false);
    });
    statusEl.addEventListener("change", () => {
        products[index].status = statusEl.value;
    });
    removeBtn.addEventListener("click", () => {
        if (window.confirm(`Supprimer « ${products[index].name} » ?`)) {
            products.splice(index, 1);
            render(products);
            showToast("Article retiré", true);
        }
    });
    return card;
}

function render(products) {
    grid.innerHTML = "";
    products.forEach((p, i) => {
        grid.appendChild(createCard(p, i));
    });
}

let products = loadProducts();
render(products);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const price = toNumber(priceInput.value, true);
    const stock = toNumber(stockInput.value, false);
    const status = statusSelect.value || "bon";
    const file = fileInput.files && fileInput.files[0];

    function addProduct(imgSrc) {
        const p = { name, price, stock, status, imgSrc: imgSrc || "img/products/placeholder.webp" };
        products.push(p);
        render(products);
        form.reset();
        showToast("Article ajouté avec succès", true);
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = () => addProduct(reader.result);
        reader.readAsDataURL(file);
    } else {
        addProduct("");
    }
});

saveBtn.addEventListener("click", () => {
    products = getProductsFromDOM().map((p, i) => {
        const base = products[i] || p;
        return { ...base, ...p };
    });
    saveProducts(products);
    showToast("Inventaire sauvegardé", true);
});
