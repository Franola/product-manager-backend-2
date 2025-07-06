const addToCart = document.querySelectorAll('.button-addCart');
const linkCart = document.getElementById('linkCart');
const cartId = localStorage.getItem('cartId');
if (cartId) {
    linkCart.href = `/view/carts/${cartId}`;
    linkCart.hidden = false;
}

addToCart.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = e.target.id;
        console.log('Producto id: ', productId);

        const cartId = localStorage.getItem('cartId');

        if (!cartId) {
            fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Carrito creado:', data);

                localStorage.setItem('cartId', data._id);
                linkCart.href = `/view/carts/${data._id}`;
                linkCart.hidden = false;

                return fetch(`/api/carts/${data._id}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Producto agregado al carrito:', data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado',
                        text: 'El producto ha sido agregado al carrito exitosamente.',
                    });
                })
                .catch(error => {
                    console.error('Error al agregar el producto al carrito:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo agregar el producto al carrito.',
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo crear el carrito.',
                });
            });
        }
        else{
            linkCart.href = `/view/carts/${cartId}`;
            linkCart.hidden = false;
            console.log('Carrito existente:', cartId);

            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Producto agregado al carrito:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto agregado',
                    text: 'El producto ha sido agregado al carrito exitosamente.',
                });
            })
            .catch(error => {
                console.error('Error:', error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo agregar el producto al carrito.',
                });
            });
        }
    });
});

document.getElementById('logoutButton').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        console.log('Cerrando sesión...');
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log(result.message);
        alert(result.message);
        window.location.href = '/view/login';
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Error al cerrar sesión. Por favor, inténtelo de nuevo.');
    }
});

