// Get books and readers on page load
window.onload = function () {
    getBooks();
    getReaders();
    var date = new Date();
    var rdate = new Date(date.setMonth(date.getMonth()+1));
    document.getElementById('Ldate').value = date.getFullYear().toString() + '-' + (date.getMonth()).toString().padStart(2, 0) +
    '-' + date.getDate().toString().padStart(2, 0);
    document.getElementById('Rdate').value = rdate.getFullYear().toString() + '-' + (rdate.getMonth() + 1).toString().padStart(2, 0) +
    '-' + rdate.getDate().toString().padStart(2, 0);

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

if(localStorage.getItem('loanOrder') != null){
    order = localStorage.getItem('loanOrder');
} else {
    localStorage.setItem('loanOrder', 'asc');
    order = 'asc';
}
if (localStorage.getItem('loanSearchby') != null){
    searchby = localStorage.getItem('loanSearchby');
} else {
    localStorage.setItem('loanSearchby', 'title');
    searchby = 'title';
}

function changeSearch(s) {
    searchby = s;
    localStorage.setItem('loanSearchby', s);
}
function changeOrder(btn){
    let o = btn.value;
    if (o == 'asc'){
        btn.innerHTML = '<i class="bi-caret-down"></i>';
        btn.value = "desc";
        localStorage.setItem('loanOrder', 'desc');
    }
    else{
        btn.innerHTML = '<i class="bi-caret-up"></i>';
        btn.value = "asc";
        localStorage.setItem('loanOrder', 'asc');
    }
    order = o;
    window.location.href = `/loans/${searchby}&${order}`;
}

function searchLoans() {
    const search = document.getElementById("search").value.trim();
  
    let searchUrl;
    if (search !== '') {
      searchUrl = `/loans/${searchby}&${search}&${order}`;
    } else {
      searchUrl = '/loans';
    }
  
    window.location.href = searchUrl;
}

// Get books
const getBooks = () => {
    fetch('/loans/getbooks')
        .then(response => response.json())
        .then(data => {
            printBooks(data);
        });
}

// Print books
const printBooks = (books) => {
    let options = '';
    books.forEach(book => {
        options += `
            <option value="${book.book_id}">${book.title}</option>
        `;
    });
    document.getElementById('book').innerHTML = options;
    document.getElementById('ubook').innerHTML = options;
}

// Get readers
const getReaders = () => {
    fetch('/loans/getreaders')
        .then(response => response.json())
        .then(data => {
            printReaders(data);
        });
}

// Print readers
const printReaders = (readers) => {
    let options = '';
    readers.forEach(reader => {
        options += `
            <option value="${reader.reader_id}">${reader.FName} ${reader.LName}</option>
        `;
    });
    document.getElementById('reader').innerHTML = options;
    document.getElementById('ureader').innerHTML = options;
}

// Save a loan
function saveLoan(e) {
    e.preventDefault();
    const form = document.querySelector("#loan-form");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.reportValidity();
        return;
    }
    if (!confirm("Are you sure you want to save this loan?"))
        return;

    var formData = {
        book_id: document.getElementById("book").value,
        reader_id: document.getElementById("reader").value,
        loanDate: document.getElementById("Ldate").value,
        returnDate: document.getElementById("Rdate").value
    };
    fetch("/loans", {
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

//Delete a loan
function deleteLoan(id, bid) {
    if (!confirm("Are you sure you want to delete this loan?")) {
        return;
    }
    fetch(`/loans/${id}&${bid}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert('Loan deleted successfully!');
                location.reload();
            }
        });
}

// Edit a loan
const loanModal = new bootstrap.Modal(document.getElementById("edit-loan"));
function editLoan(loan) {
    document.getElementById("ureader").value = loan.reader_id;
    document.getElementById("ubook").innerHTML += `<option selected id="curr" value="${loan.book_id}">${loan.title}</option>`
    var date = new Date(loan.loanDate);
    var rdate = new Date(loan.returnDate);
    document.getElementById("uLdate").value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + date.getDate().toString().padStart(2, 0);
    document.getElementById("uRdate").value = rdate.getFullYear().toString() + '-' + (rdate.getMonth() + 1).toString().padStart(2, 0) +
    '-' + rdate.getDate().toString().padStart(2, 0);
    document.getElementById("uid").value = loan.loan_id;
    document.getElementById("bid").value = loan.book_id;
    loanModal.show();
}

// Update a loan
function saveChanges(e) {
    e.preventDefault();
    const form = document.querySelector("#update-loan-form");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.reportValidity();
        return;
    }

    var formData = {
        book_id: document.getElementById("ubook").value,
        reader_id: document.getElementById("ureader").value,
        loanDate: document.getElementById("uLdate").value,
        returnDate: document.getElementById("uRdate").value
    };
    const id = document.getElementById("uid").value;
    const bid = document.getElementById("bid").value;

    fetch(`/loans/${id}&${bid}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.ok) {
                alert('Loan updated successfully!');
                loanModal.hide();
                document.getElementById("curr").remove();
                form.classList.remove("was-validated");
                location.reload();
            }
        });
}