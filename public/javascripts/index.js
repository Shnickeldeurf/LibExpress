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

if(localStorage.getItem('iOrder') != null){
    order = localStorage.getItem('iOrder');
} else {
    localStorage.setItem('iOrder', 'asc');
    order = 'asc';
}
if (localStorage.getItem('iSearchby') != null){
    searchby = localStorage.getItem('iSearchby');
} else {
    localStorage.setItem('iSearchby', 'title');
    searchby = 'title';
}

function changeSearch(s) {
    searchby = s;
    localStorage.setItem('iSearchby', s);
}

function changeOrder(btn){
    let o = btn.value;
    if (o == 'asc'){
        btn.innerHTML = '<i class="bi-caret-down"></i>';
        btn.value = "desc";
        localStorage.setItem('iOrder', 'desc');
    }
    else{
        btn.innerHTML = '<i class="bi-caret-up"></i>';
        btn.value = "asc";
        localStorage.setItem('iOrder', 'asc');
    }
    order = o;
    window.location.href = `/${searchby}&${order}`;
}

function searchBooks() {
    const search = document.getElementById("search").value.trim();
  
    let searchUrl;
    if (search !== '') {
      searchUrl = `/${searchby}&${search}&${order}`;
    } else {
      searchUrl = '/';
    }
  
    window.location.href = searchUrl;
}

// Display Cover Preview
function CoverPreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("ucoverPreview").style.backgroundImage = "url(" + e.target.result + ")";
        }
        reader.readAsDataURL(input.files[0]);
    }
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