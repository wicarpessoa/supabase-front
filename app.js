const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');
const modal = document.querySelector('#update-modal');
const closeModalButton = modal.querySelector('.close');

async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();
  console.log(products)
  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price}`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    addUpdateButtonEventListener(updateButton, product);
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}



addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});


async function addProduct(name, price, description) {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

async function updateProduct(id, name, price, description) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Erro ao atualizar produto:', error);
  }

  return response.json();
}

async function deleteProduct(id) {
  const response = await fetch('http://localhost:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },

  });
  return response.json();
}

function openUpdateModal(product) {
  modal.style.display = 'block';
  updateProductId.value = product.id;
  updateProductName.value = product.name;
  updateProductPrice.value = product.price;
  updateProductDescription.value = product.description
}

closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
});


window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
function closeModal() {
  modal.style.display = 'none';
  updateProductForm.reset();
}

updateProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  const description = updateProductDescription.value
  await updateProduct(id, name, price, description);

  closeModal()
  await fetchProducts();
});


function addUpdateButtonEventListener(button, product) {
  button.addEventListener('click', () => {
    openUpdateModal(product);
  });
}


fetchProducts();
