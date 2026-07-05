function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function saveCompany() {
    const saveBtn = document.querySelector('button[onclick="saveCompany()"]');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    const formData = new FormData();
    formData.append('name', document.getElementById('companyName').value);
    formData.append('primary_color', document.getElementById('primaryColor').value);
    formData.append('secondary_color', document.getElementById('secondaryColor').value);
    formData.append('address', document.getElementById('companyAddress').value);
    formData.append('phone', document.getElementById('companyPhone').value);
    formData.append('email', document.getElementById('companyEmail').value);
    formData.append('website', document.getElementById('companyWebsite').value);
    formData.append('max_holiday_days', document.getElementById('maxHolidayDays').value);
    
    const logo = document.getElementById('companyLogo').files[0];
    if (logo) formData.append('logo', logo);

    fetch('/settings/company/update/', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save';
            showAlert('Company settings saved!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save';
    });
}

function addMaterialType() {
    const category = document.getElementById('mtCategory').value;
    const name = document.getElementById('mtName').value.trim();
    const color = document.getElementById('mtColor').value.trim();

    if (!name) {
        showAlert('Please enter a name!', 'danger');
        return;
    }

    fetch('/settings/material-type/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ category, name, color })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            showAlert('Material type added!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    });
}

function deleteMaterialType(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;

    fetch(`/settings/material-type/delete/${id}/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            showAlert('Material type deleted!', 'danger');
            setTimeout(() => location.reload(), 1500);
        }
    });
}

function addContractType() {
    const code = document.getElementById('ctCode').value.trim();
    const name = document.getElementById('ctName').value.trim();

    if (!code || !name) {
        showAlert('Please enter code and name!', 'danger');
        return;
    }

    fetch('/settings/contract-type/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ code, name })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            showAlert('Contract type added!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    });
}

function deleteContractType(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;

    fetch(`/settings/contract-type/delete/${id}/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            showAlert('Contract type deleted!', 'danger');
            setTimeout(() => location.reload(), 1500);
        }
    });
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show m-2`;
    alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    const container = document.getElementById('page-content') || document.body;
    container.prepend(alert);
}