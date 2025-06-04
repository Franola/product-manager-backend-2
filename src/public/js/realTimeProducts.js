const socket = io();

const productList = document.getElementById("productList");
console.log(productList.innerHTML);
if (productList.innerHTML.trim() === "") {
    fetch('/api/products?limit=99999')
        .then(response => response.json())
        .then(products => {
            products.payload.forEach(data => {
                agregarProducto(data);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const codeInput = document.getElementById("code");
const priceInput = document.getElementById("price");
const statusInput = document.getElementById("status");
const stockInput = document.getElementById("stock");
const categoryInput = document.getElementById("category");
const addProduct = document.getElementById("addProduct");

addProduct.addEventListener("click", (e) => {
    e.preventDefault();
    
    if(!titleInput.value || !descriptionInput.value || !codeInput.value || !priceInput.value || !stockInput.value || !categoryInput.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const newProduct = {
        title: titleInput.value,
        description: descriptionInput.value,
        code: codeInput.value,
        price: priceInput.value,
        status: statusInput.checked,
        stock: stockInput.value,
        category: categoryInput.value,
        thumbnails: [],
    };
    console.log(newProduct);
    socket.emit("addProduct", newProduct);

    titleInput.value = "";
    descriptionInput.value = "";
    codeInput.value = "";
    priceInput.value = "";
    statusInput.checked = false;
    stockInput.value = "";
    categoryInput.value = "";
});



socket.on("productAdded", (data) => {
    agregarProducto(data);
});

socket.on("productDeleted", (data) => {
    const productItem = document.getElementById("product-"+data._id.toString());
    if (productItem) {
        productItem.remove();
    }
});


function agregarProducto(product){
    const newProductItem = document.createElement("div");
    newProductItem.classList.add("product-item");
    newProductItem.id = `product-${product._id.toString()}`;
    newProductItem.innerHTML = `<h3>${product.code} - ${product.title}</h3>
        <ul>
            <li>${product.description}</li>
            <li>Precio: $${product.price}</li>
            <li>Stock: ${product.stock}</li>
        </ul>
        <button class="delete-product" id="delete-${product._id.toString()}">Eliminar</button>`;
    productList.appendChild(newProductItem);

    const deleteButton = newProductItem.querySelector(".delete-product");
    deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.id.split("-")[1];
        socket.emit("deleteProduct", { id: productId });
        console.log(productId);
    });
}