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
        const id = detailId.split('-')[1];
        document.getElementById(`icon-${id}`).className = 'bi bi-folder2-open me-1';    
        loadContracts(id);
    }
}

function openEditModal(id, idCustomer, name, city, postCode, mobile) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editCity').value = city;
    document.getElementById('editPostCode').value = postCode;
    document.getElementById('editMobile').value = mobile;

    var modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function saveEdit() {
    const id = document.getElementById('editId').value;

    const saveBtn = document.querySelector('#editModal .btn-success');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    fetch(`/customer/update/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({
            Name: document.getElementById('editName').value,
            City: document.getElementById('editCity').value,
            PostCode: document.getElementById('editPostCode').value,
            MobileNumber1: document.getElementById('editMobile').value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showAlert('Customer updated successfully!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
        showAlert('Error saving customer!', 'danger');
    });
}

let deleteId = null;

function deleteCustomer(id, idCustomer, name) {
    deleteId = id;
    document.getElementById('deleteCustomerName').textContent = idCustomer + ' - ' + name;
    var modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (!deleteId) return;

        const deleteBtn = document.getElementById('confirmDelete');
        deleteBtn.disabled = true;
        deleteBtn.textContent = '⏳ Deleting...';
        
        fetch(`/customer/delete/${deleteId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Delete';
                showAlert('Customer deleted successfully!', 'danger');
                setTimeout(() => location.reload(), 1500);
            }
        })
        .catch(() => {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete';
        });
    });
});

// FILTER CHECKBOXES
document.addEventListener('DOMContentLoaded', function() {
    
    const filterMap = {
        'checkCity': 'inputCity',
        'checkPostCode': 'inputPostCode',
        'checkMobile': 'inputMobile'
    };

    Object.keys(filterMap).forEach(checkId => {
        const inputDiv = document.getElementById(filterMap[checkId]);
        if (!inputDiv) return;
        const input = inputDiv.querySelector('input, select');
        if(!input) return;
        if (input.value) {
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

    // SORTING
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
            
            urlParams.delete('page');
            window.location.href = '?' + urlParams.toString();
        });
    });
});

// SHOW ALERT
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show m-2`;
    alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    const container = document.getElementById('page-content') || document.body;
    container.prepend(alert);
}

// LOAD CONTRACTS
function loadContracts(customerId) {
    const container = document.getElementById(`contracts-list-${customerId}`);
    container.innerHTML = '<span class="text-muted">Loading...</span>';
    
    fetch(`/customer/${customerId}/contracts/`)
        .then(response => response.json())
        .then(data => {
            if (data.contracts.length === 0) {
                container.innerHTML = '<span class="text-muted">No contracts found.</span>';
                return;
            }
            
            let html = '<table class="table table-sm table-bordered mt-2">';
            html += '<thead class="table-secondary"><tr><th>ID</th><th>Name</th><th>Type</th><th>Date Run</th><th>Price</th></tr></thead>';
            html += '<tbody>';
            
            data.contracts.forEach(c => {
                html += `<tr style="cursor:pointer;" onclick="window.location.href='/contract/list/?search=${c.IDContract}'">
                    <td>${c.IDContract}</td>
                    <td>${c.Name}</td>
                    <td>${c.Type}</td>
                    <td>${c.DateRun || '-'}</td>
                    <td>${c.Price}</td>
                </tr>`;
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
        });
}
