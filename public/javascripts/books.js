window.onload = function () {
    getReaders();

    
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

if(localStorage.getItem('bookOrder') != null){
    order = localStorage.getItem('bookOrder');
} else {
    localStorage.setItem('bookOrder', 'asc');
    order = 'asc';
}
if (localStorage.getItem('bookSearchby') != null){
    searchby = localStorage.getItem('bookSearchby');
} else {
    localStorage.setItem('bookSearchby', 'title');
    searchby = 'title';
}

function changeSearch(s) {
    searchby = s;
    localStorage.setItem('bookSearchby', s);
}

function changeOrder(btn){
    let o = btn.value;
    if (o == 'asc'){
        btn.innerHTML = '<i class="bi-caret-down"></i>';
        btn.value = "desc";
        localStorage.setItem('bookOrder', 'desc');
    }
    else{
        btn.innerHTML = '<i class="bi-caret-up"></i>';
        btn.value = "asc";
        localStorage.setItem('bookOrder', 'asc');
    }
    order = o;
    window.location.href = `/books/${searchby}&${order}`;
}

function searchBooks() {
    const search = document.getElementById("search").value.trim();
  
    let searchUrl;
    if (search !== '') {
      searchUrl = `/books/${searchby}&${search}&${order}`;
    } else {
      searchUrl = '/books';
    }
  
    window.location.href = searchUrl;
}

// Display Cover Preview
function CoverPreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (input.id == "cover") {
                document.getElementById("coverPreview").style.backgroundImage = "url(" + e.target.result + ")";
            } else {
                document.getElementById("ucoverPreview").style.backgroundImage = "url(" + e.target.result + ")";
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Save book
function saveBook(e) {
    e.preventDefault();
    const form = document.querySelector("#book-form");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.reportValidity();
        return;
    }
    const cover = document.getElementById("cover");
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const isBorrowed = 0;

    const formData = new FormData(form);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("isBorrowed", isBorrowed);
    formData.append("cover", cover.files[0]);
    fetch("/books", {
        method: "POST",
        body: formData,
        headers: {
            "encType": "multipart/form-data"
        }
    })
        .then(res => {
            console.log(res);
            if (res.ok) {
                alert("Saved successfully!");
                form.reset();
                form.classList.remove("was-validated");
                location.reload();
            }
        });
}

//Delete book
function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")){
        return;
    }
    fetch(`/books/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert('Book deleted successfully!');
                location.reload();
            }
        });
}

// Edit book
const bookModal = new bootstrap.Modal(document.getElementById("edit-book"));
function editBook(book) {
    document.getElementById("utitle").value = book.title;
    document.getElementById("uauthor").value = book.author;
    document.getElementById("ucoverPreview").style.backgroundImage = `url(data:image/png;base64,${book.image})`;
    document.getElementById("ugenre").value = book.genre;
    document.getElementById("uid").value = book.book_id;
    document.getElementById("isBorrowed").value = book.isBorrowed;
    bookModal.show();
}

// Update book
function saveChanges(e) {
    e.preventDefault();
    const form = document.querySelector("#update-book-form");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.reportValidity();
        return;
    }

    const cover = document.getElementById("ucover");
    const title = document.getElementById("utitle").value;
    const author = document.getElementById("uauthor").value;
    const genre = document.getElementById("ugenre").value;
    const isBorrowed = document.getElementById("isBorrowed").value;

    const formData = new FormData(form);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("isBorrowed", isBorrowed);
    formData.append("cover", cover.files[0]);

    const id = document.getElementById("uid").value;

    fetch(`/books/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
            "encType": "multipart/form-data"
        }
    })
        .then(res => {
            console.log(res);
            if (res.ok) {
                alert('Book updated successfully!');
                bookModal.hide();
                form.classList.remove("was-validated");
                location.reload();
            }
        });
}

// return book
function returnBook(id) {
    if (!confirm("Are you sure you want to return this book?")) {
        return;
    }
    fetch(`/books/return/${id}`, {
        method: 'PUT'
    })
        .then(res => {
            if (res.ok) {
                alert('Book returned successfully!');
                location.reload();
            }
        });
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
}

// loan book
const loanModal = new bootstrap.Modal(document.getElementById("loanModal"));

function loanBook (book) {
    document.getElementById('Pcover').src = "data:image/png;base64," + book.image;
    document.getElementById('Ptitle').innerHTML = book.title;
    document.getElementById('Pauthor').innerHTML = book.author;
    document.getElementById('Pgenre').innerHTML = book.genre;
    document.getElementById('Pbid').value = book.book_id;
    var date = new Date();
    var rdate = new Date(date.setMonth(date.getMonth()+1));
    document.getElementById('Ldate').value = date.getFullYear().toString() + '-' + (date.getMonth()).toString().padStart(2, 0) +
    '-' + date.getDate().toString().padStart(2, 0);
    document.getElementById('Rdate').value = rdate.getFullYear().toString() + '-' + (rdate.getMonth() + 1).toString().padStart(2, 0) +
    '-' + rdate.getDate().toString().padStart(2, 0);
    loanModal.show();
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
        book_id: document.getElementById("Pbid").value,
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