window.onload = function () {
    if (order == 'asc'){
        document.getElementById('order').innerHTML = '<i class="bi-caret-up"></i>';
        document.getElementById('order').value = "asc";
    } else {
        document.getElementById('order').innerHTML = '<i class="bi-caret-down"></i>';
        document.getElementById('order').value = "desc";
    }
}

let searchby;
let order;

if(localStorage.getItem('readerOrder') != null){
    order = localStorage.getItem('readerOrder');
} else {
    localStorage.setItem('readerOrder', 'asc');
    order = 'asc';
}
if (localStorage.getItem('readerSearchby') != null){
    searchby = localStorage.getItem('readerSearchby');
} else {
    localStorage.setItem('readerSearchby', 'name');
    searchby = 'name';
}

function changeSearch(s) {
    searchby = s;
    localStorage.setItem('readerSearchby', s);
}

function changeOrder(btn){
    let o = btn.value;
    if (o == 'asc'){
        btn.innerHTML = '<i class="bi-caret-down"></i>';
        btn.value = "desc";
        localStorage.setItem('readerOrder', 'desc');
    }
    else{
        btn.innerHTML = '<i class="bi-caret-up"></i>';
        btn.value = "asc";
        localStorage.setItem('readerOrder', 'asc');
    }
    order = o;
    window.location.href = `/readers/${searchby}&${order}`;
}

function searchReaders() {
    const search = document.getElementById("search").value.trim();
  
    let searchUrl;
    if (search !== '') {
      searchUrl = `/readers/${searchby}&${search}`;
    } else {
      searchUrl = '/readers';
    }
  
    window.location.href = searchUrl;
}


// Save reader
function saveReader(e) {
    e.preventDefault();
    const form = document.querySelector("#reader-form");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.reportValidity();
        return;
    }
    var formData = {
        FName: document.getElementById("Fname").value,
        LName: document.getElementById("Lname").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value
    };
    fetch("/readers", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.ok) {
                alert("Saved successfully!");
                form.reset();
                form.classList.remove("was-validated");
                location.reload();
            }
        });
}

//Delete reader
function deleteReader(id) {
    if (!confirm("Are you sure you want to delete this reader?")){
        return;
    }
    fetch(`/readers/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            console.log(res);
            if (res.ok) {
                alert('Reader deleted successfully!');
                location.reload();
            }
        });
}

// Edit reader
const readerModal = new bootstrap.Modal(document.getElementById("edit-reader"));
function editReader(reader) {
    document.getElementById("uFname").value = reader.FName;
    document.getElementById("uLname").value = reader.LName;
    document.getElementById("uaddress").value = reader.address;
    document.getElementById("uphone").value = reader.phone;
    document.getElementById("uid").value = reader.reader_id;
    readerModal.show();
}

// Update reader
function saveChanges(e) {
    e.preventDefault();
    const form = document.querySelector("#update-reader-form");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.reportValidity();
        return;
    }
    var formData = {
        FName: document.getElementById("uFname").value,
        LName: document.getElementById("uLname").value,
        address: document.getElementById("uaddress").value,
        phone: document.getElementById("uphone").value
    };
    const id = document.getElementById("uid").value;

    fetch(`/readers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            console.log(res);
            if (res.ok) {
                alert('Reader updated successfully!');
                readerModal.hide();
                form.classList.remove("was-validated");
                location.reload();
            }
        });
}