function assignEditEvents() {
    for (let el of document.getElementsByClassName('edit_button')) {
      el.addEventListener('click', (e) => {
        console.log(e.target.id);
        alert(`element with id ${e.target.id} clicked`);
        e.preventDefault();
      });
    }
  
  }
  
  async function createUser() {
    let user =  {
      first_name: document.getElementById('first_name').value,
      last_name: document.getElementById('last_name').value,
      cedula: document.getElementById('cedula').value,
      birthday: document.getElementById('birthday').value,
      email: document.getElementById('email').value,
      password : document.getElementById('password').value,
      phone_number : document.getElementById('phone').value

    }
  
    const response = await fetch("http://localhost:3001/api/user",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic x'
      },
      body: JSON.stringify(user)
    });
  
    debugger;
    if(response && response.status == 201){
      user = await response.json();
      console.log('User saved', user);
      alert('Usuario guardado');
    } else {
      alert("Shit's on fire! ");
    }
  
  
  }