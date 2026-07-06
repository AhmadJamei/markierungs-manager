function toggleGallery(galleryId, header) {
    const gallery = document.getElementById(galleryId);
    const id = galleryId.replace('gallery-', '');
    const icon = document.getElementById('icon-' + id);
    const isVisible = gallery.style.display !== 'none';

    //* بستن همه
    document.querySelectorAll('[id^="gallery-"]').forEach(g => g.style.display = 'none');
    document.querySelectorAll('[id^="icon-"]').forEach(i => {
        i.className = 'bi bi-folder text-warning';
        i.style.fontSize = '1.2rem';
    });

    // TODO باز کردن این یکی
    if (!isVisible) {
        gallery.style.display = 'block';
        icon.className = 'bi bi-folder2-open text-warning';
    }
}

function showFullImage(url) {
    document.getElementById('fullImage').src = url;
    new bootstrap.Modal(document.getElementById('fullImageModal')).show();
}

// *باز کردن قرارداد از URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const contractId = urlParams.get('contract');
    if (contractId) {
        const gallery = document.getElementById('gallery-' + contractId);
        const icon = document.getElementById('icon-' + contractId);
        if (gallery) {
            gallery.style.display = 'block';
            if (icon) icon.className = 'bi bi-folder2-open text-warning';
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // *جستجو
    document.getElementById('contractSearch').addEventListener('input', function() {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.contract-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(search) ? 'block' : 'none';
        });
    });
});

// AUDIO RECORDING
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
            
            mediaRecorder.ondataavailable = e => {
                audioChunks.push(e.data);
            };
            
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayer').src = url;
                document.getElementById('audioPreview').style.display = 'block';
                stream.getTracks().forEach(t => t.stop());
            };
            
            mediaRecorder.start();
            recordingSeconds = 0;
            
            //* آپدیت تایمر
            document.getElementById('recordTimer').style.display = 'inline';
            document.getElementById('recordBtn').textContent = '⏹️ Stop Recording';
            document.getElementById('recordBtn').classList.replace('btn-outline-danger', 'btn-danger');
            
            recordingTimer = setInterval(() => {
                recordingSeconds++;
                const min = Math.floor(recordingSeconds / 60);
                const sec = recordingSeconds % 60;
                document.getElementById('recordTimer').textContent = 
                    `⏺️ ${min}:${sec.toString().padStart(2, '0')}`;
                
                // *حداکثر 3 دقیقه
                if (recordingSeconds >= 180) stopRecording();
            }, 1000);
        })
        .catch(() => {
            alert('Microphone access denied!');
        });
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
// ! Test
// ? Test
// * Test
// TODO Test
