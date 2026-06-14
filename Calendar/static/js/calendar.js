let calendarInstance = null;

document.addEventListener('DOMContentLoaded', function () {

    const calendarEl = document.getElementById('calendar');

    calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 600,
        weekNumbers: true,
        events: "/calendar/get-leaves/",

        eventClick: function(info) {
            const id = info.event.extendedProps.id;
            const status = info.event.extendedProps.status;
            if (status === 'pending') {
                if (confirm('Do you want to cancel this request?')) {
                    fetch(`/calendar/delete-leave/${id}/`, {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': getCookie('csrftoken')
                        }
                    })
                    .then(r => r.json())
                    .then(data => {
                        if (data.status === 'ok') {
                            calendarInstance.refetchEvents();
                        }
                    });
                }
            }
        }
    });

    calendarInstance.render();
});

function changeView(viewName) {
    if (calendarInstance) {
        calendarInstance.changeView(viewName);
    }
}

function submitLeave() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const leaveType = document.getElementById('leaveType').value;
    const reason = document.getElementById('leaveReason').value;

    if (!startDate || !endDate) {
        alert('Please select start and end date!');
        return;
    }

    if (endDate < startDate) {
        alert('End date must be after start date!');
        return;
    }

    fetch('/calendar/add-leave/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
            leave_type: leaveType,
            reason: reason
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            bootstrap.Modal.getInstance(document.getElementById('addLeaveModal')).hide();
            location.reload();
        } else {
            alert(data.message);
        }
    });
}

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