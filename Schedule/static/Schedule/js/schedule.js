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

function addWorkday() {
    const contractId = document.getElementById('contractId').value;
    const startDate = document.getElementById('workDateStart').value;
    const endDate = document.getElementById('workDateEnd').value || startDate;
    const workerIds = Array.from(document.querySelectorAll('.worker-check:checked')).map(o => o.value);
    const vehicleIds = Array.from(document.querySelectorAll('.vehicle-check:checked')).map(o => o.value);  // ← اضافه شد
    const note = document.getElementById('workNote').value;
    const shift = document.getElementById('workShift').value;

    if (!startDate) {
        alert('Please select a start date!');
        return;
    }

    if (endDate < startDate) {
        alert('End date must be after start date!');
        return;
    }

    fetch('/schedule/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            contract_id: contractId,
            start_date: startDate,
            end_date: endDate,
            worker_ids: workerIds,
            vehicle_ids: vehicleIds,
            note: note,
            shift: shift,

        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            location.reload();
        } else {
            alert(data.message);
        }
    });
}

function deleteWorkday(id) {
    if (!confirm('Delete this work day?')) return;
    fetch(`/schedule/delete/${id}/`, {
        method: 'POST',
        headers: {
        'X-CSRFToken': getCookie('csrftoken')        }
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            location.reload();
        }
    });
}

function editWorkday(id, contractId, date) {
    document.getElementById('contractId').value = contractId;
    document.getElementById('workDateStart').value = date;
    document.getElementById('workDateEnd').value = date;

    // ریست همه checkbox ها
    document.querySelectorAll('.worker-check').forEach(cb => cb.checked = false);
    document.querySelectorAll('.vehicle-check').forEach(cb => cb.checked = false);

    // گرفتن کارمندهای فعلی
    fetch(`/schedule/workers/${id}/`)
        .then(r => r.json())
        .then(data => {
            data.workers.forEach(worker => {
                const cb = document.getElementById(`worker_${worker.id}`);
                if (cb) cb.checked = true;
            });
        });

    // گرفتن ماشین‌های فعلی
    fetch(`/schedule/vehicles/${id}/`)
        .then(r => r.json())
        .then(data => {
            data.vehicles.forEach(vehicle => {
                const cb = document.getElementById(`vehicle_${vehicle.RegisterNumber}`);
                if (cb) cb.checked = true;
            });
        });

    const saveBtn = document.querySelector('#addModal .btn-success');
    saveBtn.textContent = 'Update';
    saveBtn.onclick = () => updateWorkday(id);

    var modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
}

function updateWorkday(id) {
    const workerIds = Array.from(document.querySelectorAll('.worker-check:checked')).map(o => o.value);
    const vehicleIds = Array.from(document.querySelectorAll('.vehicle-check:checked')).map(o => o.value);
    const note = document.getElementById('workNote').value;
    const shift = document.getElementById('workShift').value;

    fetch(`/schedule/update/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            worker_ids: workerIds,
            vehicle_ids: vehicleIds,
            note: note,
            shift: shift,

        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            location.reload();
        } else {
            alert(data.message);
        }
    });
}

function copyWorkday(id, currentDate) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split('T')[0];
    
    const newDate = prompt('Copy to date:', nextDateStr);
    if (!newDate) return;

    fetch(`/schedule/copy/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ date: newDate })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            location.reload();
        } else {
            alert(data.message);
        }
    });
}

function showPreview(element, url) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = url;
    
    const rect = element.getBoundingClientRect();
    preview.style.top = (rect.top - 160) + 'px';
    preview.style.left = (rect.left - 60) + 'px';
    preview.style.display = 'block';
}

function hidePreview() {
    document.getElementById('imagePreview').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.weather-widget').forEach(widget => {
        const city = widget.getAttribute('data-city');
        const date = widget.getAttribute('data-date');
        const shift = widget.getAttribute('data-shift');
        
        fetch(`/schedule/weather/?city=${encodeURIComponent(city)}&date=${date}&shift=${shift}`)
            .then(r => r.json())
            .then(data => {
                if (data.status === 'ok') {
                    const w = data.weather;
                    
                    let bgColor = '#d4edda';
                    let textColor = '#155724';
                    let warning = '';
                    
                    if (w.rain) {
                        bgColor = '#f8d7da';
                        textColor = '#721c24';
                        warning = '⛔ RAIN - Work Stop!';
                    } else if (w.description.includes('wolke') || w.description.includes('cloud')) {
                        bgColor = '#fff3cd';
                        textColor = '#856404';
                    }

                    const shiftIcon = shift === 'night' ? '🌙' : '🌞';
                    
                    widget.innerHTML = `
                        <div style="background:${bgColor}; color:${textColor}; border-radius:4px; padding:3px 5px; font-size:10px; margin-top:2px;">
                            ${shiftIcon}
                            <img src="https://openweathermap.org/img/wn/${w.icon}.png" style="width:20px; height:20px;">
                            <strong>${w.temp}°C</strong> | 💨 ${w.wind_speed}m/s
                            <div>${w.description}</div>
                            ${warning ? `<div><strong>${warning}</strong></div>` : ''}
                        </div>
                    `;
                } else {
                    widget.innerHTML = '<small class="text-muted">❌ Weather unavailable</small>';
                }
            });
    });
});

function markDone(id) {
    if (!confirm('Mark this work day as Done?')) return;
    
    fetch(`/schedule/status/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            status: 'done',
            cancel_reason: ''
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            location.reload();
        }
    });
}

function openCancelModal(id) {
    document.getElementById('cancelId').value = id;
    document.getElementById('cancelReason').value = '';
    var modal = new bootstrap.Modal(document.getElementById('cancelModal'));
    modal.show();
}

function confirmCancel() {
    const id = document.getElementById('cancelId').value;
    const cancelType = document.getElementById('cancelType').value;
    const cancelReason = document.getElementById('cancelReason').value;

    fetch(`/schedule/status/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            status: cancelType,
            cancel_reason: cancelReason
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('cancelModal')).hide();
            location.reload();
        }
    });
}

function openNoteModal(e, workdayId, workerId, workerName) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();

    document.getElementById('noteWorkdayId').value = workdayId;
    document.getElementById('noteWorkerId').value = workerId;
    document.getElementById('noteWorkerName').textContent = workerName;
    document.getElementById('noteText').value = '';

    fetch(`/schedule/note/get/${workdayId}/${workerId}/`)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                document.getElementById('noteText').value = data.note;
            }
        });

    var modalEl = document.getElementById('noteModal');
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function saveNote() {
    const workdayId = document.getElementById('noteWorkdayId').value;
    const workerId = document.getElementById('noteWorkerId').value;
    const note = document.getElementById('noteText').value;

    fetch(`/schedule/note/${workdayId}/${workerId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ note: note })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('noteModal')).hide();
            location.reload();
        }
    });
}

const nav = document.getElementById('nav');
if (nav) {
    const spans = nav.querySelectorAll('span[data-x]');
    const radius = 45;
    let isOpen = false;


function toggleMenu() {
    isOpen = !isOpen;
    nav.classList.toggle('open', isOpen);
    spans.forEach(span => {
    const x = parseFloat(span.dataset.x);
    const y = parseFloat(span.dataset.y);
    span.style.transform = isOpen
        ? `translate(${x * radius}px, ${y * radius}px)`
        : 'translate(0, 0)';
    });
}

// *کلیک روی دکمه مرکزی - باز/بسته کردن منو
nav.addEventListener('click', (e) => {
    if (e.target.closest('span[data-x]')) return;
    toggleMenu();
});

// *کلیک روی هر آیکون
spans.forEach(span => {
    span.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isOpen) {
        toggleMenu();
        return;
    }
    alert('کلیک شد: ' + span.dataset.label);
    });
});
}

// RADIAL MENU
document.addEventListener('DOMContentLoaded', function() {
    const radius = 45;

    document.querySelectorAll('.navigation').forEach(nav => {
        const spans = nav.querySelectorAll('span[data-x]');
        const workdayId = nav.getAttribute('data-workday');
        const contractId = nav.getAttribute('data-contract');
        const date = nav.getAttribute('data-date');
        let isOpen = false;

        function toggleMenu() {
            // بستن همه منوهای دیگه
            document.querySelectorAll('.navigation.open').forEach(n => {
                if (n !== nav) {
                    n.classList.remove('open');
                    n.querySelectorAll('span[data-x]').forEach(s => {
                        s.style.transform = 'translate(0, 0)';
                    });
                }
            });

            isOpen = !isOpen;
            nav.classList.toggle('open', isOpen);
            spans.forEach(span => {
                const x = parseFloat(span.dataset.x);
                const y = parseFloat(span.dataset.y);
                span.style.transform = isOpen
                    ? `translate(${x * radius}px, ${y * radius}px)`
                    : 'translate(0, 0)';
            });
        }

        nav.addEventListener('click', (e) => {
            if (e.target.closest('span[data-x]')) return;
            toggleMenu();
        });

        spans.forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isOpen) {
                    toggleMenu();
                    return;
                }

                const action = span.getAttribute('data-action');
                if (action === 'edit') editWorkday(workdayId, contractId, date);
                else if (action === 'copy') copyWorkday(workdayId, date);
                else if (action === 'done') markDone(workdayId);
                else if (action === 'cancel') openCancelModal(workdayId);
                else if (action === 'delete') deleteWorkday(workdayId);
                else if (action === 'detail') window.location.href = `/schedule/workday/${workdayId}/detail/`;
            });
        });
    });
});
