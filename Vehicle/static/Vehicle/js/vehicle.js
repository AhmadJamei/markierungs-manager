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

function toggleDetail(detailId, row) {
    const detail = document.getElementById(detailId);
    const isVisible = detail.style.display !== 'none';

    document.querySelectorAll('[id^="detail-"]').forEach(d => {
        d.style.display = 'none';
    });
    document.querySelectorAll('[id^="icon-"]').forEach(i => {
        i.className = 'bi bi-folder me-1';
    });

    if (!isVisible) {
        detail.style.display = 'table-row';
        const icon = document.getElementById('icon-' + detailId.replace('detail-', ''));
        if (icon) icon.className = 'bi bi-folder2-open me-1';
    }
}

// SORTING
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const sort = this.getAttribute('data-sort');
            const urlParams = new URLSearchParams(window.location.search);
            const currentSort = urlParams.get('sort');
            const currentOrder = urlParams.get('order') || 'asc';
            if (currentSort === sort) {
                urlParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
            } else {
                urlParams.set('sort', sort);
                urlParams.set('order', 'asc');
            }
            window.location.href = '?' + urlParams.toString();
        });
    });

    // FILTER CHECKBOXES
    const filterMap = {
        'checkModel': 'inputModel',
        'checkKind': 'inputKind',
        'checkFuel': 'inputFuel',
        'checkResponsible': 'inputResponsible',
    };

    Object.keys(filterMap).forEach(checkId => {
        const inputDiv = document.getElementById(filterMap[checkId]);
        if (!inputDiv) return;
        const input = inputDiv.querySelector('input, select');
        if (!input) return;
        const hasValue = input.tagName === 'SELECT' ? input.value !== '' : input.value.trim() !== '';
        if (hasValue) {
            inputDiv.style.display = 'block';
            document.getElementById(checkId).checked = true;
        }
    });

    document.querySelectorAll('.filter-check').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const inputDiv = document.getElementById(filterMap[this.id]);
            if (!inputDiv) return;
            inputDiv.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                const input = inputDiv.querySelector('input, select');
                if (input) input.value = '';
            }
        });
    });

    // DELETE
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (!deleteId) return;

        const deleteBtn = document.getElementById('confirmDelete');
        deleteBtn.disabled = true;
        deleteBtn.textContent = '⏳ Deleting...';

        fetch(`/vehicle/delete/${deleteId}/`, {
            method: 'POST',
            headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Delete';
                showAlert('Fahrzeug gelöscht!', 'danger');
                setTimeout(() => location.reload(), 1500);
            }
        })
        .catch(() => {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete';
        });
    });
});

// EDIT MODAL
function openEditModal(id, model, kind, fuel, mileage, purchaseDate, responsibleId, insuranceExpiry, technicalExpiry, description) {
    document.getElementById('editId').value = id;
    document.getElementById('editModel').value = model;
    document.getElementById('editKind').value = kind;
    document.getElementById('editFuel').value = fuel;
    document.getElementById('editMileage').value = mileage;
    document.getElementById('editPurchaseDate').value = purchaseDate;
    document.getElementById('editResponsible').value = responsibleId;
    document.getElementById('editInsuranceExpiry').value = insuranceExpiry;
    document.getElementById('editTechnicalExpiry').value = technicalExpiry;
    document.getElementById('editDescription').value = description;
    document.getElementById('editImage').value = '';
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function saveEdit() {
    const id = document.getElementById('editId').value;

    const saveBtn = document.querySelector('#editModal .btn-success');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    const formData = new FormData();
    formData.append('Model', document.getElementById('editModel').value);
    formData.append('Kind', document.getElementById('editKind').value);
    formData.append('Fuel', document.getElementById('editFuel').value);
    formData.append('mileage', document.getElementById('editMileage').value);
    formData.append('purchase_date', document.getElementById('editPurchaseDate').value);
    formData.append('responsible_id', document.getElementById('editResponsible').value);
    formData.append('insurance_expiry', document.getElementById('editInsuranceExpiry').value);
    formData.append('technical_expiry', document.getElementById('editTechnicalExpiry').value);
    formData.append('Description', document.getElementById('editDescription').value);
    
    const imageFile = document.getElementById('editImage').files[0];
    if (imageFile) {
        formData.append('Image', imageFile);
    }

    fetch(`/vehicle/update/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showAlert('Fahrzeug aktualisiert!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
        showAlert('Error saving vehicle!', 'danger');
    });
}

let deleteId = null;
function deleteVehicle(id) {
    deleteId = id;
    document.getElementById('deleteVehicleName').textContent = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show m-2`;
    alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.getElementById('page-content').prepend(alert);
}
