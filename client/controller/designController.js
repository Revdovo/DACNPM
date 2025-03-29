let P, n, L;

document.addEventListener("DOMContentLoaded", function () {
    const workspaceCodeDisplay = document.getElementById("workspaceCodeDisplay");
    const workspaceStatus = document.getElementById("workspaceStatus");
    const calculationForm = document.getElementById("calculationForm");
    const inputs = document.querySelectorAll("input[type='number']");
    
    const urlParams = new URLSearchParams(window.location.search);
    const workspaceCode = urlParams.get("code") || "default123";

    workspaceCodeDisplay.value = workspaceCode;

    let currentStep = localStorage.getItem("lastStep") ? parseInt(localStorage.getItem("lastStep")) : 1;
    let calculationResultsChap2 = [];
    let calculationResultsChap3 = [];


    async function fetchWorkspaceData() {
        try {
            const response = await fetch(`api.php?action=getWorkspace&code=${workspaceCode}`);
            const data = await response.json();

            if (data.success) {
                workspaceStatus.innerHTML = `<strong>Trạng thái:</strong> <span class="text-uppercase">${data.workspace.status}</span>`;
                P = data.workspace.P;
                n = data.workspace.n;
                L = data.workspace.L;
            } else {
                workspaceStatus.innerHTML = `<strong class="text-danger">Không tìm thấy workspace.</strong>`;
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu workspace:", error);
            workspaceStatus.innerHTML = `<strong class="text-danger">Lỗi kết nối server.</strong>`;
        }
    }

    fetchWorkspaceData();
    
    workspaceCodeDisplay.addEventListener("click", () => {
        navigator.clipboard.writeText(workspaceCode)
            .then(() => {
                alert("Mã Workspace đã được sao chép!");
            })
            .catch((error) => {
                console.error("Lỗi sao chép mã workspace:", error);
            });
    });

    // Kiểm tra số thực không âm khi nhập dữ liệu
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            if (!/^\d*\.?\d*$/.test(this.value)) {
                this.value = this.value.replace(/[^0-9.]/g, ''); // Chỉ giữ lại số và dấu '.'
            }
        });
    });

    calculationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(calculationForm);
        let num1 = parseFloat(formData.get("num1"));
        let num2 = parseInt(formData.get("num2")); // Số nguyên
        let num3 = parseFloat(formData.get("num3"));
    
        // Kiểm tra số thực không âm trước khi gửi
        if (isNaN(num1) || isNaN(num2) || isNaN(num3) || num1 < 0 || num2 < 0 || num3 < 0) {
            alert("Vui lòng nhập số thực không âm hợp lệ.");
            return;
        }
    
        try {
            const updateResponse = await fetch("api.php?action=updateWorkspace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: workspaceCode, num1, num2, num3 })
            });
    
            const updateData = await updateResponse.json();
            if (updateData.success) {
                alert("Cập nhật dữ liệu thành công!");
                fetchWorkspaceData();
            } else {
                alert(`Lỗi cập nhật dữ liệu: ${updateData.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("Không thể kết nối server.");
        }
    });   

    $("#manualCalculationBtn").click(async function () {
        let $calculationModal = $("#calculationModal"); // Chỉ thao tác với modal này
    
        if ($("#autoCalculationBtn").hasClass("active")) {
            // Auto Mode - Hiển thị loading trong modal calculationModal
            $calculationModal.find(".modal-title").text("Tính toán tự động");
            $calculationModal.find(".modal-body").html("<div class='text-center py-4'><h5>Đang tính toán tự động...</h5><div class='spinner-border text-primary' role='status'></div></div>");
            $calculationModal.find(".modal-footer").hide();
            $calculationModal.modal("show");
    
            // Chạy các hàm tính toán
            await loadEfficiencyData();
            await calculateSystemEfficiency();
            await loadTransmissionRatios();
            await calculatePreliminaryRPM();
            await loadSuitableEngines();
            await loadTriSoViTriBanhRang();
            await redistributeTransmissionRatio();
    
            // Chờ 1 giây trước khi hiển thị thông báo hoàn thành
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            // Hiển thị thông báo hoàn thành thay vì đóng modal
            $calculationModal.find(".modal-title").text("Hoàn thành");
            $calculationModal.find(".modal-body").html("<div class='text-center py-4'><h5>Tính toán hoàn tất!</h5><i class='text-success fs-1 bi bi-check-circle'></i></div>");
            $calculationModal.find(".modal-footer").html('<button class="btn btn-success" data-bs-dismiss="modal">Đóng</button>').show();
    
            return;
        } else {
            // Manual Mode - Hiển thị modal với nội dung gốc
            $calculationModal.find(".modal-title").text("Tính Toán Hệ Thống");
            $calculationModal.find(".modal-body").html($("#originalModalContent").html());
            $calculationModal.find(".modal-footer").show();
    
            currentStep = 1;
            $calculationModal.modal("show");
            showStep(currentStep);
    
            // Chạy các hàm tính toán
            await loadEfficiencyData();
            await loadTransmissionRatios();
            await loadTriSoViTriBanhRang();
            await loadBevelGear1Materials();
        }
    });
    

    //Chap2: Lựa chọn động cơ điện

    async function loadEfficiencyData() {
        $.post("api.php", { action: "get_efficiency" }, function (response) {
            if (!response.success) {
                console.error("Lỗi khi lấy dữ liệu hiệu suất:", response.message);
                return;
            }
    
            let efficiencyList = response.data;
            let tableBody = $("#efficiencyTable");
            tableBody.empty();
    
            let selectedTypes = ["Bộ truyền bánh răng trụ", "Bộ truyền bánh răng côn", "Bộ truyền xích", "Một cặp ổ lăn"];
            let autoMode = $("#autoCalculationBtn").hasClass("active");
    
            efficiencyList.forEach(item => {
                if (selectedTypes.includes(item.TenGoi)) {
                    let minValue = item.HieuSuatDuoccheMin ?? 0;
                    let maxValue = item.HieuSuatDuoccheMax ?? 1;
                    let defaultValue = (parseFloat(minValue) + parseFloat(maxValue)) / 2;
    
                    if (autoMode) {
                        // Auto bật → Lưu giá trị ngay lập tức trước khi tính toán
                        setEfficiencyValue(item.TenGoi, defaultValue);
                    } else {
                        // Auto tắt → Hiển thị bảng
                        let row = $(`
                            <tr>
                                <td>${item.TenGoi}</td>
                                <td>
                                    <select class="efficiency-mode form-control">
                                        <option value="che" data-min="${item.HieuSuatDuoccheMin}" data-max="${item.HieuSuatDuoccheMax}" selected>Có che</option>
                                        <option value="khongche" data-min="${item.HieuSuatDeHoMin}" data-max="${item.HieuSuatDeHoMax}">Không che</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="range" class="efficiency-slider form-range" min="${minValue}" max="${maxValue}" step="0.001" value="${defaultValue}">
                                </td>
                                <td class="efficiency-value">${defaultValue.toFixed(3)}</td>
                            </tr>
                        `);
                        tableBody.append(row);
                    }
                }
            });
    
            if (!autoMode) {
                $(".efficiency-mode").change(function () {
                    let selected = $(this).find(":selected");
                    let row = $(this).closest("tr");
                    let minValue = selected.data("min") ?? 0;
                    let maxValue = selected.data("max") ?? 1;
                    let defaultValue = (minValue + maxValue) / 2;
    
                    let slider = row.find(".efficiency-slider");
                    let valueDisplay = row.find(".efficiency-value");
    
                    slider.attr("min", minValue);
                    slider.attr("max", maxValue);
                    slider.val(defaultValue);
                    valueDisplay.text(defaultValue.toFixed(3));
                });
    
                $(".efficiency-slider").on("input", function () {
                    let value = $(this).val();
                    $(this).closest("tr").find(".efficiency-value").text(parseFloat(value).toFixed(3));
                });
            }
        });
    }    
    
    function setEfficiencyValue(type, value) {
        const efficiencyNames = {
            "Một cặp ổ lăn": "ηol",
            "Bộ truyền bánh răng côn": "ηbrcon",
            "Bộ truyền bánh răng trụ": "ηbrtru",
            "Bộ truyền xích": "ηx"
        };
    
        if (type === "Một cặp ổ lăn") {
            value = Math.pow(value, 3); // Áp dụng công thức đặc biệt
        }
    
        let shortName = efficiencyNames[type] || "η";
        
        // Kiểm tra nếu giá trị đã có, thì cập nhật
        let existingEntry = calculationResultsChap2.find(entry => entry.name === shortName);
        if (existingEntry) {
            existingEntry.data = value.toFixed(3);
        } else {
            calculationResultsChap2.push({ name: shortName, data: value.toFixed(3) });
        }
    }    
    

    async function loadTransmissionRatios() {
        try {
            const response = await fetch("api.php?action=getTransmissionRatios");
            const data = await response.json();
    
            if (!data.success) {
                console.error("Không lấy được dữ liệu tỉ số truyền:", data.message);
                return;
            }
    
            let transmissionList = data.data;
            let tableBody = $("#transmissionTableBody");
            tableBody.empty();
    
            let selectedTypes = ["Truyền động bánh răng côn Hộp giảm tốc côn - trụ 2 cấp", "Truyền động Xích"];
            let autoMode = $("#autoCalculationBtn").hasClass("active");
    
            transmissionList.forEach(item => {
                if (selectedTypes.includes(item.LoaiTruyen)) {
                    let minValue = item.TisoTruyenMin ?? 0;
                    let maxValue = item.TisoTruyenMax ?? 1;
                    let defaultValue = (parseFloat(minValue) + parseFloat(maxValue) / 2) / 2;
    
                    if (autoMode) {
                        setTransmissionRatio(item.LoaiTruyen, defaultValue);
                    } else {
                        // Auto tắt → Hiển thị bảng để chọn
                        let row = $(`
                            <tr>
                                <td>${item.LoaiTruyen}</td>
                                <td>${minValue} - ${maxValue}</td>
                                <td>
                                    <input type="range" class="transmission-slider form-range" min="${minValue}" max="${maxValue}" step="0.1" value="${defaultValue}">
                                </td>
                                <td class="selected-value text-center">${defaultValue}</td>
                            </tr>
                        `);
    
                        tableBody.append(row);
                    }
                }
            });
    
            if (!autoMode) {
                $(".transmission-slider").on("input", function () {
                    let value = $(this).val();
                    $(this).closest("tr").find(".selected-value").text(parseFloat(value).toFixed(1));
                });
            }
    
        } catch (error) {
            console.error("Lỗi khi kết nối server:", error);
        }
    }

    function setTransmissionRatio(type, value) {
        const ratioNames = {
            "Truyền động bánh răng côn Hộp giảm tốc côn - trụ 2 cấp": "uhgt",
            "Truyền động Xích": "ux"
        };
    
        let shortName = ratioNames[type] || "i";
    
        let existingEntry = calculationResultsChap2.find(entry => entry.name === shortName);
        if (existingEntry) {
            existingEntry.data = value.toFixed(1);
        } else {
            calculationResultsChap2.push({ name: shortName, data: value.toFixed(1) });
        }
    }
    

    async function loadSuitableEngines() {
        try {
            const response = await fetch("api.php?action=getEngineData");
            const data = await response.json();
    
            if (!data.success) {
                console.error("Không lấy được dữ liệu động cơ:", data.message);
                return;
            }
    
            let engines = data.engines;
            let isAuto = $("#autoCalculationBtn").hasClass("active");
    
            let Pct = getCalculationResult("Pct");
            let nsb = getCalculationResult("nsb");
    
            if (Pct === null || nsb === null) {
                console.error("Không tìm thấy giá trị Pct hoặc nsb trong kết quả tính toán");
                return;
            }
    
            let suitableEngines = engines.filter(engine => {
                let power = parseFloat(engine.cong_suat_kw);
                let speed = parseInt(engine.van_toc_50Hz);
                return power >= parseFloat(Pct) && speed >= parseInt(nsb);
            });
    
            let tableBody = $("#engineSelectionTableBody");
            tableBody.empty();
    
            if (suitableEngines.length === 0) {
                tableBody.append(`<tr><td colspan="6" class="text-center">Không có động cơ phù hợp</td></tr>`);
                return;
            }
    
            // Hiển thị danh sách động cơ
            suitableEngines.forEach((engine, index) => {
                let row = $(`
                    <tr>
                        <td>${engine.kieu_dong_co}</td>
                        <td>${parseFloat(engine.cong_suat_kw).toFixed(2)}</td>
                        <td>${engine.van_toc_50Hz}</td>
                        <td>${parseFloat(engine.hieu_suat).toFixed(3)}</td>
                        <td class="text-center">
                            <input type="radio" name="selectedEngine" value="${engine.id}" data-engine='${JSON.stringify(engine)}' ${isAuto && index === 0 ? "checked" : ""}>
                        </td>
                    </tr>
                `);
                tableBody.append(row);
            });
    
            // Nếu Auto bật, tự động chọn động cơ đầu tiên
            if (isAuto && suitableEngines.length > 0) {
                let selectedEngine = suitableEngines[0];
                updateSelectedEngine(selectedEngine);
            }
    
            // Xử lý sự kiện khi người dùng chọn động cơ
            $("input[name='selectedEngine']").on("change", function () {
                let selectedEngine = $(this).data("engine");
                updateSelectedEngine(selectedEngine);
            });
    
        } catch (error) {
            console.error("Lỗi khi kết nối server:", error);
        }
    }
    
    function updateSelectedEngine(engine) {
        let existingIndex = calculationResultsChap2.findIndex(item => item.name === "Loại động cơ");
    
        if (existingIndex !== -1) {
            calculationResultsChap2[existingIndex].data = engine.kieu_dong_co;
        } else {
            calculationResultsChap2.push({
                name: "Loại động cơ",
                data: engine.kieu_dong_co
            });
        }
    
        displayResultsChap2();
    }
    

    async function loadTriSoViTriBanhRang() {
        try {
            const response = await fetch("api.php?action=getTriSoViTriBanhRang");
            const data = await response.json();
    
            if (!data.success) {
                console.error("Không thể lấy dữ liệu:", data.message);
                return;
            }
    
            const triSoData = data.data;
            const psiBa = triSoData.find(item => item.TriSo === "ψ_ba");
            const psiBdmax = triSoData.find(item => item.TriSo === "ψ_bdmax");
    
            if (!psiBa || !psiBdmax) {
                console.error("Không tìm thấy dữ liệu ψba hoặc ψbdmax.");
                return;
            }
    
            let isAuto = $("#autoCalculationBtn").hasClass("active"); // Kiểm tra Auto Mode
    
            // Danh sách các thông số cần sử dụng
            let parameters = [
                { name: "ψba", min: parseFloat(psiBa.DoRanMatRang_Min1), max: parseFloat(psiBa.DoRanMatRang_Max1), step: 0.01 },
                { name: "ψbdmax", min: parseFloat(psiBdmax.DoRanMatRang_Min1), max: parseFloat(psiBdmax.DoRanMatRang_Max1), step: 0.01 },
                { name: "Kbe", min: 0.25, max: 0.3, step: 0.01 },
                { name: "Ck", min: 1.0, max: 1.1, step: 0.01 }
            ];
    
            // Nếu Auto Mode, chỉ tính toán giá trị mà không cập nhật bảng
            if (isAuto) {
                parameters.forEach(param => {
                    let autoValue = ((param.min + param.max) / 2).toFixed(3);
                    updateTriSoCalculation(param.name, autoValue); // Chỉ cập nhật giá trị
                });
                return; // Thoát sớm, không làm gì thêm với bảng
            }
    
            // Nếu không phải Auto Mode, cập nhật bảng
            let tableBody = document.getElementById("TriSoVitriBanhRangTableBody");
            tableBody.innerHTML = ""; // Xóa bảng cũ để cập nhật lại
    
            parameters.forEach(param => {
                let defaultValue = ((param.min + param.max) / 2).toFixed(3);
    
                let row = `
                    <tr>
                        <td>${param.name}</td>
                        <td>${param.min} - ${param.max}</td>
                        <td>
                            <input type="range" id="${param.name}Slider" class="form-range"
                                min="${param.min}" max="${param.max}" step="${param.step}" value="${defaultValue}">
                        </td>
                        <td id="selected${param.name}">${defaultValue}</td>
                    </tr>`;
    
                tableBody.innerHTML += row;
            });
    
            // Lắng nghe sự kiện thay đổi giá trị trên thanh trượt
            parameters.forEach(param => {
                let slider = document.getElementById(`${param.name}Slider`);
                let displayValue = document.getElementById(`selected${param.name}`);
    
                slider.addEventListener("input", function () {
                    let value = parseFloat(this.value).toFixed(3);
                    displayValue.innerText = value;
                    updateTriSoCalculation(param.name, value);
                });
            });
    
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu từ server:", error);
        }
    }    
    
    // Hàm cập nhật giá trị vào calculationResultsChap2
    function updateTriSoCalculation(name, value) {
        let existingEntry = calculationResultsChap2.find(entry => entry.name === name);
        if (existingEntry) {
            existingEntry.data = value;
        } else {
            calculationResultsChap2.push({ name, data: value });
        }
        
        displayResultsChap2()
    }
    
    
    async function calculateSystemEfficiency() {
        let totalEfficiency = 1;
        let Pct = parseFloat(P) || 0;
    
        const efficiencyNames = {
            "Một cặp ổ lăn": "ηol",
            "Bộ truyền bánh răng côn": "ηbrcon",
            "Bộ truyền bánh răng trụ": "ηbrtru",
            "Bộ truyền xích": "ηx"
        };
    
        let autoMode = $("#autoCalculationBtn").hasClass("active");
    
        if (autoMode) {
            Object.values(efficiencyNames).forEach(shortName => {
                let entry = calculationResultsChap2.find(e => e.name === shortName);
                if (entry) {
                    let efficiency = parseFloat(entry.data);
                    totalEfficiency *= efficiency;
                }
            });
        } else {
            $("#efficiencyTable tr").each(function () {
                let type = $(this).find("td:first").text().trim();
                let efficiency = parseFloat($(this).find(".efficiency-slider").val());
    
                if (type === "Một cặp ổ lăn") {
                    efficiency = Math.pow(efficiency, 3);
                }
    
                let shortName = efficiencyNames[type] || "η";
    
                let existingEntry = calculationResultsChap2.find(entry => entry.name === shortName);
                if (existingEntry) {
                    existingEntry.data = efficiency.toFixed(3);
                } else {
                    calculationResultsChap2.push({ name: shortName, data: efficiency.toFixed(3) });
                }
    
                totalEfficiency *= efficiency;
            });
        }
    
        Pct /= totalEfficiency;
    
        let systemEfficiencyEntry = calculationResultsChap2.find(entry => entry.name === "η hệ");
        if (systemEfficiencyEntry) {
            systemEfficiencyEntry.data = totalEfficiency.toFixed(3);
        } else {
            calculationResultsChap2.push({ name: "η hệ", data: totalEfficiency.toFixed(3) });
        }
    
        let pctEntry = calculationResultsChap2.find(entry => entry.name === "Pct");
        if (pctEntry) {
            pctEntry.data = Pct.toFixed(3);
        } else {
            calculationResultsChap2.push({ name: "Pct", data: Pct.toFixed(3) });
        }
    
        displayResultsChap2();
    }    

    async function calculatePreliminaryRPM() {
        try {
            let isAuto = $("#autoCalculationBtn").hasClass("active");
            let tisoChung = 1;
            let nsb = parseFloat(n) || 0;
    
            const transmissionNames = {
                "Truyền động Xích": "ux",
                "Truyền động bánh răng côn Hộp giảm tốc côn - trụ 2 cấp": "uhgt"
            };
    
            if (!isAuto) {
                // Chế độ thủ công: lấy dữ liệu từ giao diện
                $("#transmissionTableBody tr").each(function () {
                    let type = $(this).find("td:first").text().trim();
                    let tiso = parseFloat($(this).find(".transmission-slider").val()) || 1;
                    setTransmissionRatio(type, tiso);
                    tisoChung *= tiso;
                });
    
            } else {
                Object.values(transmissionNames).forEach(shortName => {
                    let entry = calculationResultsChap2.find(item => item.name === shortName);
                    if (entry) {
                        tisoChung *= parseFloat(entry.data);
                    }
                });
            }
    
            nsb *= tisoChung;
    
            let commonRatioEntry = calculationResultsChap2.find(entry => entry.name === "uch");
            if (commonRatioEntry) {
                commonRatioEntry.data = tisoChung.toFixed(2);
            } else {
                calculationResultsChap2.push({ name: "uch", data: tisoChung.toFixed(2) });
            }
    
            let rpmEntry = calculationResultsChap2.find(entry => entry.name === "nsb");
            if (rpmEntry) {
                rpmEntry.data = nsb.toFixed(2);
            } else {
                calculationResultsChap2.push({ name: "nsb", data: nsb.toFixed(2) });
            }
    
            displayResultsChap2();
        } catch (error) {
            console.error("Lỗi khi tính toán số vòng quay sơ bộ:", error);
        }
    }    

    function getCalculationResult(name) {
        name = name.trim().toLowerCase(); // Chuẩn hóa chuỗi đầu vào
        let result = calculationResultsChap2.find(item => item.name.trim().toLowerCase() === name);
        return result ? parseFloat(result.data) : null;
    }

    async function redistributeTransmissionRatio() {
        try {
            // Gọi API lấy dữ liệu động cơ
            const response = await fetch("api.php?action=getEngineData");
            const data = await response.json();

            if (!data.success) {
                console.error("Không thể lấy dữ liệu động cơ:", data.message);
                return;
            }
            
            const engineData = data.engines;

            // Lấy tên động cơ từ calculationResultsChap2
            let selectedEngineEntry = calculationResultsChap2.find(item => item.name === "Loại động cơ");
            if (!selectedEngineEntry) {
                console.error("Không tìm thấy tên động cơ trong calculationResultsChap2.");
                return;
            }

            let selectedEngine = selectedEngineEntry.data;

            // Tìm dữ liệu động cơ trong database
            let engine = engineData.find(item => item.kieu_dong_co === selectedEngine);
            if (!engine) {
                console.error(`Không tìm thấy động cơ có tên: ${selectedEngine}`);
                return;
            }

            let ndc = parseFloat(engine.van_toc_50Hz);
    
            // Lấy các giá trị từ calculationResultsChap2
            let ux = calculationResultsChap2.find(item => item.name === "ux")?.data || NaN;
            let psiBdmax = calculationResultsChap2.find(item => item.name === "ψbdmax")?.data || NaN;
            let kbe = calculationResultsChap2.find(item => item.name === "Kbe")?.data || NaN;
            let ck = calculationResultsChap2.find(item => item.name === "Ck")?.data || NaN;
    
            ux = parseFloat(ux);
            psiBdmax = parseFloat(psiBdmax);
            kbe = parseFloat(kbe);
            ck = parseFloat(ck);
    
            if (isNaN(ndc) || isNaN(n) || isNaN(ux) || isNaN(psiBdmax) || isNaN(kbe) || isNaN(ck) || ux === 0) {
                console.error("Lỗi: Một số giá trị không hợp lệ.");
                return;
            }
    
            // Tính toán các giá trị
            let uch = (ndc / n).toFixed(3);
            let uhgt = (uch / ux).toFixed(3);
            let lamdak = ((2.25 * psiBdmax) / ((1 - kbe) * kbe)).toFixed(3);
            let u1 = 1.0;
            let tolerance = 0.0001;
            let maxIterations = 100;
            let iteration = 0;
            let newU1;

            do {
                newU1 = Math.pow((Math.pow(uhgt, 3) + uhgt * u1) / (lamdak * Math.pow(ck, 3)), 1 / 4);
                if (Math.abs(newU1 - u1) < tolerance) break;
                u1 = newU1;
                iteration++;
            } while (iteration < maxIterations);

            u1 = newU1.toFixed(3);
            let u2 = (uhgt / u1).toFixed(3);
    
            // Cập nhật vào calculationResultsChap2
            let updateOrPush = (name, value) => {
                let existingEntry = calculationResultsChap2.find(entry => entry.name === name);
                if (existingEntry) {
                    existingEntry.data = value;
                } else {
                    calculationResultsChap2.push({ name, data: value });
                }
            };
    
            updateOrPush("uch", uch);
            updateOrPush("uhgt", uhgt);
            updateOrPush("lamdak", lamdak);
            updateOrPush("u1", u1);
            updateOrPush("u2", u2);

            displayResultsChap2()
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu từ API:", error);
        }
    }    

    function displayResultsChap2() {
        let firstColumn = document.querySelector(".result-col:first-child");
        firstColumn.innerHTML = "";

        calculationResultsChap2.forEach(result => {
            let resultItem = `
                <div class="p-2 border">
                    <strong>${result.name}</strong>: ${result.data}
                </div>
            `;
            firstColumn.innerHTML += resultItem;
        });
    }

    //Chap 3: Thiết kế bộ truyền bánh răng
    async function loadBevelGear1Materials() {
        try {
            const response = await fetch("api.php?action=getGearMaterialData");
            const data = await response.json();
    
            // Kiểm tra dữ liệu hợp lệ
            if (!data.success || !Array.isArray(data.materials)) {
                console.error("Lỗi dữ liệu vật liệu:", data.message || "Dữ liệu không hợp lệ.");
                return;
            }
    
            const materials = data.materials; // Lấy toàn bộ danh sách vật liệu
    
            // Lấy tbody của bảng
            let tableBody = $("#bevelGearMaterial");
            tableBody.empty(); // Xóa dữ liệu cũ trước khi thêm mới
    
            // Duyệt qua danh sách vật liệu và thêm vào bảng
            materials.forEach((material, index) => {
                let row = $(`
                    <tr>
                        <td>${material.NhanHieuThep}</td>
                        <td>${material.NhietLuyen}</td>
                        <td>${material.KichThuocS_Min || "N/A"} - ${material.KichThuocS_Max || "N/A"} mm</td>
                        <td>${material.DoRanMin || "N/A"} - ${material.DoRanMax || "N/A"}</td>
                        <td>${material.GioiHanBenMin || "N/A"} - ${material.GioiHanBenMax || "N/A"} MPa</td>
                        <td>${material.GioiHanChay || "N/A"} MPa</td>
                        <td class="text-center">
                            <input type="radio" name="selectedMaterial" value="${index}" data-material='${JSON.stringify(material)}' ${index === 0 ? "checked" : ""}>
                        </td>
                    </tr>
                `);
    
                tableBody.append(row);
            });
    
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu vật liệu:", error);
        }
    }
    
    // Gọi hàm khi trang tải xong
    $(document).ready(loadBevelGear1Materials);
    

    function getValueByName(name) {
        let item = calculationResultsChap2.find((e) => e.name === name);
        return item ? parseFloat(item.data) : null;
    }
    
    async function calculateBoardValues() {
        let ηbrcon = getValueByName("ηbrcon");
        let ηbrtru = getValueByName("ηbrtru");
        let ηx = getValueByName("ηx");
        let ηol = getValueByName("ηol");
        let Pct = getValueByName("Pct");
        let u1 = getValueByName("u1");
        let u2 = getValueByName("u2");
        let ux = getValueByName("ux");
        
        if ([ηbrcon, ηbrtru, ηx, ηol, Pct, u1, u2, ux].includes(null)) {
            console.error("Thiếu thông số cần thiết!");
            return null;
        }
        
        // Tính toán công suất P
        let P3 = Pct / (ηx * ηol);
        let P2 = P3 / (ηbrtru * ηol);
        let P1 = P2 / (ηbrcon * ηol);
        let Pdc = P1 / ηol;
        
        if (Pdc < Pct) {
            console.log("Số liệu không hợp lệ");
            return null;
        }
        
        // Lấy dữ liệu động cơ từ API
        const response = await fetch("api.php?action=getEngineData");
        const data = await response.json();
        if (!data.success) {
            console.error("Không thể lấy dữ liệu động cơ:", data.message);
            return null;
        }
        
        const engineData = data.engines;
        let selectedEngineEntry = calculationResultsChap2.find(item => item.name === "Loại động cơ");
        if (!selectedEngineEntry) {
            console.error("Không tìm thấy tên động cơ trong calculationResultsChap2.");
            return null;
        }
        
        let selectedEngine = selectedEngineEntry.data;
        let engine = engineData.find(item => item.kieu_dong_co === selectedEngine);
        if (!engine) {
            console.error("Không tìm thấy dữ liệu động cơ trong database.");
            return null;
        }
        
        let ndc = parseFloat(engine.van_toc_50Hz);
        if (!ndc) {
            console.error("Không tìm thấy dữ liệu tốc độ cho động cơ:", selectedEngine);
            return null;
        }
        
        // Tính toán số vòng quay n
        let ukn = 1;
        let n1 = ndc;
        let n2 = n1 / u1;
        let n3 = n2 / u2;
        
        // Tính toán mô-men xoắn T
        const torqueFactor = 9.55 * Math.pow(10, 6);
        let Tdc = torqueFactor * (Pdc / ndc);
        let T1 = torqueFactor * (P1 / n1);
        let T2 = torqueFactor * (P2 / n2);
        let T3 = torqueFactor * (P3 / n3);
        let T = torqueFactor * (parseFloat(P) / n);
        
        return { Pdc, P1, P2, P3, ndc, n1, n2, n3, ukn, u1, u2, ux, Tdc, T1, T2, T3, T };
    }    

    async function populateBoardTable() {
        const boardTable = document.getElementById("boardTable");
        const rowTemplate = document.getElementById("boardRowTemplate");
        const rowTemplateFiveCols = document.getElementById("boardRowTemplateFiveCols");

        boardTable.innerHTML = "";

        let values = await calculateBoardValues();

        if (!values) return;

        // Tạo hàng cho giá trị P (Công suất)
        const powerRow = rowTemplate.content.cloneNode(true);
        powerRow.querySelector(".data-label").textContent = "Công suất (kW)";
        powerRow.querySelector(".data-value-engine").textContent = values.Pdc.toFixed(4);
        powerRow.querySelector(".data-value-truc1").textContent = values.P1.toFixed(4);
        powerRow.querySelector(".data-value-truc2").textContent = values.P2.toFixed(4);
        powerRow.querySelector(".data-value-truc3").textContent = values.P3.toFixed(4);
        powerRow.querySelector(".data-value-load").textContent = parseFloat(P).toFixed(4);
        boardTable.appendChild(powerRow);

        // Tạo hàng cho số vòng quay (n)
        const speedRow = rowTemplate.content.cloneNode(true);
        speedRow.querySelector(".data-label").textContent = "Số vòng quay (vg/ph)";
        speedRow.querySelector(".data-value-engine").textContent = values.ndc.toFixed(0);
        speedRow.querySelector(".data-value-truc1").textContent = values.n1.toFixed(0);
        speedRow.querySelector(".data-value-truc2").textContent = values.n2.toFixed(4);
        speedRow.querySelector(".data-value-truc3").textContent = values.n3.toFixed(4);
        speedRow.querySelector(".data-value-load").textContent = n;
        boardTable.appendChild(speedRow);

        // Tạo hàng cho tỷ số truyền (u)
        const transRow = rowTemplateFiveCols.content.cloneNode(true);
        transRow.querySelector(".data-label").textContent = "Tỷ số truyền (u)";
        transRow.querySelector(".data-value-engine").textContent = values.ukn.toFixed(0);
        transRow.querySelector(".data-value-truc1").textContent = values.u1.toFixed(4);
        transRow.querySelector(".data-value-truc2").textContent = values.u2.toFixed(4);
        transRow.querySelector(".data-value-truc3").textContent = values.ux.toFixed(0);
        boardTable.appendChild(transRow);

        // Tạo hàng cho mô-men xoắn (T)
        const torqueRow = rowTemplate.content.cloneNode(true);
        torqueRow.querySelector(".data-label").textContent = "Mô-men xoắn (N.mm)";
        torqueRow.querySelector(".data-value-engine").textContent = values.Tdc.toFixed(2);
        torqueRow.querySelector(".data-value-truc1").textContent = values.T1.toFixed(2);
        torqueRow.querySelector(".data-value-truc2").textContent = values.T2.toFixed(2);
        torqueRow.querySelector(".data-value-truc3").textContent = values.T3.toFixed(2);
        torqueRow.querySelector(".data-value-load").textContent = values.T.toFixed(2);
        boardTable.appendChild(torqueRow);
    }

    document.getElementById("boardModel").addEventListener("click", () => {
        populateBoardTable();
        new bootstrap.Modal(document.getElementById("boardModal")).show();
    });
    

    $("#nextStep").click(function () {
        calculateSystemEfficiency();
        calculatePreliminaryRPM();
        loadSuitableEngines();
        redistributeTransmissionRatio();
        showStep(++currentStep);
        localStorage.setItem("lastStep", currentStep);
    });

    $("#prevStep").on("click", function () {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
    
    function showStep(step) {
        $(".calculation-step").addClass("d-none");
        $("#step" + step).removeClass("d-none");
        $("#prevStep").prop("disabled", step === 1);
    }

    document.getElementById("autoCalculationBtn").addEventListener("click", function() {
        this.classList.toggle("active");
    });
    
});

