document.addEventListener("DOMContentLoaded", function () {
  // Obtenemos los elementos html que vamos necesitar, el formulario y la lista
  const userForm = document.getElementById("userForm");
  const userList = document.getElementById("userList");
  // let usersData = JSON.parse(localStorage.getItem("usersData")) || {}// Obtiene los datos de usuarios del localStorage o crea un objeto vacío si no existe
  // let idCont =0; 
  const peticion=new XMLHttpRequest();

  
  // Función para validar email
  function validateEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(email);
  }
  
    // Función para crear el nuevo item de la lista
    function addUserToList(user) {
      if (user.id) {
        const li = document.createElement('li');
        li.innerHTML=`${user.nombre} : ${user.direccion} : ${user.correo} : <button class="delete" data-id=${user.id} >Eliminar</button> 
        <button data-id=${user.id} class="edit">Editar></button> `;
        userList.appendChild(li);
      }else{
        addUserToListId(user)
      }
    }
  
    // Función para agregar un usuario a la lista
    // function addUserToList(name, address, email) {
    //   const listItem = createListItem(name, address, email);
    //   userList.appendChild(listItem);
    // }

    function addUserToListId(user) {
      peticion.open('GET', `http://localhost:3000/users?correo=${user.correo}`,true);
      peticion.send();
      peticion.addEventListener('load', function() {
      if (peticion.status===200) {
        let usuario=JSON.parse(peticion.responseText)[0];
        const listItem = document.createElement('li') ;
        li.innerHTML=`${user.nombre} : ${user.direccion} : ${user.correo} : <button class="delete" data-id=${user.id} >Eliminar</button>
        <button data-id=${user.id} class="edit">Editar></button> `;
        userList.appendChild(listItem);
        
        }
      }) 
      }


    // Función para borrar un usuario de la lista y del objeto usersData
    function deleteUser(event) {
      const peticion=new XMLHttpRequest();

      // Comprobamos que el elemento que ha disparado el evento contiene la clase delete
      if (event.target.classList.contains("delete")) {
        const listItem = event.target.parentElement; // Obtenemos el padre del botón que será el elemento li
        const idUser = event.target.dataset.id;

        // const userArray = listItem.textContent.split(" : "); // Obtenemos un array con los diferentes campos
        // const email = userArray[2];
        // delete usersData[email]; // Elimina el usuario del objeto usersData
        // localStorage.setItem("usersData", JSON.stringify(usersData)); // Actualiza el localStorage

        peticion.open('DELETE', `http://localhost:3000/users/${idUser}`);
        peticion.addEventListener('load', function() {
            console.log(user);
            userList.removeChild(listItem); // Elimina el usuario de la lista
        })
        peticion.send();


      }
    }
  
    // Función para cargar los datos de un usuario en el formulario para editar
    function editUser(event) {
      // Comprobamos que el elemento que ha disparado el evento contiene la clase edit
      if (event.target.classList.contains("edit")) {
        const listItem = event.target.parentElement; // Obtenemos el padre del botón que será el elemento li
        const [name, address, email] = listItem.textContent.split(' : '); // Obtenemos el nombre, la dirección y el email
  
        // Rellena el formulario con los datos del usuario para editar
        document.getElementById("name").value = name;
        document.getElementById("address").value = address;
        document.getElementById("email").value = email;
        userForm.dataset.editing = email; // Marca que estamos editando este usuario
        userForm.dataset.editingIndex = [...userList.children].indexOf(listItem); // Almacena el índice del elemento en la lista
        userForm.querySelector("button[type='submit']").textContent = "Editar Usuario"; // Cambia el texto del botón
      }
    }
  
    // Manejar el envío del formulario (Agregar o Editar usuario)
    userForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const email = document.getElementById("email").value;
      const peticion=new XMLHttpRequest();
      
      const user ={ nombre : name,
                    direccion : address,
                    correo : email
      }


      // Nos aseguramos de que los campos están rellenos y el email es de tipo email
      if (name && address && validateEmail(email)) {
        // Comprobamos que el email no existe
        if ( true) { //Pendiente de modificacion
          // Crea el nuevo elemento de la lista con los nuevos datos
          const listItem = addUserToList(user)
  
          // Comprobar si estamos editando un usuario
          if (userForm.dataset.editing) {
            // Recuperamos el email que estamos editando y el índice del elemento de la lista
            // const oldEmail = userForm.dataset.editing;
            const editingIndex = parseInt(userForm.dataset.editingIndex);
  
            // Reemplaza el elemento existente en el índice con el nuevo elemento
            userList.replaceChild(listItem, userList.children[editingIndex]);
            // usersData[oldEmail] = { name, address, email}; // Elimina la versión antigua del usuario del objeto usersData
            userForm.removeAttribute("data-editing"); // Quita la marca de edición
            
          }
          else {
           
          peticion.open('POST', 'http://localhost:3000/users');
          peticion.setRequestHeader('Content-type', 'application/json');  
          peticion.send(JSON.stringify(user));
          peticion.addEventListener('load', function() {
              addUserToList(user);
              console.log(user);
            })

          }
          userForm.reset(); // Limpia el formulario
          userForm.querySelector("button[type='submit']").textContent = "Agregar Usuario"; // Restaura el texto del botón
        }
        else {
          alert('El email especificado ya existe en la lista');
        }
      }
      else {
        alert('Alguno de los campos no es correcto');
      }
    });



  
    // Manejar clics en botones de borrar y editar
    userList.addEventListener("click", function (event) {
      deleteUser(event);
      editUser(event);
    });
  

    function getUsers() {
      peticion.open('GET', 'http://localhost:3000/users');
      peticion.send();
      peticion.addEventListener('load', function() {
      if (peticion.status===200) {
        let usuarios=JSON.parse(peticion.responseText);
        addUserToList(usuarios);
        
        }
      }) 
    
  }





  });
