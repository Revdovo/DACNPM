<div class="modal fade" id="boardModal" tabindex="-1" aria-labelledby="boardModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="boardModalLabel"><i>Bảng phân phối thông số</i></h5>
            </div>
            <div class="modal-body">
                <!-- Tiêu đề bảng -->
                <div class="row fw-bold text-center bg-dark text-white border border-dark p-0">
                    <div class="col-2 border border-dark p-0">Thông số</div>
                    <div class="col border border-dark p-0">Động cơ</div>
                    <div class="col border border-dark p-0">Trục I</div>
                    <div class="col border border-dark p-0">Trục II</div>
                    <div class="col border border-dark p-0">Trục III</div>
                    <div class="col border border-dark p-0">Tải</div>
                </div>

                <!-- Bảng dữ liệu sẽ được điền động vào đây -->
                <div id="boardTable"></div>
            </div>
        </div>
    </div>
</div>

<!-- Template hàng dữ liệu -->
<template id="boardRowTemplate">
    <div class="row text-center border border-dark p-0">
        <div class="col-2 fw-bold border border-dark p-0 data-label"></div>
        <div class="col border border-dark p-0 data-value-engine"></div>
        <div class="col border border-dark p-0 data-value-truc1"></div>
        <div class="col border border-dark p-0 data-value-truc2"></div>
        <div class="col border border-dark p-0 data-value-truc3"></div>
        <div class="col border border-dark p-0 data-value-load"></div>
    </div>
</template>

<!-- Template cho hàng có 5 cột nhưng vẫn giữ tổng chiều rộng -->
<template id="boardRowTemplateFiveCols">
    <div class="row text-center border border-dark p-0">
        <div class="col-2 fw-bold border border-dark p-0 data-label"></div>
        <div class="col border border-dark p-0 data-value-engine"></div>
        <div class="col-2 border border-dark p-0 data-value-truc1"></div>
        <div class="col-2 border border-dark p-0 data-value-truc2"></div>
        <div class="col border border-dark p-0 data-value-truc3"></div>
    </div>
</template>

