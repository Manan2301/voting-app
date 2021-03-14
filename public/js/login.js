const form1 = document.getElementById('login-form');

form1.addEventListener('submit', e => {
    e.preventDefault();
    console.log("hellovhj")
    const username = document.querySelector('input[name=name]').value;//candidate defined in pusher trigger
    const password = document.querySelector('input[name=password]').value;
    const email= document.querySelector('input[name=email]').value;
    //const gender = document.querySelector('input[name=gender]').value;
    console.log(username, password)
    //console.log("choice",choice)//choice is say Candidate4(basically the name)
    const data = { email:email ,name: username, password: password};//recreating the object format
    console.log("datainitial",data)
    
    fetch('http://localhost:3000/user/users/render', {
            method: 'get',
            credentials:'same-origin',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Origin':'http://localhost:3000/',
                
            })
    }).then (res => res.json())
    .then(data =>{
        console.log(data)    
    })
    .catch(err => console.log(err))
        
    // fetch('http://localhost:3000/user/users/login', {
    //     method: 'post', //after collecting vote response,send a post request to update our database
    //     body: JSON.stringify(data), 
    //     headers: new Headers({
    //         'Content-Type': 'application/json'
    //     })

    // })//returns a promise
    //     .then (res => res.json())
    //     .then(data =>{
    //         console.log(data)           
    // }) 
    //     .catch(err => console.log(err))
    //     //.then(res => res.render('index.hbs'))

    // e.preventDefault();
    
});
