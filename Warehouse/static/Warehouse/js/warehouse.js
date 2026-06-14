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

    document.querySelectorAll('[id^="detail-"]').forEach(d => d.style.display = 'none');
    document.querySelectorAll('[id^="icon-"]').forEach(i => i.className = 'bi bi-folder me-1');

    if (!isVisible) {
        detail.style.display = 'table-row';
        const icon = document.getElementById('icon-' + detailId.replace('detail-', ''));
        if (icon) icon.className = 'bi bi-folder2-open me-1';
    }
}

function openAddModal() {
    new bootstrap.Modal(document.getElementById('addModal')).show();
}

function saveMaterial() {
    const saveBtn = document.querySelector('#addModal .btn-success');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    fetch('/warehouse/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            type: document.getElementById('addType').value,
            name: document.getElementById('addName').value,
            color: document.getElementById('addColor').value,
            stock_kg: document.getElementById('addStock').value,
            min_stock_kg: document.getElementById('addMinStock').value,
            description: document.getElementById('addDescription').value,
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showAlert('Material added!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    });
}

function openEditModal(id, type, name, color, minStock, description) {
    document.getElementById('editId').value = id;
    document.getElementById('editType').value = type;
    document.getElementById('editName').value = name;
    document.getElementById('editColor').value = color;
    document.getElementById('editMinStock').value = minStock;
    document.getElementById('editDescription').value = description;
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function updateMaterial() {
    const id = document.getElementById('editId').value;
    const saveBtn = document.querySelector('#editModal .btn-success');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    fetch(`/warehouse/update/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            type: document.getElementById('editType').value,
            name: document.getElementById('editName').value,
            color: document.getElementById('editColor').value,
            min_stock_kg: document.getElementById('editMinStock').value,
            description: document.getElementById('editDescription').value,
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showAlert('Material updated!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    });
}

let deleteMatId = null;

function deleteMaterial(id, name) {
    deleteMatId = id;
    document.getElementById('deleteMatName').textContent = name;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (!deleteMatId) return;

        const deleteBtn = document.getElementById('confirmDelete');
        deleteBtn.disabled = true;
        deleteBtn.textContent = '⏳ Deleting...';

        fetch(`/warehouse/delete/${deleteMatId}/`, {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Delete';
                showAlert('Material deleted!', 'danger');
                setTimeout(() => location.reload(), 1500);
            }
        })
        .catch(() => {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete';
        });
    });

    // تاریخ امروز برای transaction
    const txDate = document.getElementById('txDate');
    if (txDate) {
        txDate.value = new Date().toISOString().split('T')[0];
    }
});

function openTransactionModal(materialId, materialName, currentStock) {
    document.getElementById('txMaterialId').value = materialId;
    document.getElementById('txMaterialName').textContent = materialName;
    document.getElementById('txCurrentStock').textContent = currentStock;
    document.getElementById('txQuantity').value = '';
    document.getElementById('txNote').value = '';
    document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
    new bootstrap.Modal(document.getElementById('transactionModal')).show();
}

function saveTransaction() {
    const saveBtn = document.querySelector('#transactionModal .btn-success');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    fetch('/warehouse/transaction/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            material_id: document.getElementById('txMaterialId').value,
            transaction_type: document.getElementById('txType').value,
            quantity_kg: document.getElementById('txQuantity').value,
            contract_id: document.getElementById('txContract').value,
            date: document.getElementById('txDate').value,
            note: document.getElementById('txNote').value,
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('transactionModal')).hide();
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showAlert('Transaction saved!', 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showAlert(data.message, 'danger');
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    });
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show m-2`;
    alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    const container = document.getElementById('page-content') || document.body;
    container.prepend(alert);
}