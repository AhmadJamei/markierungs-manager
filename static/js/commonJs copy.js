const rangInput = document.getElementById("range");
const output = document.getElementById("output");
const img = document.getElementById("myImage");

if (rangInput) {
    rangInput.addEventListener("input", function() {
        output.textContent = this.value;
        img.style.width = this.value + "px";
    });
}  
       
 

function toggleForm(formId="formBox", overlayId="overlay") {
    let form = document.getElementById(formId);
    let overlay = document.getElementById(overlayId);
    console.log("TOGGLE FORM:", form, overlay);
    if (!form || !overlay) return;

    if (form.style.display === "none") {    
        form.style.display = "block";
        overlay.style.display = "block";
    } else {
        form.style.display = "none";
        overlay.style.display = "none";
    }
}


function toggleDetail(id, element, prefix="detail-") {
    console.log("TOGGLE DETAIL:", id, element, prefix);
    let allDetails = document.querySelectorAll(`[id^='${prefix}']`);
    let allIcons = document.querySelectorAll(".icon");

    allDetails.forEach(d => {
        if (d.id !== prefix + id) {
            d.style.display = "none";
        }
    });

    allIcons.forEach(i => {
        if (i !== element.querySelector(".icon")) {
            i.textContent = "📁";
        }
    });

    let detail = document.getElementById(prefix + id);
    let icon = element.querySelector(".icon");
    let seperator = document.getElementById("seperator-"+ id)
    if (!detail) return;

    if (detail.style.display === "none") {
        detail.style.display = "block";
        icon.textContent = "📂";
        seperator.style.display = "block";
    } else {
        detail.style.display = "none";
        icon.textContent = "📁";
        seperator.style.display = "none";
    }
}

let lastScrollTop = 0;
const navbar = document.getElementById("mainNavbar");
window.addEventListener("scroll", function () {
        console.log("scrolling...");
        console.log("scroll");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (!navbar) return;

    if (scrollTop > lastScrollTop) {
        navbar.classList.add("hide-navbar");
    } else {
        navbar.classList.remove("hide-navbar");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

function enableEdit(button) {

    let container = button.closest(".form-detail");
    console.log("CONTAINER:", container)
    let fields = container.querySelectorAll(".field");
    console.log("FIELD:", fields)
    console.log("BUTTON:",button)
    fields.forEach(field => {
        field.readOnly = false;
        field.classList.add("editable");
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // ابتدا فیلتر کردن هدرهایی که قابلیت مرتب‌سازی دارند
    document.querySelectorAll('.sortable').forEach(header => {
        // خواندن مقادیر data-sort و data-order از HTML
        const field = header.getAttribute('data-sort');
        let order = header.getAttribute('data-order');  // مقدار اولیه جهت مرتب‌سازی

        // دریافت پارامترهای مرتب‌سازی از URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlSort = urlParams.get('sort');
        const urlOrder = urlParams.get('order');

        // اگر پارامترهای مرتب‌سازی در URL وجود داشته باشد، مقدار آنها را به روز رسانی کن
        if (urlSort === field) {
            order = urlOrder;  // تغییر جهت مرتب‌سازی از URL
        }

        // به روز رسانی داده‌ها در DOM
        header.setAttribute('data-order', order);

        // تغییر جهت فلش بر اساس مقدار order
        const arrow = header.querySelector('.sort-arrow');  // فلش درون هدر
        if (order === 'asc') {
            arrow.innerHTML = '&#x2191;';  // فلش رو به بالا
        } else {
            arrow.innerHTML = '&#x2193;';  // فلش رو به پایین
        }

        // افزودن event listener برای هر کلیک بر روی هدر
        header.addEventListener('click', function () {
            // تغییر جهت مرتب‌سازی
            order = order === 'asc' ? 'desc' : 'asc';

            // به‌روزرسانی داده‌ها در DOM
            header.setAttribute('data-order', order);

            // تغییر جهت فلش
            if (order === 'asc') {
                arrow.innerHTML = '&#x2191;';  // فلش رو به بالا
            } else {
                arrow.innerHTML = '&#x2193;';  // فلش رو به پایین
            }

            // ارسال درخواست به سرور با تغییر URL
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('sort', field);
            urlParams.set('order', order);

            const url = '/customer/list/?' + urlParams.toString();
            console.log("New URL:", url);

            // تغییر URL و بارگذاری مجدد صفحه
            window.location.href = url;  // صفحه با URL جدید بارگذاری می‌شود
        });
    });
});

// اضافه کردن کد جاوا اسکریپت برای ارسال فرم


// تابع برای باز و بسته کردن منو
document.addEventListener('DOMContentLoaded', function() {

    const inputsContainer = document.getElementById('inputs-container');
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const selectAllCheckbox = document.getElementById('select-all');
    const items = document.querySelectorAll(".item");
    const total = items.length;
    const checked = document.querySelectorAll(".item:checked").length;

    // ---------------- Toggle Menu ----------------
    function toggleMenu(event) {
        event.stopPropagation();
        const menu = document.getElementById('menu');
        menu.style.display = (menu.style.display === "block") ? "none" : "block";
    }
    window.toggleMenu = toggleMenu;

    document.addEventListener('click', function(e) {
        const menu = document.getElementById('menu');
        const btn = document.querySelector('.dropdown button');
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    // ---------------- Create Input ----------------
    function createInput(cb) {
        const name = cb.name;
        const existingInput = document.getElementById('input-' + name);

        if (cb.checked && !existingInput) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'input-' + name;
            input.name = name;
            input.placeholder = name;
            input.className = 'form-control form-control-sm';
            input.style.width = '100px';

            input.addEventListener('input', filterRows); // وصل کردن event

            inputsContainer.appendChild(input);
        } else if (!cb.checked && existingInput) {
            inputsContainer.removeChild(existingInput);
            filterRows(); // وقتی input حذف شد، دوباره فیلتر کنیم
        }
    }

    // ---------------- Collect filters & AJAX ----------------
// اضافه کردن آرگومان page با مقدار پیش‌فرض 1
function filterRows(page = 1) {
    const inputs = inputsContainer.querySelectorAll('input');
    const params = new URLSearchParams();
    
    // جمع‌آوری فیلترها
    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            params.append(input.name, input.value.trim());
        }
    });

    // اضافه کردن شماره صفحه به پارامترها
    params.append('page', page);

    console.log("AJAX URL params:", params.toString());
    
    // ارسال درخواست به سرور
    fetch(customerFilterUrl + "?" + params.toString())
        .then(response => response.json())
        .then(data => {
            const listBody = document.querySelector('.list-body');
            listBody.innerHTML = ''; // پاک کردن نتایج قبلی

            // توجه: اکنون دیتا داخل data.customers قرار دارد
            if (data.customers.length === 0) {
                listBody.innerHTML = '<p>جستجو هیچ نتیجه‌ای نداشت.</p>';
                renderPagination(data); // پاک کردن دکمه‌های صفحه‌بندی قدیمی
                return;
            }

            // رندر کردن سطرها
            data.customers.forEach((customer, index) => {
                // محاسبه ردیف درست براساس صفحه فعلی
                const rowNumber = ((data.current_page - 1) * 25) + (index + 1);
                
                const row = document.createElement('div');
                row.className = 'row-item';
                row.innerHTML = `
                    <span class="row-number">${rowNumber}</span>
                    <span class="icon">📁</span>
                    <span class="row-content"><strong>${customer.IDCustomer}</strong></span>
                    <span class="name">${customer.Name}</span>
                    <span class="city">${customer.City}</span>
                    <span class="postcode">${customer.PostCode}</span>
                    <span class="mobile">${customer.MobileNumber1}</span>
                `;
                listBody.appendChild(row);
            });

            // اجرای تابع رندر کردن دکمه‌های صفحه‌بندی جدید
            renderPagination(data);
        });
}

// تابع جدید برای ساخت دکمه‌های صفحه‌بندی به صورت داینامیک
function renderPagination(data) {
    // فرض کنیم یک div با کلاس pagination-container در صفحه داری
    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) return; 

    paginationContainer.innerHTML = ''; // پاک کردن دکمه‌های قبلی

    if (data.total_pages <= 1) return; // اگر کلا یک صفحه بود دکمه نمی‌خواهیم

    // دکمه صفحه قبل
    if (data.has_previous) {
        const prevBtn = document.createElement('button');
        prevBtn.innerText = 'قبلی';
        prevBtn.addEventListener('click', () => filterRows(data.previous_page_number));
        paginationContainer.appendChild(prevBtn);
    }

    // نمایش صفحه فعلی از کل صفحات
    const info = document.createElement('span');
    info.innerText = ` صفحه ${data.current_page} از ${data.total_pages} `;
    paginationContainer.appendChild(info);

    // دکمه صفحه بعد
    if (data.has_next) {
        const nextBtn = document.createElement('button');
        nextBtn.innerText = 'بعدی';
        // کلیک روی این دکمه، تابع اصلی را با شماره صفحه بعد صدا می‌زند در حالی که فیلترها حفظ می‌شوند
        nextBtn.addEventListener('click', () => filterRows(data.next_page_number));
        paginationContainer.appendChild(nextBtn);
    }
}
    // ---------------- Event listeners ----------------
    checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            createInput(cb);
        });
    });

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checked = this.checked;
            checkboxes.forEach(cb => {
                cb.checked = checked;
                createInput(cb);
            });
        });
    }
    if (checked === total) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
    }
    else if (checked === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    }
    else {
        selectAll.checked = false;
        selectAll.indeterminate = true; // حالت "-"
    }


});