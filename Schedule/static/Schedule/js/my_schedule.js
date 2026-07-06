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

function openReportModal(workdayId) {
    document.getElementById('reportWorkdayId').value = workdayId;
    document.getElementById('reportText').value = '';
    document.getElementById('existingImages').innerHTML = '';
    document.getElementById('reportStatus').innerHTML = '';
    document.getElementById('engineerNoteDiv').style.display = 'none';
    document.getElementById('reportImages').value = '';
    discardAudio();
    document.getElementById('existingAudios').innerHTML = '';
    // گرفتن گزارش قبلی
    fetch(`/schedule/report/get/${workdayId}/`)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                document.getElementById('reportText').value = data.text || '';
                document.getElementById('reportId').value = data.report_id || '';

                // نمایش وضعیت
                if (data.status_value) {
                    let statusHtml = '';
                    if (data.status_value === 'approved') {
                        statusHtml = '<span class="badge bg-success">✅ Approved</span>';
                    } else if (data.status_value === 'rejected') {
                        statusHtml = '<span class="badge bg-danger">❌ Rejected</span>';
                    } else if (data.status_value === 'pending') {
                        statusHtml = '<span class="badge bg-warning text-dark">⏳ Pending Review</span>';
                    }
                    document.getElementById('reportStatus').innerHTML = statusHtml;
                }

                // نمایش یادداشت مهندس
                if (data.engineer_note) {
                    document.getElementById('engineerNoteDiv').style.display = 'block';
                    document.getElementById('engineerNoteText').textContent = data.engineer_note;
                }

                // نمایش تصاویر موجود
                const container = document.getElementById('existingImages');
                if (data.images && data.images.length > 0) {
                    data.images.forEach(img => {
                        const div = document.createElement('div');
                        div.style.position = 'relative';
                        div.innerHTML = `
                            <img src="${img.url}" style="width:80px; height:80px; object-fit:cover; border-radius:4px;">
                            <button onclick="deleteImage(${img.id}, this)" 
                                style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:18px; height:18px; font-size:10px; cursor:pointer;">✕</button>
                        `;
                        container.appendChild(div);
                        // نمایش صداهای موجود
                        const audioContainer = document.getElementById('existingAudios');
                        if (data.audios && data.audios.length > 0) {
                            data.audios.forEach(aud => {
                                const div = document.createElement('div');
                                div.className = 'mb-1';
                                div.innerHTML = `<audio controls src="${aud.url}" style="width:100%; height:36px;"></audio>`;
                                audioContainer.appendChild(div);
                            });
                        }
                    });
                }
            }
        });

    new bootstrap.Modal(document.getElementById('reportModal')).show();
}

function saveReport() {
    const workdayId = document.getElementById('reportWorkdayId').value;
    const text = document.getElementById('reportText').value;
    
    // دکمه Save رو غیرفعال کن
    const saveBtn = document.querySelector('#reportModal .btn-primary');
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Saving...';
    
    const formData = new FormData();
    formData.append('text', text);
    
    const galleryFiles = document.getElementById('reportImages').files;
    for (let i = 0; i < galleryFiles.length; i++) {
        formData.append('images', galleryFiles[i]);
    }
    
    const cameraFiles = document.getElementById('reportCamera').files;
    for (let i = 0; i < cameraFiles.length; i++) {
        formData.append('images', cameraFiles[i]);
    }

    if (audioBlob) {
        formData.append('audio', audioBlob, 'voice_record.webm');
    }

    fetch(`/schedule/report/add/${workdayId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            // بستن modal
            bootstrap.Modal.getInstance(document.getElementById('reportModal')).hide();
            // ریست دکمه
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save';
            // پیغام موفقیت
            showAlert('Report saved successfully!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    })
    .catch(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save';
        showAlert('Error saving report!', 'danger');
    });
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show m-2`;
    alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.getElementById('page-content').prepend(alert);
}

function deleteImage(imageId, btn) {
    if (!confirm('Delete this image?')) return;
    
    fetch(`/schedule/report/image/delete/${imageId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            btn.parentElement.remove();
        }
    });
}

// weather
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
                        warning = '⛔ RAIN';
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
                    widget.innerHTML = '<small class="text-muted">❌</small>';
                }
            });
    });
});

let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;
let audioBlob = null;

function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayer').src = url;
                document.getElementById('audioPreview').style.display = 'block';
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.start();
            recordingSeconds = 0;
            document.getElementById('recordTimer').style.display = 'inline';
            document.getElementById('recordBtn').textContent = '⏹️ Stop Recording';
            document.getElementById('recordBtn').classList.replace('btn-outline-danger', 'btn-danger');
            recordingTimer = setInterval(() => {
                recordingSeconds++;
                const min = Math.floor(recordingSeconds / 60);
                const sec = recordingSeconds % 60;
                document.getElementById('recordTimer').textContent = 
                    `⏺️ ${min}:${sec.toString().padStart(2, '0')}`;
                if (recordingSeconds >= 180) stopRecording();
            }, 1000);
        })
        .catch(() => alert('Microphone access denied!'));
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        clearInterval(recordingTimer);
        document.getElementById('recordTimer').style.display = 'none';
        document.getElementById('recordBtn').textContent = '🎙️ Start Recording';
        document.getElementById('recordBtn').classList.replace('btn-danger', 'btn-outline-danger');
    }
}

function discardAudio() {
    audioBlob = null;
    document.getElementById('audioPreview').style.display = 'none';
    document.getElementById('audioPlayer').src = '';
}