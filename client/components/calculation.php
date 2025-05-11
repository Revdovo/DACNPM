<div id="calculationModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
        <div class="modal-content d-flex flex-column" style="max-height: 90vh;">

            <!-- Header -->
            <div class="modal-header">
                <h5 class="modal-title">Tính Toán Hệ Thống</h5>
            </div>

            <div class="modal-body flex-grow-1 overflow-auto">
                <div id="step1" class="calculation-step d-none">
                    <h5>Bước 1a: Chọn hiệu suất của từng bộ truyền</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Bộ truyền</th>
                                    <th>Chế độ</th>
                                    <th>Chọn hiệu suất</th>
                                    <th>Giá trị đã chọn</th>
                                </tr>
                            </thead>
                            <tbody id="efficiencyTable"></tbody>
                        </table>
                    </div>
                </div>

                <div id="step2" class="calculation-step d-none">
                    <h5>Bước 1b: Xác định số vòng quay sơ bộ</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Loại truyền</th>
                                    <th>Tỉ số truyền (min - max)</th>
                                    <th>Chọn tỉ số</th>
                                    <th>Giá trị đã chọn</th>
                                </tr>
                            </thead>
                            <tbody id="transmissionTableBody">

                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="step3" class="calculation-step d-none">
                    <h5>Bước 1c: Chọn động cơ phù hợp</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Kiểu động cơ</th>
                                    <th>Công suất (kW)</th>
                                    <th>Vận tốc (50Hz)</th>
                                    <th>Hiệu suất</th>
                                    <th class="text-center">Chọn</th>
                                </tr>
                            </thead>
                            <tbody id="engineSelectionTableBody">

                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="step4" class="calculation-step d-none">
                    <h5>Bước 1d: Phân phối lại tỉ số truyền thật sự</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Thông số</th>
                                    <th>Khoảng giá trị</th>
                                    <th>Chọn giá trị</th>
                                    <th>Giá trị đã chọn</th>
                                </tr>
                                <tbody id=TriSoVitriBanhRangTableBody>
                                </tbody>
                            </thead>
                        </table>
                    </div>
                </div>

                <div id="step5" class="calculation-step d-none">
                    <h5>Bước 2a: Chọn vật liệu bánh răng dẫn</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nhãn hiệu thép</th>
                                    <th>Nhiệt luyện</th>
                                    <th>Kích thước (mm)</th>
                                    <th>Độ cứng (HB/HRC)</th>
                                    <th>Giới hạn bền (MPa)</th>
                                    <th>Giới hạn chảy (MPa)</th>
                                    <th class="text-center">Chọn</th>
                                </tr>
                            </thead>
                            <tbody id="bevelGearMaterial">
                                
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="step6" class="calculation-step d-none">
                    <h5>Bước 2b: Chọn vật liệu bánh răng bị dẫn</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nhãn hiệu thép</th>
                                    <th>Nhiệt luyện</th>
                                    <th>Kích thước (mm)</th>
                                    <th>Độ cứng (HB/HRC)</th>
                                    <th>Giới hạn bền (MPa)</th>
                                    <th>Giới hạn chảy (MPa)</th>
                                    <th class="text-center">Chọn</th>
                                </tr>
                            </thead>
                            <tbody id="bevelGearMaterial2">
                                
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="step7" class="calculation-step d-none">
                    <h5>Bước 3a: Chọn vật liệu bánh răng dẫn</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nhãn hiệu thép</th>
                                    <th>Nhiệt luyện</th>
                                    <th>Kích thước (mm)</th>
                                    <th>Độ cứng (HB/HRC)</th>
                                    <th>Giới hạn bền (MPa)</th>
                                    <th>Giới hạn chảy (MPa)</th>
                                    <th class="text-center">Chọn</th>
                                </tr>
                            </thead>
                            <tbody id="shaftGearMaterial">
                                
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="step8" class="calculation-step d-none">
                    <h5>Bước 3b: Chọn vật liệu bánh răng bị dẫn</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nhãn hiệu thép</th>
                                    <th>Nhiệt luyện</th>
                                    <th>Kích thước (mm)</th>
                                    <th>Độ cứng (HB/HRC)</th>
                                    <th>Giới hạn bền (MPa)</th>
                                    <th>Giới hạn chảy (MPa)</th>
                                    <th class="text-center">Chọn</th>
                                </tr>
                            </thead>
                            <tbody id="shaftGearMaterial2">
                                
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="step9" class="calculation-step d-none">
                    <h5>Bước 4: Chọn điều kiện làm việc của bộ truyền xích</h5>
                    <div class="table-responsive" style="height: 50vh; overflow-y: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Điều kiện làm việc</th>
                                    <th><th>
                                    <th>Trị số</th>
                                </tr>
                            </thead>
                            <tbody id="chainConditionTable"></tbody>
                        </table>
                    </div>
                </div>

                <div id="step10" class="calculation-step d-none">
                    <div class="table-responsive text-center py-4" style="height: 50vh; overflow-y: auto;">
                        <h5>Tính toán hoàn tất!</h5><i class='text-success fs-1 bi bi-check-circle'></i>
                    </div>
                </div>
            </div>

            <!-- Footer cố định dưới -->
            <div class="modal-footer">
                <button id="prevStep" class="btn btn-secondary">Quay lại</button>
                <button id="nextStep" class="btn btn-primary">Tiếp tục</button>
            </div>

        </div>
    </div>
</div>
