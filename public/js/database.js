var previouslyClickedRow = null;

function reply_click(get_id) {
  const element = document.getElementById(get_id);
  element.classList.toggle('clicked');
}

function callme(get_id) {
  // Get the <tr> element
  var row = document.getElementById(get_id);
  
  // Close the sidebar if the same row is clicked twice
  if (previouslyClickedRow === row) {
    sidebar();
  } else {
    // Update the previously clicked row
    previouslyClickedRow = row;

    // Scroll the window to the top
    window.scrollTo(0, 0);

    // Get the <td> elements inside the row
    var rollno = row.querySelector('#rollno').textContent;
    var name = row.querySelector('#name').textContent;
    var fathername = row.querySelector('#name').textContent;
    var gender = row.querySelector('#gender').textContent;
    var email = row.querySelector('#email').textContent;
    var dob = row.querySelector('#dob').textContent;
    var age = row.querySelector('#age').textContent;
    var designation = row.querySelector('#designation').textContent;
    var about = row.querySelector('#about').textContent;
    var address = row.querySelector('#address').textContent;
    var grade = row.querySelector('#grade').textContent;

    // Alert the values of each field in the <td> elements
    var x = document.getElementById('studentInfo');
    document.getElementById('studentname').innerText = name;
    document.getElementById('sdesignation').innerText = designation;
    document.getElementById('sabout').innerText = about;
    document.getElementById('sage').innerText = age;
    document.getElementById('sgender').innerText = gender;
    document.getElementById('sdob').innerText = dob;
    document.getElementById('saddress').innerText = address;

    if (x.style.display === 'none') {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
}

function sidebar() {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.display === "block") {
    sidebar.style.display = "none";
  } else {
    sidebar.style.display = "block";
  }
}

function notificationBar() {
  var sidebar = document.getElementById("notificationBar");
  if (sidebar.style.display === "block") {
    sidebar.style.display = "none";
  } else {
    sidebar.style.display = "block";
  }
}
