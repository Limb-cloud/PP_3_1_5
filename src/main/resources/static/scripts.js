"use strict";

const url = "http://localhost:8080/admin";

async function getAdminPage() {
  let page = await fetch(url + '/users');
  if (page.ok) {
    let listAllUser = await page.json();
    loadTableData(listAllUser);
  } else {
    alert(`Error, ${page.status}`)
  }
}

const pills = document.querySelectorAll('.pill');
const pillsContent = document.querySelectorAll('.pillContent');
pills.forEach((clickedPill) => {
  clickedPill.addEventListener('click', async () => {
    pills.forEach((pill) => {
      pill.classList.remove('active');
    });
    clickedPill.classList.add('active');
    let tabId = clickedPill.getAttribute('id');
    await activePillContent(tabId);
  });
});

async function activePillContent(tabId) {
  pillsContent.forEach((clickedPillContent) => {
    clickedPillContent.classList.contains(tabId) ?
        clickedPillContent.classList.add('active') :
        clickedPillContent.classList.remove('active');
  })
}

async function getMyUser() {
  let res = await fetch('/user/auth');
  let resUser = await res.json();
  userNavbarDetails(resUser);
}

window.addEventListener('DOMContentLoaded', getMyUser);

function userNavbarDetails(resUser) {
  let userList = document.getElementById('myUserDetails');
  let roles = ''
  for (let role of resUser.roles) {
    roles += role.name + ' '
  }
  userList.insertAdjacentHTML('beforeend', `
        <b> ${resUser.username} </b> with roles: <a>${roles} </a>`);
}

function loadTableData(listAllUser) {
  let tableBody = document.getElementById('tbodyAdmin');
  let dataHtml = '';
  for (let user of listAllUser) {
    let roles = '';
    for (let role of user.roles) {
      roles += role.name + "<br>";
    }
    dataHtml +=
        `<tr>
    <td>${user.id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>${user.age}</td>
    <td>${user.username}</td>
    <td>${roles}</td>
    <td>
        <button class="btn btn-primary" data-bs-toogle="modal"
        data-bs-target="#editModal" id="${user.id}"
        onclick="editModalData(${user.id})">Edit</button>
    </td>
        <td>
        <button class="btn btn-danger" data-bs-toogle="modal"
        data-bs-target="#deleteModal" id="${user.id}"
        onclick="deleteModalData(${user.id})">Delete</button>
    </td>
</tr>`
  }
  tableBody.innerHTML = dataHtml;
}

getAdminPage();
window.addEventListener('DOMContentLoaded', loadUserTable);

async function loadUserTable() {
  let tableBody = document.getElementById('tbodyUser');
  let page = await fetch("/user/auth");
  let currentUser;
  if (page.ok) {
    currentUser = await page.json();
  } else {
    alert(`Error, ${page.status}`)
  }

  let dataHtml = '';
  let roles = '';
  for (let role of currentUser.roles) {
    roles += role.name + "<br>";
  }
  dataHtml +=
      `<tr>
        <td>${currentUser.id}</td>
        <td>${currentUser.firstName}</td>
        <td>${currentUser.lastName}</td>
        <td>${currentUser.email}</td>
        <td>${currentUser.age}</td>
        <td>${currentUser.username}</td>
        <td>${roles}</td>
      </tr>`;

  tableBody.innerHTML = dataHtml;
}

const tabs = document.querySelectorAll('.taba');
const tabsContent = document.querySelectorAll('.tabaContent');
tabs.forEach((clickedTab) => {
  clickedTab.addEventListener('click', async () => {
    tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
    clickedTab.classList.add('active');
    let tabaId = clickedTab.getAttribute('id');
    await activeTabContent(tabaId);
  });
});

async function activeTabContent(tabaId) {
  tabsContent.forEach((clickedTabContent) => {
    clickedTabContent.classList.contains(tabaId) ?
        clickedTabContent.classList.add('active') :
        clickedTabContent.classList.remove('active');
  })
}

const form_new = document.getElementById('formForNewUser');

async function newUser() {
  form_new.addEventListener('submit', addNewUser);
}

async function getRoles() {
  let page = await fetch(url + '/roles');
  let roles;
  if (page.ok) {
    roles = await page.json();
  } else {
    alert(`Error, ${page.status}`)
  }

  return roles;
}

async function addRolesFromAddNewUser() {
  let selection = document.getElementById('rolesForAdd');

  getRoles().then(function (roles) {
    let dataHtml = '';
    for (let role of roles) {
      dataHtml += `<option value="${role.id}">${role.name}</option>`;
    }
    selection.innerHTML = dataHtml;
  });
}

async function addNewUser(event) {
  event.preventDefault();
  let listOfRole = [];
  for (let i = 0; i < form_new.rolesForAdd.options.length; i++) {
    if (form_new.rolesForAdd.options[i].selected) {
      listOfRole.push(form_new.rolesForAdd.options[i].value);
    }
  }
  let addUrl = "http://localhost:8080/admin/user?roles=" + listOfRole;
  let method = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf_del.value
    },
    body: JSON.stringify({
      firstName: form_new.firstName.value,
      lastName: form_new.lastName.value,
      age: form_new.age.value,
      username: form_new.username.value,
      password: form_new.password.value,
      email: form_new.email.value
    })
  }

  await fetch(addUrl, method).then(function () {
    form_new.reset();
  });
}

const form_ed = document.getElementById('formForEditing');
const csrf_ed = document.getElementById('csrf_ed');
const id_ed = document.getElementById('id_ed');
const firstName_ed = document.getElementById('firstName_ed');
const lastName_ed = document.getElementById('lastName_ed');
const age_ed = document.getElementById('age_ed');
const username_ed = document.getElementById('username_ed');
const email_ed = document.getElementById('email_ed');
const roles_ed = document.getElementById('roles_ed');

function getOptionRolesForDelAndEdit(user, roles) {
  let dataHtml;

  let indexUserRoles = [];
  for (let userRole of user.roles) {
    indexUserRoles.push(userRole.id);
  }
  for (let role of roles) {
    if (indexUserRoles.includes(role.id)) {
      dataHtml += `<option value="${role.id}" selected>${role.name}</option>`;
    } else {
      dataHtml += `<option value="${role.id}">${role.name}</option>`;
    }
  }

  return dataHtml;
}

async function editModalData(id) {
  $('#editModal').modal('show');
  const urlDataEd = 'http://localhost:8080/admin/user/' + id;
  let usersPageEd = await fetch(urlDataEd);
  if (usersPageEd.ok) {
    await usersPageEd.json().then(function (user) {
      id_ed.value = `${user.id}`;
      firstName_ed.value = `${user.firstName}`;
      lastName_ed.value = `${user.lastName}`;
      email_ed.value = `${user.email}`;
      age_ed.value = `${user.age}`;
      username_ed.value = `${user.username}`;

      getRoles().then(function (roles) {
        roles_ed.innerHTML = getOptionRolesForDelAndEdit(user, roles);
      });
    });
  } else {
    alert(`Error, ${usersPageEd.status}`);
  }
}

async function editUser() {
  let listOfRole = [];
  for (let i = 0; i < form_ed.roles_ed.options.length; i++) {
    if (form_ed.roles_ed.options[i].selected) {
      listOfRole.push(form_ed.roles_ed.options[i].value);
    }
  }
  let urlEdit = 'http://localhost:8080/admin/user/' + id_ed.value + '?roles='
      + listOfRole;
  let method = {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf_ed.value
    },
    body: JSON.stringify({
      id: id_ed.value,
      firstName: form_ed.firstName.value,
      lastName: form_ed.lastName.value,
      age: form_ed.age.value,
      username: form_ed.username.value,
      password: form_ed.password.value,
      email: form_ed.email.value
    })
  }
  await fetch(urlEdit, method).then(function () {
    $('#editCloseBtn').click();
    getAdminPage();
  })
}

const form_del = document.getElementById('formForDeleting');
const csrf_del = document.getElementById('csrf_del');
const id_del = document.getElementById('id_del');
const firstName_del = document.getElementById(`firstName_del`);
const lastName_del = document.getElementById('lastName_del');
const email_del = document.getElementById('email_del');
const age_del = document.getElementById('age_del');
const username_del = document.getElementById('username_del');
const roles_del = document.getElementById('roles_del');

async function deleteModalData(id) {
  $('#deleteModal').modal('show');
  const urlForDel = 'http://localhost:8080/admin/user/' + id;
  let usersPageDel = await fetch(urlForDel);
  if (usersPageDel.ok) {
    await usersPageDel.json().then(user => {
      id_del.value = `${user.id}`;
      firstName_del.value = `${user.firstName}`;
      lastName_del.value = `${user.lastName}`;
      email_del.value = `${user.email}`;
      age_del.value = `${user.age}`;
      username_del.value = `${user.username}`;
      getRoles().then(function (roles) {
        roles_del.innerHTML = getOptionRolesForDelAndEdit(user, roles);
      });
    })
  } else {
    alert(`Error, ${usersPageDel.status}`)
  }
}

async function deleteUser() {
  let urlDel = 'http://localhost:8080/admin/' + id_del.value;

  let method = {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf_del.value
    },
    body: JSON.stringify({
      firstName: form_del.firstName.value,
      lastName: form_del.lastName.value,
      age: form_del.age.value,
      email: form_del.email.value,
      username: form_del.username.value
    })
  }
  await fetch(urlDel, method).then(function () {
    $('#deleteCloseBtn').click();
    getAdminPage();
  })
}