function toggleGallery(galleryId, header) {
    const gallery = document.getElementById(galleryId);
    const id = galleryId.replace('gallery-', '');
    const icon = document.getElementById('icon-' + id);
    const isVisible = gallery.style.display !== 'none';

    // بستن همه
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

// باز کردن قرارداد از URL
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

    // جستجو
    document.getElementById('contractSearch').addEventListener('input', function() {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.contract-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(search) ? 'block' : 'none';
        });
    });
});


// ! Test
// ? Test
// * Test
// TODO Test
