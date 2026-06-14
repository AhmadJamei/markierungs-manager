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
        const id = detailId.replace('detail-', '');
        document.getElementById('icon-' + id).className = 'bi bi-folder2-open me-1';
        
        // لود متریال‌های قرارداد
        loadContractMaterials(id);
    }
}

function openEditModal(id, idContract, name, customer, type, address, dateCreated, dateRun, price, city) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editCustomer').value = customer;
    document.getElementById('editAddress').value = address;
    document.getElementById('editPrice').value = price;
    document.getElementById('editCity').value = city;

    var modalEl = document.getElementById('editModal');
    var modal = new bootstrap.Modal(modalEl);
    modalEl.addEventListener('shown.bs.modal', function handler() {
        document.getElementById('editType').value = type;
        modalEl.removeEventListener('shown.bs.modal', handler);
    });

    modal.show();
}

function saveEdit() {
    const id = document.getElementById('editId').value;

    const saveBtn = document.querySelector('#editModal .btn-success');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    fetch(`/contract/update/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({
            Name: document.getElementById('editName').value,
            Customer_id: document.getElementById('editCustomer').value,
            Type: document.getElementById('editType').value,
            Address: document.getElementById('editAddress').value,
            Price: document.getElementById('editPrice').value,
            City: document.getElementById('editCity').value,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
            showAlert('Contract updated successfully!', 'success');
            setTimeout(() => window.location.href = '/contract/list/', 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
        showAlert('Error saving contract!', 'danger');
    });
}

let deleteId = null;

function deleteContract(id, idContract, name) {
    deleteId = id;
    document.getElementById('deleteContractName').textContent = idContract + ' - ' + name;
    var modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (!deleteId) return;

        const deleteBtn = document.getElementById('confirmDelete');
        deleteBtn.disabled = true;
        deleteBtn.textContent = '⏳ Deleting...';
        
        fetch(`/contract/delete/${deleteId}/`, {
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
                showAlert('Contract deleted successfully!', 'danger');
                setTimeout(() => location.reload(), 1500);
            }
        })
        .catch(() => {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete';
        });
    });
});

// SORTING & FILTER
document.addEventListener('DOMContentLoaded', function() {

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

    // FILTER CHECKBOXES
    const filterMap = {
        'checkName': 'inputName',
        'checkCustomer': 'inputCustomer',
        'checktype': 'inputType',
        'checkDateRun': 'inputDateRun',
        'checkDateCreated': 'inputDateCreated'
    };

    Object.keys(filterMap).forEach(checkId => {
        const inputDiv = document.getElementById(filterMap[checkId]);
        if (!inputDiv) return;
        const input = inputDiv.querySelector('input, select');
        if (!input) return;

        const hasValue = input.tagName === 'SELECT' 
            ? input.value !== '' 
            : input.value.trim() !== '';
    
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
});

// SHOW ALERT
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show m-2`;
    alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.getElementById('page-content').prepend(alert);
}

function openMaterialModal(contractId) {
    document.getElementById('matContractId').value = contractId;
    document.getElementById('matMaterial').value = '';
    document.getElementById('matRequired').value = '';
    document.getElementById('matNote').value = '';
    document.getElementById('stockInfo').style.display = 'none';
    
    // لود متریال‌های قرارداد
    loadContractMaterials(contractId);
    
    new bootstrap.Modal(document.getElementById('materialModal')).show();
}

function loadContractMaterials(contractId) {
    const container = document.getElementById(`material-list-${contractId}`);
    if (!container) return;
    
    fetch(`/contract/${contractId}/materials/`)
        .then(r => r.json())
        .then(data => {
            if (data.materials.length === 0) {
                container.innerHTML = '<span class="text-muted">No materials added yet</span>';
                return;
            }

            let html = '<table class="table table-sm table-bordered mt-1">';
            html += '<thead class="table-secondary"><tr><th>Material</th><th>Required</th><th>Stock</th><th>Status</th><th></th></tr></thead>';
            html += '<tbody>';

            data.materials.forEach(m => {
                const stockOk = m.stock_kg >= 0;
                const stockColor = stockOk ? 'text-success' : 'text-danger';
                html += `<tr>
                    <td>${m.material_type} - ${m.material_name}</td>
                    <td>${m.required_kg} kg</td>
                    <td class="${stockColor}">${m.stock_kg} kg</td>
                    <td>
                        ${m.stencil === 'available' ? '<span class="badge bg-success">✅</span>' :
                          m.stencil === 'ordered' ? '<span class="badge bg-warning text-dark">📦</span>' :
                          '<span class="badge bg-secondary">❌</span>'}
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" style="font-size:9px;"
                            onclick="deleteContractMaterial(${m.id}, ${m.contract_id || 0})">
                            🗑️
                        </button>
                    </td>
                </tr>`;
            });

            html += '</tbody></table>';
            container.innerHTML = html;
        });
}

// نمایش موجودی وقتی متریال انتخاب میشه
document.addEventListener('DOMContentLoaded', function() {
    const matSelect = document.getElementById('matMaterial');
    if (matSelect) {
        matSelect.addEventListener('change', function() {
            const selected = this.options[this.selectedIndex];
            const stock = parseFloat(selected.getAttribute('data-stock') || 0);
            const stockInfo = document.getElementById('stockInfo');
            const stockBadge = document.getElementById('stockBadge');

            if (this.value) {
                stockInfo.style.display = 'block';
                if (stock <= 0) {
                    stockBadge.className = 'p-2 rounded bg-danger text-white';
                    stockBadge.textContent = `⚠️ Out of stock! Available: ${stock} kg`;
                } else if (stock < 50) {
                    stockBadge.className = 'p-2 rounded bg-warning text-dark';
                    stockBadge.textContent = `⚡ Low stock: ${stock} kg`;
                } else {
                    stockBadge.className = 'p-2 rounded bg-success text-white';
                    stockBadge.textContent = `✅ In stock: ${stock} kg`;
                }
            } else {
                stockInfo.style.display = 'none';
            }
        });
    }
});

function saveMaterial() {
    const contractId = document.getElementById('matContractId').value;
    const materialId = document.getElementById('matMaterial').value;
    const required = document.getElementById('matRequired').value;

    if (!materialId || !required) {
        showAlert('Please select material and enter required amount!', 'danger');
        return;
    }

    const saveBtn = document.querySelector('#materialModal .btn-success');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';

    fetch(`/contract/${contractId}/materials/add/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({
            material_id: materialId,
            required_kg: required,
            stencil: document.getElementById('matStencil').value,
            note: document.getElementById('matNote').value,
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save';
            if (data.warning) {
                showAlert(data.warning, 'warning');
            } else {
                showAlert('Material added!', 'success');
            }
            bootstrap.Modal.getInstance(document.getElementById('materialModal')).hide();
            setTimeout(() => location.reload(), 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save';
    });
}

function deleteContractMaterial(id, contractId) {
    if (!confirm('Remove this material? Stock will be returned to warehouse.')) return;

    fetch(`/contract/materials/delete/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            showAlert('Material removed! Stock returned to warehouse.', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    });
}