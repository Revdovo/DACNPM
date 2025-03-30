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
        let num2 = parseInt(formData.get("num2"));
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
        let $calculationModal = $("#calculationModal");
    
        if ($("#autoCalculationBtn").hasClass("active")) {
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
            await loadBevelGear1Materials();
    
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            $calculationModal.find(".modal-title").text("Hoàn thành");
            $calculationModal.find(".modal-body").html("<div class='text-center py-4'><h5>Tính toán hoàn tất!</h5><i class='text-success fs-1 bi bi-check-circle'></i></div>");
            $calculationModal.find(".modal-footer").html('<button class="btn btn-success" data-bs-dismiss="modal">Đóng</button>').show();
    
            return;
        } else {
            $calculationModal.find(".modal-title").text("Tính Toán Hệ Thống");
            $calculationModal.find(".modal-body").html($("#originalModalContent").html());
            $calculationModal.find(".modal-footer").show();
    
            currentStep = 1;
            $calculationModal.modal("show");
            showStep(currentStep);
    
            await loadEfficiencyData();
            await loadTransmissionRatios();
            await loadTriSoViTriBanhRang();
            await loadBevelGear1Materials();
        }
    });
    

    //Chap2: Lựa chọn động cơ điện

    async function loadEfficiencyData() {
        try {
            const response = await fetch("api.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ action: "get_efficiency" }),
            });
    
            const data = await response.json();
            if (!data.success) {
                console.error("Lỗi khi lấy dữ liệu hiệu suất:", data.message);
                return;
            }
    
            let efficiencyList = data.data;
            let tableBody = document.getElementById("efficiencyTable");
            let selectedTypes = ["Bộ truyền bánh răng trụ", "Bộ truyền bánh răng côn", "Bộ truyền xích", "Một cặp ổ lăn"];
            let autoMode = document.getElementById("autoCalculationBtn").classList.contains("active");
    
            let tableContent = "";
    
            for (const item of efficiencyList) {
                if (selectedTypes.includes(item.TenGoi)) {
                    let minValue = item.HieuSuatDuoccheMin ?? 0;
                    let maxValue = item.HieuSuatDuoccheMax ?? 1;
                    let defaultValue = (parseFloat(minValue) + parseFloat(maxValue)) / 2;
    
                    if (autoMode) {
                        await setEfficiencyValue(item.TenGoi, defaultValue);
                    } else {
                        tableContent += `
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
                        `;
                    }
                }
            }
    
            if (!autoMode) {
                tableBody.innerHTML = tableContent;
    
                document.querySelectorAll(".efficiency-mode").forEach(select => {
                    select.addEventListener("change", function () {
                        let selected = this.options[this.selectedIndex];
                        let row = this.closest("tr");
                        let minValue = selected.dataset.min ?? 0;
                        let maxValue = selected.dataset.max ?? 1;
                        let defaultValue = (parseFloat(minValue) + parseFloat(maxValue)) / 2;
    
                        let slider = row.querySelector(".efficiency-slider");
                        let valueDisplay = row.querySelector(".efficiency-value");
    
                        slider.min = minValue;
                        slider.max = maxValue;
                        slider.value = defaultValue;
                        valueDisplay.textContent = defaultValue.toFixed(3);
                    });
                });
    
                document.querySelectorAll(".efficiency-slider").forEach(slider => {
                    slider.addEventListener("input", function () {
                        this.closest("tr").querySelector(".efficiency-value").textContent = parseFloat(this.value).toFixed(3);
                    });
                });
            }
        } catch (error) {
            console.error("Lỗi khi kết nối server:", error);
        }
    }     
    
    async function setEfficiencyValue(type, value) {
        const efficiencyNames = {
            "Một cặp ổ lăn": "ηol",
            "Bộ truyền bánh răng côn": "ηbrcon",
            "Bộ truyền bánh răng trụ": "ηbrtru",
            "Bộ truyền xích": "ηx"
        };
    
        if (type === "Một cặp ổ lăn") {
            value = Math.pow(value, 3);
        }
    
        let shortName = efficiencyNames[type] || "η";
        
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
    
            if (isAuto && suitableEngines.length > 0) {
                let selectedEngine = suitableEngines[0];
                updateSelectedEngine(selectedEngine);
            }
    
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
    
            let isAuto = $("#autoCalculationBtn").hasClass("active"); 
    
            let parameters = [
                { name: "ψba", min: parseFloat(psiBa.DoRanMatRang_Min1), max: parseFloat(psiBa.DoRanMatRang_Max1), step: 0.01 },
                { name: "ψbdmax", min: parseFloat(psiBdmax.DoRanMatRang_Min1), max: parseFloat(psiBdmax.DoRanMatRang_Max1), step: 0.01 },
                { name: "Kbe", min: 0.25, max: 0.3, step: 0.01 },
                { name: "Ck", min: 1.0, max: 1.1, step: 0.01 }
            ];
    
            if (isAuto) {
                parameters.forEach(param => {
                    let autoValue = ((param.min + param.max) / 2).toFixed(3);
                    updateTriSoCalculation(param.name, autoValue);
                });
                return;
            }
    
            let tableBody = document.getElementById("TriSoVitriBanhRangTableBody");
            tableBody.innerHTML = "";
    
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
    const HRCtoHBTable = {
        35: 325, 38: 355, 40: 375, 42: 395, 45: 425,
        48: 460, 50: 482, 53: 520, 55: 542, 60: 605
    };
    
    function convertHardness(value) {
        if (typeof value === "string") {
            value = value.trim().toUpperCase(); // Chuẩn hóa về chữ hoa
            if (value.startsWith("HB")) {
                return parseFloat(value.replace("HB", "").trim()); // Bỏ tiền tố "HB"
            } else if (value.startsWith("HRC")) {
                let hrcValue = parseInt(value.replace("HRC", "").trim());
                return HRCtoHBTable[hrcValue] || null; // Đổi HRC -> HB nếu có trong bảng
            }
        }
        return parseFloat(value) || null; // Trả về số nếu hợp lệ
    }
    
    function getMiddleValue(min, max, isHardness = false) {
        if (isHardness) {
            // Xử lý riêng nếu là độ cứng (HB/HRC)
            let minValue = convertHardness(min);
            let maxValue = convertHardness(max);
    
            if (minValue !== null && maxValue !== null) {
                return ((minValue + maxValue) / 2).toFixed(1);
            } else if (minValue !== null) {
                return minValue.toFixed(1);
            }
            return null;
        } else {
            // Xử lý thông thường với số
            let minValue = min !== null ? parseFloat(min) : null;
            let maxValue = max !== null ? parseFloat(max) : null;
    
            if (minValue !== null && maxValue !== null) {
                return ((minValue + maxValue) / 2).toFixed(1);
            } else if (minValue !== null) {
                return minValue.toFixed(1);
            }
            return "N/A";
        }
    }
    
    
    
    async function loadBevelGear1Materials() {
        try {
            const response = await fetch("api.php?action=getGearMaterialData");
            const data = await response.json();
    
            if (!data.success || !Array.isArray(data.materials)) {
                console.error("Lỗi dữ liệu vật liệu:", data.message || "Dữ liệu không hợp lệ.");
                return;
            }
    
            const materials = data.materials;
            let autoMode = $("#autoCalculationBtn").hasClass("active");
            let tableBody = $("#bevelGearMaterial");
    
            if (!autoMode) tableBody.empty();
    
            let selectedDrivenMaterial = null;
            let selectedLeadMaterial = null;
    
            // Chọn vật liệu bị dẫn (có độ cứng HB thấp nhất)
            materials.forEach(material => {
                let HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                
                if (HB !== "N/A" && HB != null) {
                    if (!selectedDrivenMaterial || HB < selectedDrivenMaterial.HB) {
                        selectedDrivenMaterial = { ...material, HB: parseFloat(HB) };
                        console.log(HB)
                    }
                }
            });
    
            // Chọn vật liệu dẫn (HB cao hơn từ 10 - 15 so với vật liệu bị dẫn)
            materials.forEach(material => {
                let HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                if (HB !== "N/A" && selectedDrivenMaterial) {
                    let HBNum = parseFloat(HB);
                    if (HBNum >= selectedDrivenMaterial.HB + 10 && HBNum <= selectedDrivenMaterial.HB + 15) {
                        selectedLeadMaterial = { ...material, HB: HBNum };
                    }
                }
            });
    
            // Nếu không tìm thấy, chọn vật liệu có HB cao nhất
            if (!selectedLeadMaterial) {
                selectedLeadMaterial = materials.reduce((max, material) => {
                    let HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                    let HBNum = HB !== "N/A" ? parseFloat(HB) : -Infinity;
                    return HBNum > (max?.HB || -Infinity) ? { ...material, HB: HBNum } : max;
                }, null);
            }
    
            if (autoMode) {
                let leadGearResults = [
                    { name: "Vật liệu bánh răng dẫn răng côn", data: selectedLeadMaterial.NhanHieuThep },
                    { name: "Nhiệt luyện bánh răng dẫn răng côn", data: selectedLeadMaterial.NhietLuyen },
                    { name: "Kích thước bánh răng dẫn răng côn", data: getMiddleValue(selectedLeadMaterial.KichThuocS_Min, selectedLeadMaterial.KichThuocS_Max) + " mm" },
                    { name: "Giới hạn bền bánh răng dẫn răng côn", data: getMiddleValue(selectedLeadMaterial.GioiHanBenMin, selectedLeadMaterial.GioiHanBenMax) + " MPa" },
                    { name: "Giới hạn chảy bánh răng dẫn răng côn", data: (selectedLeadMaterial.GioiHanChay || "N/A") + " MPa" },
                    { name: "Độ cứng HB bánh răng dẫn răng côn", data: selectedLeadMaterial.HB }
                ];
                
                let drivenGearResults = [
                    { name: "Vật liệu bánh răng bị dẫn răng côn", data: selectedDrivenMaterial.NhanHieuThep },
                    { name: "Nhiệt luyện bánh răng bị dẫn răng côn", data: selectedDrivenMaterial.NhietLuyen },
                    { name: "Kích thước bánh răng bị dẫn răng côn", data: getMiddleValue(selectedDrivenMaterial.KichThuocS_Min, selectedDrivenMaterial.KichThuocS_Max) + " mm" },
                    { name: "Giới hạn bền bánh răng bị dẫn răng côn", data: getMiddleValue(selectedDrivenMaterial.GioiHanBenMin, selectedDrivenMaterial.GioiHanBenMax) + " MPa" },
                    { name: "Giới hạn chảy bánh răng bị dẫn răng côn", data: (selectedDrivenMaterial.GioiHanChay || "N/A") + " MPa" },
                    { name: "Độ cứng HB bánh răng bị dẫn răng côn", data: selectedDrivenMaterial.HB }
                ];
                
                // Tính toán thông số bổ sung
                let σHlim1 = 2 * selectedLeadMaterial.HB + 70;
                let σHlim2 = 2 * selectedDrivenMaterial.HB + 70;
                let σFlim1 = 1.8 * selectedLeadMaterial.HB;
                let σFlim2 = 1.8 * selectedDrivenMaterial.HB;
                let Sh = 1.1;
                let Sf = 1.75;

                let values = await calculateBoardValues();

                let NHO1 = 30 * Math.pow(selectedLeadMaterial.HB, 2.4);
                let NHO2 = 30 * Math.pow(selectedDrivenMaterial.HB, 2.4);
                let NFO = 4 * Math.pow(10, 6);
                let NHE1 = 60 * values.n1 * 1 * L * 300 * 2 * 8;
                let NFE1 = NHE1;
                let NHE2 = NHE1 / values.u1;
                let NFE2 = NHE2;
                let KHL1 = Math.pow(NHO1 / NHE1, 1/6);
                let KHL2 = Math.pow(NHO2 / NHE2, 1/6);
                if(NHE1 > NHO1 && NHE2 > NHO2){
                    KHL1 = 1;
                    KHL2 = 1;
                }
                let KFL1 = Math.pow(NFO / NFE1, 1/6);
                let KFL2 = Math.pow(NFO / NFE2, 1/6);
                if(NFE1 > NFO && NFE2 > NFO){
                    KFL1 = 1;
                    KFL2 = 1;
                }
                let σH1 = σHlim1 * (1 / Sh);
                let σH2 = σHlim2 * (1 / Sh);
                let σH = Math.min(σH1, σH2);
                let σHMax1 = 2.8 * selectedLeadMaterial.GioiHanChay;
                let σHMax2 = 2.8 * selectedDrivenMaterial.GioiHanChay;
                let σF1 = σFlim1 * (KFL1 / Sf);
                let σF2 = σFlim2 * (KFL2 / Sf);
                let σFMax1 = 0.8 * selectedLeadMaterial.GioiHanChay;
                let σFMax2 = 0.8 * selectedDrivenMaterial.GioiHanChay;
            
                let kbe = parseFloat(calculationResultsChap2.find(item => item.name === "Kbe")?.data);
                let x = (kbe * values.u1) / (2 - kbe);
                let KHβ, KFβ;  // Khai báo biến

                if (x < 0.2) {
                    if (selectedLeadMaterial.HB > 350) {
                        KHβ = 1.08;
                        KFβ = 1.15;
                    } else { // HB <= 350
                        KHβ = 1.04;
                        KFβ = 1.08;
                    }
                } else if (x < 0.4) { // 0.2 < x < 0.4
                    if (selectedLeadMaterial.HB > 350) {
                        KHβ = 1.20;
                        KFβ = 1.30;
                    } else {
                        KHβ = 1.08;
                        KFβ = 1.15;
                    }
                } else if (x < 0.6) { // 0.4 < x < 0.6
                    if (selectedLeadMaterial.HB > 350) {
                        KHβ = 1.32;
                        KFβ = 1.48;
                    } else {
                        KHβ = 1.13;
                        KFβ = 1.25;
                    }
                } else if (x < 0.8) { // 0.6 < x < 0.8
                    if (selectedLeadMaterial.HB > 350) {
                        KHβ = 1.44;
                        KFβ = 1.67;
                    } else {
                        KHβ = 1.18;
                        KFβ = 1.35;
                    }
                } else { // 0.8 < x < 1
                    if (selectedLeadMaterial.HB > 350) {
                        KHβ = null;
                        KFβ = 1.90;
                    } else {
                        KHβ = null;
                        KFβ = 1.45
                    }
                }
                
                let Re = 50 * Math.pow(Math.pow(values.u1, 2) + 1 , 1/2) * Math.pow((values.T1 * KHβ) / ((1 - kbe) * kbe * values.u1 * Math.pow(σH, 2)) , 1/3);
                let de1 = 100 * Math.pow((values.T1 * KHβ) / ((1 - kbe) * kbe * values.u1 * Math.pow(σH, 2)) , 1/3);

                let z1p;

                if (values.u1 <= 1) {
                    if (de1 < 40) {
                        z1p = 24;
                    } else if (de1 >= 40 && de1 < 60) {
                        z1p = 24;
                    } else if (de1 >= 60 && de1 < 80) {
                        z1p = 25;
                    } else if (de1 >= 80 && de1 < 100) {
                        z1p = 25;
                    } else if (de1 >= 100 && de1 < 125) {
                        z1p = 26;
                    } else if (de1 >= 125 && de1 < 160) {
                        z1p = 27;
                    } else {
                        z1p = 30;
                    }
                } else if (values.u1 <= 2) {
                    if (de1 < 40) {
                        z1p = 20;
                    } else if (de1 >= 40 && de1 < 60) {
                        z1p = 20;
                    } else if (de1 >= 60 && de1 < 80) {
                        z1p = 21;
                    } else if (de1 >= 80 && de1 < 100) {
                        z1p = 21;
                    } else if (de1 >= 100 && de1 < 125) {
                        z1p = 22;
                    } else if (de1 >= 125 && de1 < 160) {
                        z1p = 24;
                    } else {
                        z1p = 28;
                    }
                } else if (values.u1 <= 3.15) {
                    if (de1 < 40) {
                        z1p = 18;
                    } else if (de1 >= 40 && de1 < 60) {
                        z1p = 18;
                    } else if (de1 >= 60 && de1 < 80) {
                        z1p = 19;
                    } else if (de1 >= 80 && de1 < 100) {
                        z1p = 19;
                    } else if (de1 >= 100 && de1 < 125) {
                        z1p = 20;
                    } else if (de1 >= 125 && de1 < 160) {
                        z1p = 22;
                    } else {
                        z1p = 27;
                    }
                } else if (values.u1 <= 4) {
                    if (de1 < 40) {
                        z1p = 16;
                    } else if (de1 >= 40 && de1 < 60) {
                        z1p = 16;
                    } else if (de1 >= 60 && de1 < 80) {
                        z1p = 17;
                    } else if (de1 >= 80 && de1 < 100) {
                        z1p = 17;
                    } else if (de1 >= 100 && de1 < 125) {
                        z1p = 18;
                    } else if (de1 >= 125 && de1 < 160) {
                        z1p = 21;
                    } else {
                        z1p = 24;
                    }
                } else {
                    if (de1 < 40) {
                        z1p = 15;
                    } else if (de1 >= 40 && de1 < 60) {
                        z1p = 15;
                    } else if (de1 >= 60 && de1 < 80) {
                        z1p = 16;
                    } else if (de1 >= 80 && de1 < 100) {
                        z1p = 16;
                    } else if (de1 >= 100 && de1 < 125) {
                        z1p = 17;
                    } else if (de1 >= 125 && de1 < 160) {
                        z1p = 18;
                    } else {
                        z1p = 22;
                    }
                    
                }

                let z1 = (1.6 * z1p).toFixed(0);
                let dm1 = (1 - 0.5 * kbe) * de1;
                let mtm = dm1/z1;

                let standardValues = [1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12]; // Dãy giá trị chuẩn
                let mte = mtm / (1 - 0.5 * kbe);
                
                let roundedMte = standardValues.reduce((prev, curr) => 
                    Math.abs(curr - mte) < Math.abs(prev - mte) ? curr : prev
                );

                mte = roundedMte;
                mtm = mte * (1 - 0.5 * kbe);
                dm1 = z1 * mtm;

                let z2 = (parseInt(z1) * values.u1).toFixed(0);

                let newu1 = parseInt(z2) / parseInt(z1);

                let existingEntry = calculationResultsChap2.find(entry => entry.name === "u1");
                if (existingEntry) {
                    existingEntry.data = newu1;
                } else {
                    calculationResultsChap2.push({ name: "u1", data: newu1 });
                }

                let δ1 = Math.atan(parseInt(z1) / parseInt(z2));
                let δ2 = 90 - δ1;

                let otherResults = [
                    { name: "σHlim1", data: σHlim1.toFixed(4) },
                    { name: "σHlim2", data: σHlim2.toFixed(4) },
                    { name: "σFlim1", data: σFlim1.toFixed(4) },
                    { name: "σFlim2", data: σFlim2.toFixed(4) },
                    { name: "Sh", data: Sh.toFixed(4) },
                    { name: "Sf", data: Sf.toFixed(4) },
                    { name: "NHO1", data: NHO1.toFixed(4) },
                    { name: "NHO2", data: NHO2.toFixed(4) },
                    { name: "NFO", data: NFO.toFixed(4) },
                    { name: "NHE1", data: NHE1.toFixed(4) },
                    { name: "NFE1", data: NFE1.toFixed(4) },
                    { name: "NHE2", data: NHE2.toFixed(4) },
                    { name: "NFE2", data: NFE2.toFixed(4) },
                    { name: "KHL1", data: KHL1.toFixed(4) },
                    { name: "KHL2", data: KHL2.toFixed(4) },
                    { name: "KFL1", data: KFL1.toFixed(4) },
                    { name: "KFL2", data: KFL2.toFixed(4) },
                    { name: "σH1", data: σH1.toFixed(4) },
                    { name: "σH2", data: σH2.toFixed(4) },
                    { name: "σH", data: σH.toFixed(4) },
                    { name: "σHMax1", data: σHMax1.toFixed(4) },
                    { name: "σHMax2", data: σHMax2.toFixed(4) },
                    { name: "σF1", data: σF1.toFixed(4) },
                    { name: "σF2", data: σF2.toFixed(4) },
                    { name: "σFMax1", data: σFMax1.toFixed(4) },
                    { name: "σFMax2", data: σFMax2.toFixed(4) },
                    { name: "KHβ", data: KHβ.toFixed(4) },
                    { name: "KFβ", data: KFβ.toFixed(4) },
                    { name: "Re", data: Re.toFixed(4) },
                    { name: "de1", data: de1.toFixed(4) },
                    { name: "dm1", data: dm1.toFixed(4) },
                    { name: "mte", data: mte.toFixed(4) },
                    { name: "mtm", data: mtm.toFixed(4) },
                    { name: "z1", data: z1},
                    { name: "z2", data: z2},
                    { name: "δ1", data: δ1.toFixed(4)},
                    { name: "δ2", data: δ2.toFixed(4)},
                ];                

                let Re1 = 0.5 * mte * Math.pow(Math.pow(parseInt(z1) , 2) + Math.pow(parseInt(z2) , 2) , 1/2);
                let Re2 = Re1;
                let b1 = kbe * Re1;
                let b2 = b1;
                let Rm1 = Re1 - 0.5 * b1;
                let Rm2 = Rm1;
                let de1a = mte * z1;
                let de1b = mte * z2;
                let he1 = 2.2 * mte;
                let he2 = he1;
                let ha1 = mte;
                let ha2 = mte;
                let hf1 = he1 - ha1;
                let hf2 = he2 - ha2;
                let B1 = Re1 * Math.cos(δ1) - ha1 * Math.sin(δ1);
                let B2 = Re2 * Math.cos(δ2) - ha2 * Math.sin(δ2);
                let da1 = de1a + 2 * ha1 * Math.cos(δ1);
                let da2 = de1b + 2 * ha2 * Math.cos(δ2);
                let dm2 = dm1 * newu1;
                let θf1 = Math.atan(hf1 / Re1);
                let θf2 = Math.atan(hf2 / Re2);
                let δa1 = δ1 + θf1;
                let δa2 = δ2 + θf2;
                let δf1 = δ1 - θf1;
                let δf2 = δ2 - θf2;

                leadGearResults = [
                    ...leadGearResults,
                    { name: "Chiều dài côn ngoài", data: Re1.toFixed(4) },
                    { name: "Chiều rộng vành răng", data: b1.toFixed(4) },
                    { name: "Chiều dài côn trung bình", data: Rm1.toFixed(4) },
                    { name: "Đường kính vòng chia ngoài", data: de1a.toFixed(4) },
                    { name: "Góc mặt côn chia", data: δ1.toFixed(4) },
                    { name: "Chiều cao răng ngoài", data: he1.toFixed(4) },
                    { name: "Chiều cao đầu răng ngoài", data: ha1.toFixed(4) },
                    { name: "Chiều cao chân răng ngoài", data: hf1.toFixed(4) },
                    { name: "Khoảng cách từ đỉnh côn đền mặt phẳng vòng ngoài đỉnh răng", data: B1.toFixed(4) },
                    { name: "Đường kính đỉnh răng ngoài", data: da1.toFixed(4) },
                    { name: "Đường kính trung bình", data: dm1.toFixed(4) },
                    { name: "Góc chân răng", data: θf1.toFixed(4) },
                    { name: "Góc côn đỉnh", data: δa1.toFixed(4) },
                    { name: "Góc côn đáy", data: δf1.toFixed(4) }
                ];

                drivenGearResults = [
                    ...drivenGearResults,
                    { name: "Chiều dài côn ngoài", data: Re2.toFixed(4) },
                    { name: "Chiều rộng vành răng", data: b2.toFixed(4) },
                    { name: "Chiều dài côn trung bình", data: Rm2.toFixed(4) },
                    { name: "Đường kính vòng chia ngoài", data: de1b.toFixed(4) },
                    { name: "Góc mặt côn chia", data: δ2.toFixed(4) },
                    { name: "Chiều cao răng ngoài", data: he2.toFixed(4) },
                    { name: "Chiều cao đầu răng ngoài", data: ha2.toFixed(4) },
                    { name: "Chiều cao chân răng ngoài", data: hf2.toFixed(4) },
                    { name: "Khoảng cách từ đỉnh côn đền mặt phẳng vòng ngoài đỉnh răng", data: B2.toFixed(4) },
                    { name: "Đường kính đỉnh răng ngoài", data: da2.toFixed(4) },
                    { name: "Đường kính trung bình", data: dm2.toFixed(4) },
                    { name: "Góc chân răng", data: θf2.toFixed(4) },
                    { name: "Góc côn đỉnh", data: δa2.toFixed(4) },
                    { name: "Góc côn đáy", data: δf2.toFixed(4) }
                ]
            
                // Kết hợp tất cả vào calculationResultsChap3
                calculationResultsChap3 = [leadGearResults, drivenGearResults, otherResults];
        
                // Hiển thị kết quả
                displayResultsChap3();
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu vật liệu:", error);
        }
    }

    function displayResultsChap3() {
        let secondColumn = document.querySelector(".result-col:nth-child(2)");
        secondColumn.innerHTML = "";
    
        // Nối hai mảng con để tạo một mảng phẳng
        let flatResults = [...calculationResultsChap3[0], ...calculationResultsChap3[1], ...calculationResultsChap3[2]]; 
    
        let leadGearResults = flatResults.slice(0, 20); // 6 mục đầu tiên (bánh răng dẫn)
        let drivenGearResults = flatResults.slice(20, 40); // 6 mục tiếp theo (bánh răng bị dẫn)
        let otherResults = flatResults.slice(40); // Các mục còn lại hiển thị bình thường
        
        // Hiển thị bánh răng dẫn với tooltip
        let leadGearItem = `
            <div class="p-2 border material-item">
                <strong>Bánh răng côn (dẫn)</strong>
                <div class="tooltip">
                    <table>
                        ${leadGearResults.map(result => `<tr><td><strong>${result.name}</strong></td><td>${result.data}</td></tr>`).join("")}
                    </table>
                </div>
            </div>
        `;
        secondColumn.innerHTML += leadGearItem;
    
        // Hiển thị bánh răng bị dẫn với tooltip
        let drivenGearItem = `
            <div class="p-2 border material-item">
                <strong>Bánh răng côn (bị dẫn)</strong>
                <div class="tooltip">
                    <table>
                        ${drivenGearResults.map(result => `<tr><td><strong>${result.name}</strong></td><td>${result.data}</td></tr>`).join("")}
                    </table>
                </div>
            </div>
        `;
        secondColumn.innerHTML += drivenGearItem;
    
        // Hiển thị các thông số còn lại bình thường
        otherResults.forEach(result => {
            let resultItem = `
                <div class="p-2 border">
                    <strong>${result.name}</strong>: ${result.data}
                </div>
            `;
            secondColumn.innerHTML += resultItem;
        });
    }       
    
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
        transRow.querySelector(".data-value-truc3").textContent = values.ux.toFixed(4);
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

    document.getElementById("exportPdf").addEventListener("click", function () {
        exportToPDF();
    });
    
    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Tiêu đề
        doc.setFontSize(16);
        doc.text("Thông số tính toán cho lựa chọn động cơ", 10, 10);
    
        // Xử lý các giá trị cần tính toán
        let etaBrCon = parseFloat(calculationResultsChap2.find(item => item.name === 'ηbrcon')?.data || 1);
        let etaBrTru = parseFloat(calculationResultsChap2.find(item => item.name === 'ηbrtru')?.data || 1);
        let etaX = parseFloat(calculationResultsChap2.find(item => item.name === 'ηx')?.data || 1);
        let etaOl = parseFloat(calculationResultsChap2.find(item => item.name === 'ηol')?.data || 1);
        let etaKn = 1;
    
        let etaHe = etaBrCon * etaBrTru * etaX * Math.pow(etaOl, 3) * etaKn;
        let Pct = parseFloat(P) / etaHe;
    
        // Hiển thị danh sách dữ liệu
        let y = 20;
        doc.setFontSize(12);
        calculationResultsChap2.forEach((item) => {
            if (item.name === 'η hệ') {
                doc.text(`${item.name}: ${etaHe.toFixed(3)}`, 10, y);
            } else if (item.name === 'Pct') {
                doc.text(`${item.name}: ${Pct.toFixed(3)}`, 10, y);
            } else {
                doc.text(`${item.name}: ${item.data}`, 10, y);
            }
            y += 7;
        });
    
        // Xuất file PDF
        doc.save("thong_so_tinh_toan.pdf");
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

