let P, n, L;

document.addEventListener("DOMContentLoaded", function () {
    const workspaceCodeDisplay = document.getElementById("workspaceCodeDisplay");
    const workspaceStatus = document.getElementById("workspaceStatus");
    const calculationForm = document.getElementById("calculationForm");
    const inputs = document.querySelectorAll("input[type='number']");
    
    const urlParams = new URLSearchParams(window.location.search);
    const workspaceCode = urlParams.get("code") || "default123";

    workspaceCodeDisplay.value = workspaceCode;

    let currentStep = 0;
    //let currentStep = localStorage.getItem("lastStep") ? parseInt(localStorage.getItem("lastStep")) : 1;
    let calculationResultsChap2 = [];
    let calculationResultsChap31 = [];
    let calculationResultsChap32 = [];
    let calculationResultsChap33 = [];

    displayResultsChap2();
    displayResultsChap31();
    displayResultsChap32();
    displayResultsChap33();
    displayResultsChap4();

    //Task 1 - date complete: 7/3
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

    inputs.forEach(input => {
        input.addEventListener("input", function () {
            if (!/^\d*\.?\d*$/.test(this.value)) {
                this.value = this.value.replace(/[^0-9.]/g, '');
            }
        });
    });

    calculationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(calculationForm);
        let num1 = parseFloat(formData.get("num1"));
        let num2 = parseInt(formData.get("num2"));
        let num3 = parseFloat(formData.get("num3"));
    
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

    //function cho nut tinh toan (cap nhat design pattern - 27/4)
    $("#manualCalculationBtn").click(async function () {
        let $calculationModal = $("#calculationModal");
    
        if ($("#autoCalculationBtn").hasClass("active")) {
            $calculationModal.find(".modal-title").text("Tính toán tự động");
            $calculationModal.find(".modal-body").html("<div class='text-center py-4'><h5>Đang tính toán tự động...</h5><div class='spinner-border text-primary' role='status'></div></div>");
            $calculationModal.find(".modal-footer").hide();
            $calculationModal.modal("show");
    
            await loadEfficiencyData();
            await calculateSystemEfficiency();
            await loadTransmissionRatios();
            await calculatePreliminaryRPM();
            await loadSuitableEngines();
            await loadTriSoViTriBanhRang();
            await redistributeTransmissionRatio();
            await loadBevelGearMaterials();
            await loadShaftGearMaterials();
            await loadChain();
    
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            $calculationModal.find(".modal-title").text("Hoàn thành");
            $calculationModal.find(".modal-body").html("<div class='text-center py-4'><h5>Tính toán hoàn tất!</h5><i class='text-success fs-1 bi bi-check-circle'></i></div>");
            $calculationModal.find(".modal-footer").html('<button class="btn btn-success" data-bs-dismiss="modal">Đóng</button>').show();
    
            return;
        } else {
            $calculationModal.find(".modal-title").text("Tính Toán Hệ Thống");
            $calculationModal.find(".modal-body").html($("#originalModalContent").html());
            $calculationModal.find(".modal-footer").show();
    
            $calculationModal.modal("show");

            if (currentStep > 0) {
                calculationChain.currentStep = 1;
                await calculationChain.nextStep();
            } else {
                await calculationChain.nextStep();
            }
    
            await loadEfficiencyData();
            await loadTransmissionRatios();
            await loadSuitableEngines();
            await loadTriSoViTriBanhRang();
        }
    });

    //task 2.1
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

            const efficiencyNames = {
                "Một cặp ổ lăn": "ηol",
                "Bộ truyền bánh răng côn": "ηbrcon",
                "Bộ truyền bánh răng trụ": "ηbrtru",
                "Bộ truyền xích": "ηx"
            };
        
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

                            let shortName = efficiencyNames[item.TenGoi] || "η";
                            let calculatedValue = item.TenGoi === "Một cặp ổ lăn" ? Math.pow(defaultValue, 3) : defaultValue;
                            calculationResultsChap2.push({ name: shortName, data: calculatedValue.toFixed(3) });
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
                        let row = this.closest("tr");
                        let type = row.querySelector("td:first-child").textContent.trim();
                        let value = parseFloat(this.value);
                        let valueDisplay = row.querySelector(".efficiency-value");

                        valueDisplay.textContent = value.toFixed(3);

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
    
    //task 2.2
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

            const ratioNames = {
                "Truyền động bánh răng côn Hộp giảm tốc côn - trụ 2 cấp": "uhgt",
                "Truyền động Xích": "ux"
            };

            transmissionList.forEach(item => {
                if (selectedTypes.includes(item.LoaiTruyen)) {
                    let minValue = item.TisoTruyenMin ?? 0;
                    let maxValue = item.TisoTruyenMax ?? 1;
                    let defaultValue = (parseFloat(minValue) + parseFloat(maxValue) / 2) / 2;

                    let shortName = ratioNames[item.LoaiTruyen] || "i";

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
                                <td class="selected-value text-center">${defaultValue.toFixed(1)}</td>
                            </tr>
                        `);

                        tableBody.append(row);

                        // ⬇ Thêm giá trị mặc định vào calculationResultsChap2
                        calculationResultsChap2.push({
                            name: shortName,
                            data: defaultValue.toFixed(1)
                        });
                    }
                }
            });

            if (!autoMode) {
                $(".transmission-slider").on("input", function () {
                    let value = parseFloat($(this).val()).toFixed(1);
                    let row = $(this).closest("tr");
                    row.find(".selected-value").text(value);

                    let type = row.find("td:first").text().trim();
                    let shortName = ratioNames[type] || "i";

                    let existingEntry = calculationResultsChap2.find(entry => entry.name === shortName);
                    if (existingEntry) {
                        existingEntry.data = value;
                    } else {
                        calculationResultsChap2.push({ name: shortName, data: value });
                    }
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
    
    //task 2.2 phan lua dong co
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
    
            if (!isAuto && suitableEngines.length > 0) {
                let firstRadio = $("input[name='selectedEngine']").first();
                firstRadio.prop("checked", true).trigger("change");
            }

            let selectedEngine = suitableEngines[0];
            updateSelectedEngine(selectedEngine);
    
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
    
    //task 2.3
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

        Object.values(efficiencyNames).forEach(shortName => {
            let entry = calculationResultsChap2.find(e => e.name === shortName);
            if (entry) {
                let efficiency = parseFloat(entry.data);
                totalEfficiency *= efficiency;
            }
        });
    
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
        name = name.trim().toLowerCase();
        let result = calculationResultsChap2.find(item => item.name.trim().toLowerCase() === name);
        return result ? parseFloat(result.data) : null;
    }

    async function redistributeTransmissionRatio() {
        try {
            const response = await fetch("api.php?action=getEngineData");
            const data = await response.json();

            if (!data.success) {
                console.error("Không thể lấy dữ liệu động cơ:", data.message);
                return;
            }
            
            const engineData = data.engines;

            let selectedEngineEntry = calculationResultsChap2.find(item => item.name === "Loại động cơ");
            if (!selectedEngineEntry) {
                console.error("Không tìm thấy tên động cơ trong calculationResultsChap2.");
                return;
            }

            let selectedEngine = selectedEngineEntry.data;

            let engine = engineData.find(item => item.kieu_dong_co === selectedEngine);
            if (!engine) {
                console.error(`Không tìm thấy động cơ có tên: ${selectedEngine}`);
                return;
            }

            let ndc = parseFloat(engine.van_toc_50Hz);
    
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

    //display ket qua cho 2 (done)
    function displayResultsChap2() {
        const tab1 = document.getElementById("tab1");
    
        const resultSection = tab1.querySelector("div");
        resultSection.innerHTML = "";
        
        if (!calculationResultsChap2 || calculationResultsChap2.length === 0) {
            const noResultsMessage = document.createElement("div");
            noResultsMessage.className = "alert alert-warning";
            noResultsMessage.textContent = "Bạn chưa tính bước này";
            resultSection.appendChild(noResultsMessage);
            return;
        }
    
        const results = calculationResultsChap2;
    
        const hieuSuat = results.slice(0, 4).filter(Boolean);
        if (hieuSuat.length > 0) {
            const hieuSuatTitle = document.createElement("div");
            hieuSuatTitle.className = "fw-bold my-2";
            hieuSuatTitle.textContent = "Hiệu suất mà người dùng lựa chọn";
            resultSection.appendChild(hieuSuatTitle);
    
            const hieuSuatGrid = document.createElement("div");
            hieuSuatGrid.className = "d-grid gap-2 mb-2";
            hieuSuatGrid.style.gridTemplateColumns = "1fr 1fr";
    
            hieuSuat.forEach(item => {
                const div = document.createElement("div");
                div.className = "p-2";
                div.innerHTML = `<strong>${item.name}</strong>: ${item.data}`;
                hieuSuatGrid.appendChild(div);
            });
    
            resultSection.appendChild(hieuSuatGrid);
        }
    
        const createSingleRow = (title, index) => {
            if (results[index]) {
                const titleDiv = document.createElement("div");
                titleDiv.className = "fw-bold mt-3";
                titleDiv.textContent = title;
                resultSection.appendChild(titleDiv);
    
                const valueDiv = document.createElement("div");
                valueDiv.className = "p-2 mb-2 w-100";
                valueDiv.innerHTML = `<strong>${results[index].name}</strong>: ${results[index].data}`;
                resultSection.appendChild(valueDiv);
            }
        };
    
        createSingleRow("Theo đó ta có hiệu suất hệ là:", 4);
        createSingleRow("Công suất hệ tính được là:", 5);
    
        const tySoTruyen = results.slice(6, 8).filter(Boolean);
        if (tySoTruyen.length > 0) {
            const title = document.createElement("div");
            title.className = "fw-bold mt-3";
            title.textContent = "Tỷ số truyền của các bộ truyền do người dùng chọn:";
            resultSection.appendChild(title);
    
            const grid = document.createElement("div");
            grid.className = "d-flex flex-column gap-2";
            tySoTruyen.forEach(item => {
                const div = document.createElement("div");
                div.className = "p-2 w-100";
                div.innerHTML = `<strong>${item.name}</strong>: ${item.data}`;
                grid.appendChild(div);
            });
            resultSection.appendChild(grid);
        }
    
        createSingleRow("Tỷ số truyền sơ bộ tính được:", 8);
        createSingleRow("Số vòng quay sơ bộ tính được:", 9);
        createSingleRow("Loại động cơ được người dùng chọn:", 10);
    
        const chiSoKhac = results.slice(11, 15).filter(Boolean);
        if (chiSoKhac.length > 0) {
            const title = document.createElement("div");
            title.className = "fw-bold my-2";
            title.textContent = "Các chỉ số khác mà người dùng lựa chọn";
            resultSection.appendChild(title);
    
            const grid = document.createElement("div");
            grid.className = "d-grid gap-2 mb-2";
            grid.style.gridTemplateColumns = "1fr 1fr";
    
            chiSoKhac.forEach(item => {
                const div = document.createElement("div");
                div.className = "p-2";
                div.innerHTML = `<strong>${item.name}</strong>: ${item.data}`;
                grid.appendChild(div);
            });
    
            resultSection.appendChild(grid);
        }
    
        createSingleRow("LamdaK được tính ra:", 15);
    
        const conTru = results.slice(16).filter(Boolean);
        if (conTru.length > 0) {
            const title = document.createElement("div");
            title.className = "fw-bold mt-3";
            title.textContent = "Tỉ số truyền sơ bộ của hệ bánh răng côn và trụ lần lượt là:";
            resultSection.appendChild(title);
    
            conTru.forEach(item => {
                const div = document.createElement("div");
                div.className = "p-2 mb-2 w-100";
                div.innerHTML = `<strong>${item.name}</strong>: ${item.data}`;
                resultSection.appendChild(div);
            });
        }
    }        
        
    //Task 3: function chung cho 3.1 & 3.2
    const HRCtoHBTable = {
        35: 325, 38: 355, 40: 375, 42: 395, 45: 425,
        48: 460, 50: 482, 53: 520, 55: 542, 60: 605
    };
    
    function convertHardness(value) {
        if (typeof value === "string") {
            value = value.trim().toUpperCase();
            if (value.startsWith("HB")) {
                return parseFloat(value.replace("HB", "").trim());
            } else if (value.startsWith("HRC")) {
                let hrcValue = parseInt(value.replace("HRC", "").trim());
                return HRCtoHBTable[hrcValue] || null;
            }
        }
        return parseFloat(value) || null;
    }
    
    function getMiddleValue(min, max, isHardness = false) {
        if (isHardness) {
            let minValue = convertHardness(min);
            let maxValue = convertHardness(max);
    
            if (minValue !== null && maxValue !== null) {
                return ((minValue + maxValue) / 2).toFixed(1);
            } else if (minValue !== null) {
                return minValue.toFixed(1);
            }
            return null;
        } else {
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
    
    //Task 3.1
    async function loadBevelGearMaterials() {
        try {
            const response = await fetch("api.php?action=getGearMaterialData");
            const data = await response.json();

            if (!data.success || !Array.isArray(data.materials)) {
                console.error("Lỗi dữ liệu vật liệu:", data.message || "Dữ liệu không hợp lệ.");
                return;
            }

            const materials = data.materials.map((material, index) => ({
                ...material,
                _customId: index + 1,
            }));

            const autoMode = $("#autoCalculationBtn").hasClass("active");
            const tableBody1 = $("#bevelGearMaterial");
            const tableBody2 = $("#bevelGearMaterial2");

            if (!autoMode) {
                tableBody1.empty();
                tableBody2.empty();
            }

            let selectedDrivenMaterial = null;
            let selectedLeadMaterial = null;

            materials.forEach(material => {
                const HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                if (HB !== "N/A" && HB != null) {
                    if (!selectedDrivenMaterial || HB < selectedDrivenMaterial.HB) {
                        selectedDrivenMaterial = { ...material, HB: parseFloat(HB) };
                    }
                }
            });

            materials.forEach(material => {
                const HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                if (HB !== "N/A" && selectedDrivenMaterial) {
                    const HBNum = parseFloat(HB);
                    if (HBNum >= selectedDrivenMaterial.HB + 10 && HBNum <= selectedDrivenMaterial.HB + 15) {
                        selectedLeadMaterial = { ...material, HB: HBNum };
                    }
                }
            });

            if (!selectedLeadMaterial) {
                selectedLeadMaterial = materials.reduce((max, material) => {
                    const HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                    const HBNum = HB !== "N/A" ? parseFloat(HB) : -Infinity;
                    return HBNum > (max?.HB || -Infinity) ? { ...material, HB: HBNum } : max;
                }, null);
            }

            //Task 3.1.1
            if (!autoMode) {
                materials.forEach((material, index) => {
                    let row = $(`
                        <tr>
                            <td>${material.NhanHieuThep || 'N/A'}</td>
                            <td>${material.NhietLuyen || 'N/A'}</td>
                            <td>${
                                material.KichThuocS_Min && material.KichThuocS_Max
                                    ? `${material.KichThuocS_Min} - ${material.KichThuocS_Max}`
                                    : material.KichThuocS_Min
                                    ? `${material.KichThuocS_Min}`
                                    : material.KichThuocS_Max
                                    ? `- ${material.KichThuocS_Max}`
                                    : 'N/A'
                            }</td>
                            <td>${
                                material.DoRanMin && material.DoRanMax
                                    ? `${material.DoRanMin} - ${material.DoRanMax}`
                                    : material.DoRanMin
                                    ? `${material.DoRanMin}`
                                    : material.DoRanMax
                                    ? `- ${material.DoRanMax}`
                                    : 'N/A'
                            }</td>
                            <td>${
                                material.GioiHanBenMin && material.GioiHanBenMax
                                    ? `${material.GioiHanBenMin} - ${material.GioiHanBenMax}`
                                    : material.GioiHanBenMin
                                    ? `${material.GioiHanBenMin}`
                                    : material.GioiHanBenMax
                                    ? `- ${material.GioiHanBenMax}`
                                    : 'N/A'
                            }</td>
                            <td>${material.GioiHanChay || 'N/A'}</td>
                            <td class="text-center">
                                <input type="radio" name="gearMaterial" value="${material._customId}" data-material='${JSON.stringify(material)}' ${autoMode && index === 0 ? "checked" : ""}>
                            </td>
                        </tr>
                    `);
                
                    tableBody1.append(row);
                });

                $(document).on("change", "input[name='gearMaterial']", function () {
                    let selectedMaterial = $(this).data("material");

                    if (selectedMaterial) {
                        const HB = getMiddleValue(selectedMaterial.DoRanMin, selectedMaterial.DoRanMax, true);
                        selectedMaterial = { ...selectedMaterial, HB: parseFloat(HB) };

                        selectedLeadMaterial = selectedMaterial;

                        let suitableMaterials = materials.filter(material => {
                            const HBMin = convertHardness(material.DoRanMin);
                            const HBMax = convertHardness(material.DoRanMax);

                            return (
                                (HBMin >= (HB + 10) && HBMin <= (HB + 15)) || 
                                (HBMax >= (HB + 10) && HBMax <= (HB + 15)) ||
                                (HBMin <= (HB + 10) && HBMax >= (HB + 15))
                            );
                        });

                        let updatedMaterials = suitableMaterials.map(material => {
                            const HBMin = convertHardness(material.DoRanMin);
                            const HBMax = convertHardness(material.DoRanMax);
                        
                            const validMinHB = Math.max(HBMin, parseFloat(HB) + 10);
                            const validMaxHB = Math.min(HBMax, parseFloat(HB) + 15);

                            if (validMinHB <= validMaxHB) {
                                return {
                                    ...material,
                                    HB: parseFloat(validMinHB)
                                };
                            }
                            return material;
                        });

                        updatedMaterials.forEach((material, index) => {
                            let row = $(`
                                <tr>
                                    <td>${material.NhanHieuThep || 'N/A'}</td>
                                    <td>${material.NhietLuyen || 'N/A'}</td>
                                    <td>${
                                        material.KichThuocS_Min && material.KichThuocS_Max
                                            ? `${material.KichThuocS_Min} - ${material.KichThuocS_Max}`
                                            : material.KichThuocS_Min
                                            ? `${material.KichThuocS_Min}`
                                            : material.KichThuocS_Max
                                            ? `- ${material.KichThuocS_Max}`
                                            : 'N/A'
                                    }</td>
                                    <td>${
                                        material.DoRanMin && material.DoRanMax
                                            ? `${material.DoRanMin} - ${material.DoRanMax}`
                                            : material.DoRanMin
                                            ? `${material.DoRanMin}`
                                            : material.DoRanMax
                                            ? `- ${material.DoRanMax}`
                                            : 'N/A'
                                    }</td>
                                    <td>${
                                        material.GioiHanBenMin && material.GioiHanBenMax
                                            ? `${material.GioiHanBenMin} - ${material.GioiHanBenMax}`
                                            : material.GioiHanBenMin
                                            ? `${material.GioiHanBenMin}`
                                            : material.GioiHanBenMax
                                            ? `- ${material.GioiHanBenMax}`
                                            : 'N/A'
                                    }</td>
                                    <td>${material.GioiHanChay || 'N/A'}</td>
                                    <td class="text-center">
                                        <input type="radio" name="gearMaterial1" value="${material._customId}" data-material='${JSON.stringify(material)}' ${autoMode && index === 0 ? "checked" : ""}>
                                    </td>
                                </tr>
                            `);
                        
                            tableBody2.append(row);
                        });

                        $(document).on("change", "input[name='gearMaterial1']", function () {
                            selectedMaterial = $(this).data("material");
                            selectedDrivenMaterial = selectedMaterial;

                            calculateBevel (selectedLeadMaterial, selectedDrivenMaterial);
                        });
                    }
                });
            } 
            else {
                calculateBevel (selectedLeadMaterial, selectedDrivenMaterial);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu vật liệu:", error);
        }
    }

    //Task 3.1.2 đến 3.1.7
    async function calculateBevel(selectedLeadMaterial, selectedDrivenMaterial) {
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
            let KHβ, KFβ;

            if (x < 0.2) {
                if (selectedLeadMaterial.HB > 350) {
                    KHβ = 1.08;
                    KFβ = 1.15;
                } else {
                    KHβ = 1.04;
                    KFβ = 1.08;
                }
            } else if (x < 0.4) {
                if (selectedLeadMaterial.HB > 350) {
                    KHβ = 1.20;
                    KFβ = 1.30;
                } else {
                    KHβ = 1.08;
                    KFβ = 1.15;
                }
            } else if (x < 0.6) {
                if (selectedLeadMaterial.HB > 350) {
                    KHβ = 1.32;
                    KFβ = 1.48;
                } else {
                    KHβ = 1.13;
                    KFβ = 1.25;
                }
            } else if (x < 0.8) {
                if (selectedLeadMaterial.HB > 350) {
                    KHβ = 1.44;
                    KFβ = 1.67;
                } else {
                    KHβ = 1.18;
                    KFβ = 1.35;
                }
            } else {
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

            let standardValues = [1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12];
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

            let δ1 = Math.atan(parseInt(z1) / parseInt(z2)) * (180 / Math.PI);
            let δ2 = 90 - δ1;     

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
            let θf1 = Math.atan(hf1 / Re1) * (180 / Math.PI);
            let θf2 = Math.atan(hf2 / Re2) * (180 / Math.PI);
            let δa1 = δ1 + θf1;
            let δa2 = δ2 + θf2;
            let δf1 = δ1 - θf1;
            let δf2 = δ2 - θf2;
            let zvn1 = parseInt(z1) / Math.cos(δ1);
            let zvn2 = parseInt(z2) / Math.cos(δ2);
            let YF1 = 3.47 + 13.2 / zvn1;
            let YF2 = 3.47 + 13.2 / zvn2;
            let δH = 0.016;
            let g0;
            if (mtm <= 3.55) {
                g0 = 47;
            } 
            else if(mtm <= 10) {
                g0 = 53;
            }
            else {
                g0 = 64;
            }

            let v = (Math.PI * dm1 * values.n1) / 6000

            let vf = δH * g0 * v * Math.pow(dm1 * (newu1 + 1) / newu1 , 1/2);
            let Kfv = 1 + (vf * b1 * dm1)/(2 * values.T1 * KFβ * 1);
            let Kf = KFβ * 1 * Kfv;
            let εα = 1.88 - 3.2 * (1 / parseInt(z1) + 1 / parseInt(z2));
            let Yε = 1 / εα;
            let σF1_ = (2 * values.T1 * Kf * Yε * 1 * YF1) / (0.85 * b1 * mtm * dm1)
            let σF2_ = (σF1_ * YF1) / YF2;
            let FT1 = (2 * values.T1) / dm1;
            let FT2 = FT1;
            let Fr1 = FT1 * Math.tan(20) * Math.cos(δ1);
            let Fa2 = Fr1;
            let Fr2 = FT2 * Math.tan(20) * Math.cos(δ2);
            let Fa1 = Fr2;

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
                { name: "[σF1]", data: σF1.toFixed(4) },
                { name: "[σF2]", data: σF2.toFixed(4) },
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
                { name: "zvn1", data: zvn1.toFixed(4)},
                { name: "zvn2", data: zvn2.toFixed(4)},
                { name: "YF1", data: YF1.toFixed(4)},
                { name: "YF2", data: YF2.toFixed(4)},
                { name: "δH", data: δH.toFixed(4)},
                { name: "g0", data: g0.toFixed(4)},
                { name: "v", data: v.toFixed(4)},
                { name: "vf", data: vf.toFixed(4)},
                { name: "Kfv", data: Kfv.toFixed(4)},
                { name: "Kf", data: Kf.toFixed(4)},
                { name: "εα", data: εα.toFixed(4)},
                { name: "Yε", data: Yε.toFixed(4)},
                { name: "σF1", data: σF1_.toFixed(4)},
                { name: "σF2", data: σF2_.toFixed(4)},
                { name: "FT1", data: FT1.toFixed(4)},
                { name: "FT2", data: FT2.toFixed(4)},
                { name: "Fr1", data: Fr1.toFixed(4)},
                { name: "Fr2", data: Fr2.toFixed(4)},
                { name: "Fa1", data: Fa1.toFixed(4)},
                { name: "Fa2", data: Fa2.toFixed(4)},
            ];   

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
        
            calculationResultsChap31 = [leadGearResults, drivenGearResults, otherResults];
    
            displayResultsChap31();
    }

    //task 3.2 (wip)
    async function loadShaftGearMaterials() {
        try {
            const response = await fetch("api.php?action=getGearMaterialData");
            const data = await response.json();
    
            if (!data.success || !Array.isArray(data.materials)) {
                console.error("Lỗi dữ liệu vật liệu:", data.message || "Dữ liệu không hợp lệ.");
                return;
            }
    
            const materials = data.materials;
            let autoMode = $("#autoCalculationBtn").hasClass("active");
            const tableBody1 = $("#shaftGearMaterial");
            const tableBody2 = $("#shaftGearMaterial2");

            if (!autoMode) {
                tableBody1.empty();
                tableBody2.empty();
            }
    
            let selectedDrivenMaterial = null;
            let selectedLeadMaterial = null;
    
            materials.forEach(material => {
                let HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                
                if (HB !== "N/A" && HB != null) {
                    if (!selectedDrivenMaterial || HB < selectedDrivenMaterial.HB) {
                        selectedDrivenMaterial = { ...material, HB: parseFloat(HB) };
                    }
                }
            });
    
            materials.forEach(material => {
                let HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                if (HB !== "N/A" && selectedDrivenMaterial) {
                    let HBNum = parseFloat(HB);
                    if (HBNum >= selectedDrivenMaterial.HB + 10 && HBNum <= selectedDrivenMaterial.HB + 15) {
                        selectedLeadMaterial = { ...material, HB: HBNum };
                    }
                }
            });
    
            if (!selectedLeadMaterial) {
                selectedLeadMaterial = materials.reduce((max, material) => {
                    let HB = getMiddleValue(material.DoRanMin, material.DoRanMax, true);
                    let HBNum = HB !== "N/A" ? parseFloat(HB) : -Infinity;
                    return HBNum > (max?.HB || -Infinity) ? { ...material, HB: HBNum } : max;
                }, null);
            }
            //task 3.2.1
            if (!autoMode) {
                materials.forEach((material, index) => {
                    let row = $(`
                        <tr>
                            <td>${material.NhanHieuThep || 'N/A'}</td>
                            <td>${material.NhietLuyen || 'N/A'}</td>
                            <td>${
                                material.KichThuocS_Min && material.KichThuocS_Max
                                    ? `${material.KichThuocS_Min} - ${material.KichThuocS_Max}`
                                    : material.KichThuocS_Min
                                    ? `${material.KichThuocS_Min}`
                                    : material.KichThuocS_Max
                                    ? `- ${material.KichThuocS_Max}`
                                    : 'N/A'
                            }</td>
                            <td>${
                                material.DoRanMin && material.DoRanMax
                                    ? `${material.DoRanMin} - ${material.DoRanMax}`
                                    : material.DoRanMin
                                    ? `${material.DoRanMin}`
                                    : material.DoRanMax
                                    ? `- ${material.DoRanMax}`
                                    : 'N/A'
                            }</td>
                            <td>${
                                material.GioiHanBenMin && material.GioiHanBenMax
                                    ? `${material.GioiHanBenMin} - ${material.GioiHanBenMax}`
                                    : material.GioiHanBenMin
                                    ? `${material.GioiHanBenMin}`
                                    : material.GioiHanBenMax
                                    ? `- ${material.GioiHanBenMax}`
                                    : 'N/A'
                            }</td>
                            <td>${material.GioiHanChay || 'N/A'}</td>
                            <td class="text-center">
                                <input type="radio" name="gearMaterial" value="${material._customId}" data-material='${JSON.stringify(material)}' ${autoMode && index === 0 ? "checked" : ""}>
                            </td>
                        </tr>
                    `);
                
                    tableBody1.append(row);
                });
                
                $(document).on("change", "input[name='gearMaterial']", function () {
                    let selectedMaterial = $(this).data("material");

                    if (selectedMaterial) {
                        const HB = getMiddleValue(selectedMaterial.DoRanMin, selectedMaterial.DoRanMax, true);
                        selectedMaterial = { ...selectedMaterial, HB: parseFloat(HB) };

                        selectedLeadMaterial = selectedMaterial;

                        let suitableMaterials = materials.filter(material => {
                            const HBMin = convertHardness(material.DoRanMin);
                            const HBMax = convertHardness(material.DoRanMax);

                            return (
                                (HBMin >= (HB + 10) && HBMin <= (HB + 15)) || 
                                (HBMax >= (HB + 10) && HBMax <= (HB + 15)) ||
                                (HBMin <= (HB + 10) && HBMax >= (HB + 15))
                            );
                        });

                        let updatedMaterials = suitableMaterials.map(material => {
                            const HBMin = convertHardness(material.DoRanMin);
                            const HBMax = convertHardness(material.DoRanMax);
                        
                            const validMinHB = Math.max(HBMin, parseFloat(HB) + 10);
                            const validMaxHB = Math.min(HBMax, parseFloat(HB) + 15);

                            if (validMinHB <= validMaxHB) {
                                return {
                                    ...material,
                                    HB: parseFloat(validMinHB)
                                };
                            }
                            return material;
                        });

                        updatedMaterials.forEach((material, index) => {
                            let row = $(`
                                <tr>
                                    <td>${material.NhanHieuThep || 'N/A'}</td>
                                    <td>${material.NhietLuyen || 'N/A'}</td>
                                    <td>${
                                        material.KichThuocS_Min && material.KichThuocS_Max
                                            ? `${material.KichThuocS_Min} - ${material.KichThuocS_Max}`
                                            : material.KichThuocS_Min
                                            ? `${material.KichThuocS_Min}`
                                            : material.KichThuocS_Max
                                            ? `- ${material.KichThuocS_Max}`
                                            : 'N/A'
                                    }</td>
                                    <td>${
                                        material.DoRanMin && material.DoRanMax
                                            ? `${material.DoRanMin} - ${material.DoRanMax}`
                                            : material.DoRanMin
                                            ? `${material.DoRanMin}`
                                            : material.DoRanMax
                                            ? `- ${material.DoRanMax}`
                                            : 'N/A'
                                    }</td>
                                    <td>${
                                        material.GioiHanBenMin && material.GioiHanBenMax
                                            ? `${material.GioiHanBenMin} - ${material.GioiHanBenMax}`
                                            : material.GioiHanBenMin
                                            ? `${material.GioiHanBenMin}`
                                            : material.GioiHanBenMax
                                            ? `- ${material.GioiHanBenMax}`
                                            : 'N/A'
                                    }</td>
                                    <td>${material.GioiHanChay || 'N/A'}</td>
                                    <td class="text-center">
                                        <input type="radio" name="gearMaterial1" value="${material._customId}" data-material='${JSON.stringify(material)}' ${autoMode && index === 0 ? "checked" : ""}>
                                    </td>
                                </tr>
                            `);
                        
                            tableBody2.append(row);
                        });

                        $(document).on("change", "input[name='gearMaterial1']", function () {
                            selectedMaterial = $(this).data("material");
                            selectedDrivenMaterial = selectedMaterial;

                            calculateShaft (selectedLeadMaterial, selectedDrivenMaterial);
                        });
                    }
                });
            }
            else {
                 
            }

            calculateShaft (selectedLeadMaterial, selectedDrivenMaterial)
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu vật liệu:", error);
        }
    }

    //task 3.2.2 - 3.2.6
    async function calculateShaft(selectedLeadMaterial, selectedDrivenMaterial){
        
        let leadGearResults = [
            { name: "Vật liệu bánh răng dẫn răng trục", data: selectedLeadMaterial.NhanHieuThep },
            { name: "Nhiệt luyện bánh răng dẫn răng trục", data: selectedLeadMaterial.NhietLuyen },
            { name: "Kích thước bánh răng dẫn răng trục", data: getMiddleValue(selectedLeadMaterial.KichThuocS_Min, selectedLeadMaterial.KichThuocS_Max) + " mm" },
            { name: "Giới hạn bền bánh răng dẫn răng trục", data: getMiddleValue(selectedLeadMaterial.GioiHanBenMin, selectedLeadMaterial.GioiHanBenMax) + " MPa" },
            { name: "Giới hạn chảy bánh răng dẫn răng trục", data: (selectedLeadMaterial.GioiHanChay || "N/A") + " MPa" },
            { name: "Độ cứng HB bánh răng dẫn răng trục", data: selectedLeadMaterial.HB }
        ];
        
        let drivenGearResults = [
            { name: "Vật liệu bánh răng bị dẫn răng trục", data: selectedDrivenMaterial.NhanHieuThep },
            { name: "Nhiệt luyện bánh răng bị dẫn răng trục", data: selectedDrivenMaterial.NhietLuyen },
            { name: "Kích thước bánh răng bị dẫn răng trục", data: getMiddleValue(selectedDrivenMaterial.KichThuocS_Min, selectedDrivenMaterial.KichThuocS_Max) + " mm" },
            { name: "Giới hạn bền bánh răng bị dẫn răng trục", data: getMiddleValue(selectedDrivenMaterial.GioiHanBenMin, selectedDrivenMaterial.GioiHanBenMax) + " MPa" },
            { name: "Giới hạn chảy bánh răng bị dẫn răng trục", data: (selectedDrivenMaterial.GioiHanChay || "N/A") + " MPa" },
            { name: "Độ cứng HB bánh răng bị dẫn răng trục", data: selectedDrivenMaterial.HB }
        ];
        
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
    
        let Ka = 49.5;
        let Kd = 77;
        let Zm = 274;

        let ψba = calculationResultsChap2.find(item => item.name === "ψba")?.data || NaN;
        let ψbd = 0.53 * ψba * (values.u2 + 1);

        let KHβ, KFβ;

        if (ψbd < 0.2) {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = 1.02;
                KFβ = 1.03;
            } else {
                KHβ = 1.01;
                KFβ = 1.02;
            }
        } else if (ψbd < 0.4) {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = 1.05;
                KFβ = 1.10;
            } else {
                KHβ = 1.02;
                KFβ = 1.05;
            }
        } else if (ψbd < 0.6) {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = 1.08;
                KFβ = 1.12;
            } else {
                KHβ = 1.03;
                KFβ = 1.08;
            }
        } else if (ψbd < 0.8) {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = 1.14;
                KFβ = 1.20;
            } else {
                KHβ = 1.05;
                KFβ = 1.12;
            }
        } else if (ψbd < 1) {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = 1.19;
                KFβ = 1.28;
            } else {
                KHβ = 1.07;
                KFβ = 1.16;
            }
        } else if (ψbd < 1.2) {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = 1.25;
                KFβ = 1.41;
            } else {
                KHβ = 1.10;
                KFβ = 1.22;
            }
        } else if (ψbd < 1.4) {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = 1.31;
                KFβ = 1.53;
            } else {
                KHβ = 1.13;
                KFβ = 1.28;
            }
        } else {
            if (selectedLeadMaterial.HB > 350) {
                KHβ = null;
                KFβ = null;
            } else {
                KHβ = 1.16;
                KFβ = 1.26;
            }
        }
        
        let aw = Ka * (values.u2 + 1) * Math.pow((values.T2 * KHβ) / (ψba * values.u2 * Math.pow(σH, 2)) , 1/3);
        let dw = Kd * Math.pow((values.T2 * KHβ * (values.u2 + 1)) / (ψba * values.u2 * Math.pow(σH, 2)) , 1/3);
        
        let m = aw * 0.015;
        const mStandardValues = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12];
        let closest = mStandardValues[0];

        let minDiff = Math.abs(m - closest);

        for (let i = 1; i < mStandardValues.length; i++) {
            const diff = Math.abs(m - mStandardValues[i]);
            if (diff < minDiff) {
                minDiff = diff;
                closest = mStandardValues[i];
            }
        }

        m = closest;

        let z1 = ((2 * aw) / (m * (values.u2 + 1))).toFixed(0);
        let z2 = (z1 * values.u2).toFixed(0);
        
        aw = (m * (parseInt(z1) + parseInt(z2))) / 2;
        let newu2 =  parseInt(z2) / parseInt(z1);
        
        let x1, x2;
        if (z1 >= 21) {
            x1 = 0;
            x2 = 0;
        } else if (14 <= z1 <= 20 && newu2 >= 3.5){
            x1 = 0.3;
            x2 = -0.3;
        } else {
            x1 = 0.5;
            x2 = 0.5;
        }

        let kx = ((1000 * (x1 + x2)) / (z1 + z2));

        const kyTable = {
            0: 0,
            1: 0.008,  2: 0.032,  3: 0.063,  4: 0.114,  5: 0.178,
            6: 0.243,  7: 0.318,  8: 0.410,  9: 0.510,  10: 0.622,
            11: 0.740, 12: 0.870, 13: 1.000, 14: 1.145, 15: 1.295,
            16: 1.450, 17: 1.622, 18: 1.792, 19: 1.985, 20: 2.160,
            21: 2.340, 22: 2.530, 23: 2.742, 24: 2.940, 25: 3.155,
            26: 3.380, 27: 3.605, 28: 3.835, 29: 4.065, 30: 4.290,
            31: 4.540, 32: 4.785, 33: 5.030, 34: 5.280, 35: 5.520,
            36: 5.790, 37: 6.050, 38: 6.315, 39: 6.585, 40: 6.860,
            41: 7.140, 42: 7.420, 43: 7.700, 44: 8.000, 45: 8.290,
            46: 8.590, 47: 8.885, 48: 9.175, 49: 9.460, 50: 9.765
        };

        let ky = kyTable[parseInt(kx)]
        let Δy = parseInt(ky) * (z1 + z2) / 1000;

        let h = 2.25 * m - Δy * m;
        let c = 0.25 * m;
        let p = m / 3;
        aw = m * (0.5 * (parseInt(z1) + parseInt(z2) + (x1 + x2) - Δy))
        let d1 = m * parseInt(z1);
        let d2 = m * parseInt(z2);
        let dw1 = d1 + d1 * (2 / (parseInt(z1) + parseInt(z2)))
        let dw2 = dw1 * newu2;
        let da1 = d1 + 2 * (1 + x1 - Δy) * m;
        let da2 = d2 + 2 * (1 + x2 - Δy) * m;
        let df1 = d1 - (2.5 - 2 * x1) * m;
        let df2 = d2 - (2.5 - 2 * x2) * m;
        let α = 20;
        let αtw = Math.acos(((0.5 * m * (parseInt(z1) + parseInt(z2))) * Math.cos(α)) / aw);

        let bw2 = ψba * aw;
        let bw1 = bw2 + 5;
        let zv1 = z1;
        let zv2 = z2;
        let YF1 = 3.47 + 13.2 / zv1;
        let YF2 = 3.47 + 13.2 / zv2;
        let δF = 0.016;
        let g0;
        if (m <= 3.55) {
            g0 = 47;
        } 
        else if(m <= 10) {
            g0 = 53;
        }
        else {
            g0 = 64;
        }

        let v = (Math.PI * dw1 * values.n2) / 6000
        let vf = δF * g0 * v * Math.pow(aw / newu2 , 1/2);
        let Kfv = 1 + (vf * bw2 * dw1)/(2 * values.T2 * KFβ * 1);
        let Kf = KFβ * 1 * Kfv;
        let εα = 1.88 - 3.2 * (1 / parseInt(z1) + 1 / parseInt(z2));
        let Yε = 1 / εα;
        let σF1_ = (2 * values.T1 * Kf * Yε * 1 * YF1) / (0.85 * bw1 * dw1 * m)
        let σF2_ = (σF1_ * YF1) / YF2;
        let FT1 = (2 * values.T1) / d1;
        let FT2 = FT1;
        let Fr1 = FT1 * Math.tan(αtw);
        let Fa2 = 0;
        let Fr2 = FT2 * Math.tan(αtw);
        let Fa1 = 0;
        
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
            { name: "[σF1]", data: σF1.toFixed(4) },
            { name: "[σF2]", data: σF2.toFixed(4) },
            { name: "σFMax1", data: σFMax1.toFixed(4) },
            { name: "σFMax2", data: σFMax2.toFixed(4) },
            { name: "Ka", data: Ka.toFixed(4) },
            { name: "Kd", data: Kd.toFixed(4) },
            { name: "ψba", data: ψba },
            { name: "ψbd", data: ψbd.toFixed(4) },
            { name: "KHβ", data: KHβ.toFixed(4) },
            { name: "KHβ", data: KHβ.toFixed(4) },
            { name: "KFβ", data: KFβ.toFixed(4) },
            { name: "aw", data: aw.toFixed(4) },
            { name: "dw", data: dw.toFixed(4) },
            { name: "x1", data: x1.toFixed(4) },
            { name: "x2", data: x2.toFixed(4) },
            { name: "dw", data: dw.toFixed(4) },
            { name: "m", data: m.toFixed(4) },
            { name: "z1", data: z1 },
            { name: "z2", data: z2 },
            { name: "x1", data: x1.toFixed(4) },
            { name: "x2", data: x2.toFixed(4) },
            { name: "kx", data: kx},
            { name: "ky", data: ky },
            { name: "Δy", data: Δy.toFixed(4) },
            { name: "bw1", data: bw1.toFixed(4)},
            { name: "bw2", data: bw2.toFixed(4)},
            { name: "zv1", data: zv1},
            { name: "zv2", data: zv2},
            { name: "YF1", data: YF1.toFixed(4)},
            { name: "YF2", data: YF2.toFixed(4)},
            { name: "δF", data: δF.toFixed(4)},
            { name: "g0", data: g0.toFixed(4)},
            { name: "v", data: v.toFixed(4)},
            { name: "vf", data: vf.toFixed(4)},
            { name: "Kfv", data: Kfv.toFixed(4)},
            { name: "Kf", data: Kf.toFixed(4)},
            { name: "εα", data: εα.toFixed(4)},
            { name: "Yε", data: Yε.toFixed(4)},
            { name: "σF1", data: σF1_.toFixed(4)},
            { name: "σF2", data: σF2_.toFixed(4)},
            { name: "FT1", data: FT1.toFixed(4)},
            { name: "FT2", data: FT2.toFixed(4)},
            { name: "Fr1", data: Fr1.toFixed(4)},
            { name: "Fr2", data: Fr2.toFixed(4)},
            { name: "Fa1", data: Fa1.toFixed(4)},
            { name: "Fa2", data: Fa2.toFixed(4)},
        ];   

        leadGearResults = [
            ...leadGearResults,
            { name: "Số Răng", data: z1 },
            { name: "Modun", data: m.toFixed(4) },
            { name: "Tỉ số truyền", data: newu2.toFixed(4) },
            { name: "Chiều cao răng", data: h.toFixed(4) },
            { name: "Khe hở dường kính", data: c.toFixed(4) },
            { name: "Bán kính lượng chân răng", data: p.toFixed(4) },
            { name: "Hệ số dịch chỉnh", data: x1.toFixed(4) },
            { name: "Khoảng cách trục", data: aw.toFixed(4) },
            { name: "Đường kính chia", data: d1.toFixed(4) },
            { name: "Đường kính lăn", data: dw1.toFixed(4) },
            { name: "Đường kính đỉnh răng", data: da1.toFixed(4) },
            { name: "Đường kính đáy răng", data: df1.toFixed(4) },
            { name: "Góc biên dạng", data: α.toFixed(4) },
            { name: "Đường kính cơ sở", data: (d1 * Math.cos(α)).toFixed(4) },
            { name: "Góc profin răng", data: α.toFixed(4) },
            { name: "Góc ăn khớp", data: αtw.toFixed(4) },
        ];

        drivenGearResults = [
            ...drivenGearResults,
            { name: "Số Răng", data: z2 },
            { name: "Modun", data: m.toFixed(4) },
            { name: "Tỉ số truyền", data: newu2.toFixed(4) },
            { name: "Chiều cao răng", data: h.toFixed(4) },
            { name: "Khe hở dường kính", data: c.toFixed(4) },
            { name: "Bán kính lượng chân răng", data: p.toFixed(4) },
            { name: "Hệ số dịch chỉnh", data: x2.toFixed(4) },
            { name: "Khoảng cách trục", data: aw.toFixed(4) },
            { name: "Đường kính chia", data: d2.toFixed(4) },
            { name: "Đường kính lăn", data: dw2.toFixed(4) },
            { name: "Đường kính đỉnh răng", data: da2.toFixed(4) },
            { name: "Đường kính đáy răng", data: df2.toFixed(4) },
            { name: "Góc biên dạng", data: α.toFixed(4) },
            { name: "Đường kính cơ sở", data: (d2 * Math.cos(α)).toFixed(4) },
            { name: "Góc profin răng", data: α.toFixed(4) },
            { name: "Góc ăn khớp", data: αtw.toFixed(4) },
        ]
    
        calculationResultsChap32 = [leadGearResults, drivenGearResults, otherResults];

        displayResultsChap32();
    }

    async function loadChain() {
        let autoMode = $("#autoCalculationBtn").hasClass("active");

        const conditions = [
            {
                label: "Đường nối hai tâm đĩa xích",
                options: [
                    { text: "Đến 60°", value: 1 },
                    { text: "Trên 60°", value: 1.25 }
                ],
                shortName: "k0"
            },
            {
                label: "Khoảng cách trục",
                options: [
                    { text: "(30 ... 50)p", value: 1 },
                    { text: "<= 25p", value: 1.25 },
                    { text: ">= (60 ... 80)p", value: 0.8 }
                ],
                shortName: "ka"
            },
            {
                label: "Vị trí trục được điều chỉnh",
                options: [
                    { text: "Một trong các đĩa xích", value: 1 },
                    { text: "Đĩa căng hoặc con lăn căng xích", value: 1.1 },
                    { text: "Vị trí trục không điều chỉnh được", value: 1.25 }
                ],
                shortName: "kdc"
            },
            {
                label: "Tải trọng",
                options: [
                    { text: "Tải trọng tĩnh, làm việc êm", value: 1 },
                    { text: "Tải trọng va đập", value: 1.2 },
                    { text: "Tải trọng va đập mạnh", value: 1.8 }
                ],
                shortName: "kd"
            },
            {
                label: "Làm việc",
                options: [
                    { text: "1 ca", value: 1 },
                    { text: "2 ca", value: 1.25 },
                    { text: "3 ca", value: 1.45 }
                ],
                shortName: "kc"
            }
        ];

        const lubricationOptions = {
            "Không bụi": [{ text: "I", value: 0.8 }, { text: "II", value: 1 }],
            "Có bụi": [{ text: "II", value: 1 }, { text: "III", value: 3 }],
            "Bẩn": [{ text: "III", value: 6 }, { text: "IV", value: 6 }]
        };

        if (!autoMode) {
            const chainConditionTable = document.getElementById("chainConditionTable");
            chainConditionTable.innerHTML = "";

            conditions.forEach((condition) => {
                const row = document.createElement("tr");
                const conditionCell = document.createElement("td");
                conditionCell.textContent = condition.label;

                const dropdownCell = document.createElement("td");
                const dropdown = document.createElement("select");
                dropdown.className = "efficiency-mode form-control";

                condition.options.forEach(option => {
                    const opt = document.createElement("option");
                    opt.textContent = option.text;
                    opt.value = option.value;
                    dropdown.appendChild(opt);
                });

                dropdownCell.appendChild(dropdown);
                const valueCell = document.createElement("td");
                valueCell.textContent = dropdown.value;

                dropdown.addEventListener("change", function () {
                    valueCell.textContent = this.value;
                    updateTriSoCalculationChap33(condition.shortName, this.value);
                });

                row.appendChild(conditionCell);
                row.appendChild(dropdownCell);
                row.appendChild(valueCell);
                chainConditionTable.appendChild(row);

                updateTriSoCalculationChap33(condition.shortName, dropdown.value);
            });

            const row = document.createElement("tr");
            const envCell = document.createElement("td");
            envCell.textContent = "Môi trường làm việc và cách bôi trơn";

            const envDropdown = document.createElement("select");
            envDropdown.className = "efficiency-mode form-control";

            const valueCell = document.createElement("td");

            Object.keys(lubricationOptions).forEach(env => {
                const opt = document.createElement("option");
                opt.textContent = env;
                opt.value = env;
                envDropdown.appendChild(opt);
            });

            const lubDropdown = document.createElement("select");
            lubDropdown.className = "efficiency-mode form-control";

            const sliderRow = document.createElement("tr");
            const sliderLabel = document.createElement("td");
            sliderLabel.textContent = "Khoảng cách trục a";

            const sliderCell = document.createElement("td");
            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = 1;
            slider.max = 10;
            slider.value = 5;
            slider.className = "form-range";

            const sliderValue = document.createElement("td");
            sliderValue.textContent = slider.value;

            envDropdown.addEventListener("change", function () {
                lubDropdown.innerHTML = "";
                lubricationOptions[this.value].forEach(option => {
                    const opt = document.createElement("option");
                    opt.textContent = option.text;
                    opt.value = option.value;
                    lubDropdown.appendChild(opt);
                });
                lubDropdown.dispatchEvent(new Event('change'));
            });

            lubDropdown.addEventListener("change", function () {
                valueCell.textContent = this.value;
                updateTriSoCalculationChap33("kbt", this.value);
            });

            slider.addEventListener("input", function () {
                sliderValue.textContent = this.value;
                updateTriSoCalculationChap33("a", this.value);
            });

            envDropdown.dispatchEvent(new Event('change'));

            row.appendChild(envCell);
            row.appendChild(envDropdown);
            row.appendChild(lubDropdown);
            row.appendChild(valueCell);
            chainConditionTable.appendChild(row);

            sliderCell.appendChild(slider);
            sliderRow.appendChild(sliderLabel);
            sliderRow.appendChild(sliderCell);
            sliderRow.appendChild(sliderValue);

            chainConditionTable.appendChild(sliderRow);

        } else {
            conditions.forEach(condition => {
                updateTriSoCalculationChap33(condition.shortName, condition.options[0].value);
            });
            updateTriSoCalculationChap33("kbt", lubricationOptions["Không bụi"][0].value);
            updateTriSoCalculationChap33("a", 5)
        }
    }

    async function calculateChain() {
        let k0 = getValueByName("k0", 33);
        let ka = getValueByName("ka", 33);
        let kdc = getValueByName("kdc", 33);
        let kd = getValueByName("kd", 33);
        let kc = getValueByName("kc", 33);
        let kbt = getValueByName("kbt", 33);
        let a = getValueByName("a", 33);

        let values = await calculateBoardValues();

        let p, dc, B, P;

        if (values.n3 <= 50) {
            p = 25.4; dc = 7.95; B = 22.61; P = 3.2;
        } else if (values.n3 <= 200) {
            p = 25.4; dc = 7.95; B = 22.61; P = 11.0;
        } else if (values.n3 <= 400) {
            p = 25.4; dc = 7.95; B = 22.61; P = 19.0;
        } else if (values.n3 <= 600) {
            p = 25.4; dc = 7.95; B = 22.61; P = 25.7;
        } else if (values.n3 <= 800) {
            p = 25.4; dc = 7.95; B = 22.61; P = 34.7;
        } else if (values.n3 <= 1000) {
            p = 25.4; dc = 7.95; B = 22.61; P = 43.8;
        } else if (values.n3 <= 1200) {
            p = 25.4; dc = 7.95; B = 22.61; P = 48.3;
        } else {
            p = 25.4; dc = 7.95; B = 22.61; P = 53.5;
        }

        let z1 = (29 - 2 * values.ux).toFixed(0);
        let z2 = (values.ux * z1).toFixed(0);

        let kz = 25 / parseInt(z1);
        let kn = values.n1/values.n3;

        let k = k0 * ka * kdc * kd * kc * kbt;
        let v = z1 * p * values.n3 / 60000

        let Pt = values.P3 * k * kz * kn;
        let kv = 1;
        let Bt = (250 * values.P3 * k * kv / Math.pow(v, 2/3)) / p;

        let b, b1, S, Q, q;
        let closestDiff = Infinity;

        const chains = [
            { p: 12.7, b: 13.4, b1: 7, S: 1.5, B: [22.5, 28.5, 34.5, 40.5, 46.5, 52.5], Q: [26, 31, 36, 42, 49, 56], q: [1.3, 1.6, 2.0, 2.3, 2.7, 3.0] },
            { p: 15.875, b: 16.7, b1: 8.7, S: 2.0, B: [30, 38, 46, 54, 62, 70], Q: [41, 50, 58, 69, 86, 91], q: [2.2, 2.7, 3.3, 3.9, 4.4, 5.0] },
            { p: 19.05, b: 20.1, b1: 10.5, S: 3.0, B: [45, 57, 69, 81, 93], Q: [74, 89, 105, 124, 143], q: [3.9, 4.9, 5.9, 7.0, 8.0] },
            { p: 25.4, b: 26.7, b1: 13.35, S: 3.0, B: [57, 75, 93, 104], Q: [116, 132, 164, 196], q: [8.4, 10.8, 13.2, 15.4] },
            { p: 31.75, b: 33.4, b1: 16.7, S: 3.0, B: [75, 93, 111, 129], Q: [166, 206, 246, 286], q: [14.35, 16.55, 18.8, 21.0] }
        ];

        chains.forEach(chain => {
            chain.B.forEach((bValue, index) => {
                const diff = Math.abs(bValue - Bt);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    p = chain.p;
                    b = chain.b;
                    b1 = chain.b1;
                    S = chain.S;
                    B = bValue;
                    Q = chain.Q[index];
                    q = chain.q[index];
                }
            });
        });

        a *= p ;
        
        let x = ((2 * a / p) + ((parseInt(z1) + parseInt(z2)) / 2) + ((Math.pow(parseInt(z2) - parseInt(z1), 2) * p) / (4 * Math.pow(Math.PI, 2) * a))).toFixed(0);
        let astar = 0.25 * (x - ((parseInt(z1) + parseInt(z2)) / 2) + Math.pow((Math.pow(x - ((parseInt(z1) + parseInt(z2)) / 2) , 2)) - 2 * Math.pow((parseInt(z2) - parseInt(z1)) / Math.PI , 2) , 1/2));
        a = 0.997 * astar

        let i = (parseInt(z1) * values.n3) / (15 * x);

        let Ft = 1000 * values.P3 / v;
        let Fv = q * Math.pow(v, 2);
        let kf = 2;
        let Fo = 9.81 * kf * q * a;
        let s = Q / (kd * Ft + Fo + Fv);

        let d1 = p / Math.sin(Math.PI / parseInt(z1));
        let d2 = p / Math.sin(Math.PI / parseInt(z2));

        let da1 = p * (0.5 + 1 / Math.tan(Math.PI / parseInt(z1)));
        let da2 = p * (0.5 + 1 / Math.tan(Math.PI / parseInt(z2)));

        let dl = 39.68;
        let r = 0.5025 * dl + 0.05;
        let df1 = d1 - 2 * r;
        let df2 = d2 - 2 * r;

        let E = 2.1 * Math.pow(10, 5);

        const pToA = {
            8: 11,
            9.525: 28,
            12.7: 39.6,
            15.875: 51.5,
            19.05: 106,
            25.4: 180,
            31.75: 262,
            38.1: 395,
            44.45: 473,
            50.8: 645
        };

        let A;

        if (p in pToA) {
            A = pToA[p];
        }

        let kr;

        if (parseInt(z1) < 15) kr = 0.59;
        else if (parseInt(z1) < 20) kr = 0.48;
        else if (parseInt(z1) < 30) kr = 0.36;
        else if (parseInt(z1) < 40) kr = 0.29;
        else if (parseInt(z1) < 50) kr = 0.24;
        else kr = 0.22;

        let σH1 = 0.47 * Math.pow((kr * E * (Ft * kd + 13 * Math.pow(10, -7))) / (A) , 1/2)
        let Fr = 1.15 * Ft;
        let F2 = Fo + Fv;
        let F1 = F2 + Ft;
        let y = Math.atan((d2 - d1) / a)
        let Frx = Math.pow(Math.pow(F1 , 2) + Math.pow(F2 , 2) + 2 * F1 * F2 * Math.cos(2*y), 1/2); 
        let phi = Math.acos((F1 * Math.cos(y) + F2 * Math.cos(y)) / Frx)

        let boardResult = [
            { name: "Số răng đĩa xích dẫn (z1)", data: z1 },
            { name: "Số bánh răng bị dẫn (z2)", data: z2 },
            { name: "Bước xích (p) (mm)", data: p },
            { name: "Chiều dài ống lót (B) (mm)", data: B },
            { name: "Đường kính chốt (dc)", data: dc },
            { name: "Số mắt xích (x)", data: x },
            { name: "Khoảng cách trục (a)", data: a },
            { name: "Đường kính vòng chia đĩa dẫn (mm)", data: df1 },
            { name: "Đường kính vòng chia đĩa bị dẫn (mm)", data: df2 },
            { name: "Lực tác dụng lên trục", data: Ft }
        ]

        let otherResults = [
            { name: "z1", data: z1 },
            { name: "z2", data: z2 },
            { name: "k", data: k },
            { name: "kz", data: kz.toFixed(4) },
            { name: "kn", data: kn.toFixed(4) },
            { name: "Pt", data: Pt.toFixed(4) },
            { name: "v", data: v.toFixed(4) },
            { name: "kv", data: kv.toFixed(4) },
            { name: "Bt", data: Bt.toFixed(4) },
            { name: "x", data: x },
            { name: "a*", data: astar.toFixed(4) },
            { name: "a", data: a.toFixed(4) },
            { name: "i", data: i.toFixed(4) },
            { name: "Ft", data: Ft.toFixed(4) },
            { name: "Fv", data: Fv.toFixed(4) },
            { name: "Fo", data: Fo.toFixed(4) },
            { name: "Pt", data: Pt.toFixed(4) },
            { name: "s", data: s.toFixed(4) },
            { name: "d1", data: d1.toFixed(4) },
            { name: "d2", data: d2.toFixed(4) },
            { name: "da1", data: da1.toFixed(4) },
            { name: "da2", data: da2.toFixed(4) },
            { name: "df1", data: df1.toFixed(4) },
            { name: "df2", data: df2.toFixed(4) },
            { name: "σH1", data: σH1.toFixed(4) }, 
            { name: "Fr", data: Fr.toFixed(4) },
            { name: "F1", data: F1.toFixed(4) },  
            { name: "F2", data: F2.toFixed(4) },  
            { name: "y", data: y.toFixed(4) },  
            { name: "Frx", data: Frx.toFixed(4) },  
            { name: "phi", data: phi.toFixed(4) },  
        ]

        calculationResultsChap33 = [boardResult, otherResults];
        displayResultsChap33()
    }


    async function updateTriSoCalculationChap33(name, value) {
        let existingEntry = calculationResultsChap33.find(entry => entry.name === name);
        if (existingEntry) {
            existingEntry.data = value;
        } else {
            calculationResultsChap33.push({ name, data: value });
        }

        await calculateChain();
    }

    //display ket qua cho 3.1 (done)
    function displayResultsChap31() {
        const resultSection = document.querySelector("#tab2 > div");
        resultSection.innerHTML = "";

        if (!calculationResultsChap31 || calculationResultsChap31.length === 0) {
            const noResultsMessage = document.createElement("div");
            noResultsMessage.className = "alert alert-warning";
            noResultsMessage.textContent = "Bạn chưa tính bước này";
            resultSection.appendChild(noResultsMessage);
            return;
        }
    
        const flatResults = [
            ...calculationResultsChap31[0],
            ...calculationResultsChap31[1],
            ...calculationResultsChap31[2]
        ];
    
        let index = 40;
    
        function appendItem(name, data) {
            const item = document.createElement("div");
            item.className = "p-2 mb-2";
            item.innerHTML = `<strong>${name}</strong>: ${data}`;
            resultSection.appendChild(item);
        }
    
        function appendTitle(title) {
            const titleDiv = document.createElement("div");
            titleDiv.className = "fw-bold mt-3";
            titleDiv.textContent = title;
            resultSection.appendChild(titleDiv);
        }
    
        function appendItems(count) {
            for (let i = 0; i < count && index < flatResults.length; i++, index++) {
                appendItem(flatResults[index].name, flatResults[index].data);
            }
        }
    
        appendTitle("Ta có giới hạn mỏi, giới hạn uốn và các hệ số an toàn tương ứng là:");
        appendItems(6);
    
        appendTitle("Số chu kì thay đổi ứng suất cơ sở khi thử về tiếp xúc:");
        appendItems(2);
    
        index++;
    
        appendTitle("Số chu kì thay đổi ứng suất tương đương là:");
        appendItems(4);
    
        appendTitle("Hệ số tuổi thọ xét ảnh hưởng của thời hạn phục vụ của bộ truyền:");
        appendItems(4);
    
        appendTitle("Ứng suất tiếp xúc cho phép của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Ta lựa ứng suất lớn nhất là:");
        appendItems(1);
    
        appendTitle("Ứng suất tiếp xúc cho phép khi quá tải của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Ứng suất uốn cho phép của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Ứng suất uốn khi quá tải của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Hệ số kể đến sự phân bố không đều tải trọng trên chiều rộng vành răng:");
        appendItems(2);
    
        appendTitle("Tính được chiều dài côn ngoài:");
        appendItems(1);
    
        appendTitle("Đường kính chia ngoải của bánh côn dẫn:");
        appendItems(1);
    
        appendTitle("Đường kính trung bình và modun sơ bộ/trung bình của bánh dẫn:");
        appendItems(3);
    
        appendTitle("Số răng của bánh dẫn và bị dẫn:");
        appendItems(2);
    
        appendTitle("Góc côn chia của bánh dẫn và bị dẫn:");
        appendItems(2);
    
        appendTitle("Các hệ số trong việc kiểm nghiệm độ bền răng:");
        appendItems(12);
    
        appendTitle("Điều kiện độ bền răng:");
        appendItems(2);
    
        appendTitle("Các lực tác dụng lên bộ truyền:");
        while (index < flatResults.length) {
            appendItem(flatResults[index].name, flatResults[index].data);
            index++;
        }
    }    

    //display ket qua cho 3.2 (done)
    function displayResultsChap32() {
        const resultSection = document.querySelector("#tab3 > div");
        resultSection.innerHTML = "";

        if (!calculationResultsChap32 || calculationResultsChap32.length === 0) {
            const noResultsMessage = document.createElement("div");
            noResultsMessage.className = "alert alert-warning";
            noResultsMessage.textContent = "Bạn chưa tính bước này";
            resultSection.appendChild(noResultsMessage);
            return;
        }
    
        const flatResults = [...calculationResultsChap32[0], ...calculationResultsChap32[1], ...calculationResultsChap32[2]];
        let index = 44;
    
        function appendItem(name, data) {
            const item = document.createElement("div");
            item.className = "p-2 mb-2";
            item.innerHTML = `<strong>${name}</strong>: ${data}`;
            resultSection.appendChild(item);
        }
    
        function appendTitle(title) {
            const titleDiv = document.createElement("div");
            titleDiv.className = "fw-bold mt-3";
            titleDiv.textContent = title;
            resultSection.appendChild(titleDiv);
        }
    
        function appendItems(count) {
            for (let i = 0; i < count && index < flatResults.length; i++, index++) {
                appendItem(flatResults[index].name, flatResults[index].data);
            }
        }
    
        appendTitle("Ta có giới hạn mỏi, giới hạn uốn và các hệ số an toàn tương ứng là:");
        appendItems(6);
    
        appendTitle("Số chu kì thay đổi ứng suất cơ sở khi thử về tiếp xúc:");
        appendItems(2);
    
        appendTitle("Số chu kì thay đổi ứng suất tương đương là:");
        index++;
        appendItems(4);
    
        appendTitle("Hệ số tuổi thọ xét ảnh hưởng của thời hạn phục vụ của bộ truyền:");
        appendItems(4);
    
        appendTitle("Ứng suất tiếp xúc cho phép của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Ta lựa ứng suất lớn nhất là:");
        appendItems(1);
    
        appendTitle("Ứng suất tiếp xúc cho phép khi quá tải của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Ứng suất uốn cho phép của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Ứng suất uốn khi quá tải của 2 bánh là:");
        appendItems(2);
    
        appendTitle("Hệ số phụ thuộc vào vật liệu bánh răng và loại răng:");
        appendItems(2);
        index += 3;
    
        appendTitle("Hệ số kể đến sự phân bố không đều tải trọng trên chiều rộng vành răng:");
        appendItems(2);
    
        appendTitle("Khoảng cách trục của bánh trụ dẫn:");
        appendItems(1);
    
        appendTitle("Đường kính lăn ngoài của bánh dẫn:");
        appendItems(1);
        index += 3;
    
        appendTitle("Modun của bánh dẫn:");
        appendItems(1);
    
        appendTitle("Số răng của bánh dẫn và bánh bị dẫn:");
        appendItems(2);
    
        appendTitle("Các thông số dịch chỉnh 2 bánh răng:");
        appendItems(5);
    
        appendTitle("Các hệ số trong việc kiểm nghiệm độ bền răng:");
        appendItems(14);
    
        appendTitle("Điều kiện độ bền răng:");
        appendItems(2);
    
        appendTitle("Các lực tác dụng lên bộ truyền:");
        while (index < flatResults.length) {
            appendItem(flatResults[index].name, flatResults[index].data);
            index++;
        }
    }     

    //display ket qua cho 3.3 (done)
    function displayResultsChap33() {
        const resultSection = document.querySelector("#tab4 > div");
        resultSection.innerHTML = "";

        if (!calculationResultsChap33 || calculationResultsChap33.length === 0) {
            const noResultsMessage = document.createElement("div");
            noResultsMessage.className = "alert alert-warning";
            noResultsMessage.textContent = "Bạn chưa tính bước này";
            resultSection.appendChild(noResultsMessage);
            return;
        }

        const flatResults = [...calculationResultsChap33[0], ...calculationResultsChap33[1]];
        let index = 10;

        function appendItem(name, data) {
            const item = document.createElement("div");
            item.className = "p-2 mb-2";
            item.innerHTML = `<strong>${name}</strong>: ${data}`;
            resultSection.appendChild(item);
        }
    
        function appendTitle(title) {
            const titleDiv = document.createElement("div");
            titleDiv.className = "fw-bold mt-3";
            titleDiv.textContent = title;
            resultSection.appendChild(titleDiv);
        }
    
        function appendItems(count) {
            for (let i = 0; i < count && index < flatResults.length; i++, index++) {
                appendItem(flatResults[index].name, flatResults[index].data);
            }
        }
        
        appendTitle("Ta có số răng của 2 đĩa nhỏ - lớn tương ứng là:");
        appendItems(2);

        appendTitle("Với các điều kiện sử dụng xích đã lựa chọn, ta có hệ hệ điều kiện sử dụng xích:");
        appendItems(1);

        appendTitle("Hệ số răng đĩa xích và hệ số vòng quay:");
        appendItems(2);

        appendTitle("Khi đó công suất tính toán là:");
        appendItems(1);

        appendTitle("Ta có vận tốc vòng và hệ số vận tốc:");
        appendItems(2);

        appendTitle("Tính được:");
        appendItems(1);

        appendTitle("Ta có số mắt xích là:");
        appendItems(1);

        appendTitle("Khoảng cách trục chính xác là:");
        appendItems(1);

        appendTitle("Điều chỉnh để xích không chịu áp lực quá lớn:");
        appendItems(1);

        appendTitle("Số lần va đập của bản lề xích trong 1 giây:");
        appendItems(1);

        appendTitle("Các hệ số để tính toán hệ số an toàn:");
        appendItems(4);

        appendTitle("Hệ số an toàn của xích là:");
        appendItems(1);

        appendTitle("Các chỉ số về đường kính đĩa xích:");
        appendItems(6);

        appendTitle("Chỉ số kiểm nghiệm độ bền xích:");
        appendItems(1);

        appendTitle("Các lực tác dộng lên bộ truyền xích:");
        appendItems(3);

        appendTitle("Góc hợp bởi lực F1 và F2:");
        appendItems(1);

        appendTitle("Hợp lực của 2 lực căng trên bộ truyền:");
        appendItems(1);

        appendTitle("Góc bởi hợp lực với trục nối tâm:");
        appendItems(1);
    }

    //display ket qua cho 4 (wip)
    function displayResultsChap4(){
        const resultSection = document.querySelector("#tab5 > div");
        resultSection.innerHTML = "";

        if (!calculationResultsChap32 || calculationResultsChap32.length === 0) {
            const noResultsMessage = document.createElement("div");
            noResultsMessage.className = "alert alert-warning";
            noResultsMessage.textContent = "Bạn chưa tính bước này";
            resultSection.appendChild(noResultsMessage);
            return;
        }
    }
    
    function getValueByName(name, chap) {
        let item;
        if (chap == 2) {
            item = calculationResultsChap2.find((e) => e.name === name);
        }
        else if (chap == 33) {
            item = calculationResultsChap33.find((e) => e.name === name);
        }
        return item ? parseFloat(item.data) : null;
    }
    
    async function calculateBoardValues() {
        let ηbrcon = getValueByName("ηbrcon", 2);
        let ηbrtru = getValueByName("ηbrtru", 2);
        let ηx = getValueByName("ηx", 2);
        let ηol = getValueByName("ηol", 2);
        let Pct = getValueByName("Pct", 2);
        let u1 = getValueByName("u1", 2);
        let u2 = getValueByName("u2", 2);
        let ux = getValueByName("ux", 2);
        
        if ([ηbrcon, ηbrtru, ηx, ηol, Pct, u1, u2, ux].includes(null)) {
            console.error("Thiếu thông số cần thiết!");
            return null;
        }
        
        let P3 = Pct / (ηx * ηol);
        let P2 = P3 / (ηbrtru * ηol);
        let P1 = P2 / (ηbrcon * ηol);
        let Pdc = P1 / ηol;
        
        if (Pdc < Pct) {
            console.log("Số liệu không hợp lệ");
            return null;
        }
        
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
        
        let ukn = 1;
        let n1 = ndc;
        let n2 = n1 / u1;
        let n3 = n2 / u2;
        
        const torqueFactor = 9.55 * Math.pow(10, 6);
        let Tdc = torqueFactor * (Pdc / ndc);
        let T1 = torqueFactor * (P1 / n1);
        let T2 = torqueFactor * (P2 / n2);
        let T3 = torqueFactor * (P3 / n3);
        let T = torqueFactor * (parseFloat(P) / n);
        
        return { Pdc, P1, P2, P3, ndc, n1, n2, n3, ukn, u1, u2, ux, Tdc, T1, T2, T3, T };
    }    

    //function cho task 2.4
    async function populateBoardTable() {
        const boardTable = document.getElementById("boardTable");
        const rowTemplate = document.getElementById("boardRowTemplate");
        const rowTemplateFiveCols = document.getElementById("boardRowTemplateFiveCols");

        boardTable.innerHTML = "";

        let values = await calculateBoardValues();

        if (!values) return;

        const powerRow = rowTemplate.content.cloneNode(true);
        powerRow.querySelector(".data-label").textContent = "Công suất (kW)";
        powerRow.querySelector(".data-value-engine").textContent = values.Pdc.toFixed(4);
        powerRow.querySelector(".data-value-truc1").textContent = values.P1.toFixed(4);
        powerRow.querySelector(".data-value-truc2").textContent = values.P2.toFixed(4);
        powerRow.querySelector(".data-value-truc3").textContent = values.P3.toFixed(4);
        powerRow.querySelector(".data-value-load").textContent = parseFloat(P).toFixed(4);
        boardTable.appendChild(powerRow);

        const speedRow = rowTemplate.content.cloneNode(true);
        speedRow.querySelector(".data-label").textContent = "Số vòng quay (vg/ph)";
        speedRow.querySelector(".data-value-engine").textContent = values.ndc.toFixed(0);
        speedRow.querySelector(".data-value-truc1").textContent = values.n1.toFixed(0);
        speedRow.querySelector(".data-value-truc2").textContent = values.n2.toFixed(4);
        speedRow.querySelector(".data-value-truc3").textContent = values.n3.toFixed(4);
        speedRow.querySelector(".data-value-load").textContent = n;
        boardTable.appendChild(speedRow);

        const transRow = rowTemplateFiveCols.content.cloneNode(true);
        transRow.querySelector(".data-label").textContent = "Tỷ số truyền (u)";
        transRow.querySelector(".data-value-engine").textContent = values.ukn.toFixed(0);
        transRow.querySelector(".data-value-truc1").textContent = values.u1.toFixed(4);
        transRow.querySelector(".data-value-truc2").textContent = values.u2.toFixed(4);
        transRow.querySelector(".data-value-truc3").textContent = values.ux.toFixed(4);
        boardTable.appendChild(transRow);

        const torqueRow = rowTemplate.content.cloneNode(true);
        torqueRow.querySelector(".data-label").textContent = "Mô-men xoắn (N.mm)";
        torqueRow.querySelector(".data-value-engine").textContent = values.Tdc.toFixed(2);
        torqueRow.querySelector(".data-value-truc1").textContent = values.T1.toFixed(2);
        torqueRow.querySelector(".data-value-truc2").textContent = values.T2.toFixed(2);
        torqueRow.querySelector(".data-value-truc3").textContent = values.T3.toFixed(2);
        torqueRow.querySelector(".data-value-load").textContent = values.T.toFixed(2);
        boardTable.appendChild(torqueRow);
    }

    //Xuat pdf
    document.getElementById("exportPdf").addEventListener("click", function () {
        exportToPDF();
    });
    
    async function exportToPDF() {
        const tab1 = document.getElementById("tab1");
        const tab2 = document.getElementById("tab2");
        const tab3 = document.getElementById("tab3");
        const tab4 = document.getElementById("tab4");
        const boardModalBody = document.querySelector("#boardModal .modal-body");
        const coneGearTable = document.getElementById("coneGear").cloneNode(true);
        const cylinderGearTable = document.getElementById("cylinderGear").cloneNode(true);
        const chainDriveTable = document.getElementById("chainDrive").cloneNode(true);

        const opt = {
            margin: 0.5,
            filename: 'Ket-Qua.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        const container = document.createElement('div');
        document.body.appendChild(container);

        // Tab 1
        const content1 = tab1.querySelector('div').cloneNode(true);
        container.appendChild(content1);
        const break1 = document.createElement('div');
        break1.style.pageBreakAfter = 'always';
        container.appendChild(break1);

        const boardTitle = document.createElement('h5');
        boardTitle.innerHTML = "<i>Bảng phân phối thông số</i>";
        container.appendChild(boardTitle);
        const boardContent = boardModalBody.cloneNode(true);
        container.appendChild(boardContent);
        const breakBoard = document.createElement('div');
        breakBoard.style.pageBreakAfter = 'always';
        container.appendChild(breakBoard);

        // Tab 2
        const content2 = tab2.querySelector('div').cloneNode(true);
        container.appendChild(content2);
        const break2 = document.createElement('div');

        const boardTitleConeGear = document.createElement('h5');
        container.appendChild(boardTitleConeGear);
        container.appendChild(coneGearTable);

        break2.style.pageBreakAfter = 'always';
        container.appendChild(break2);

        // Tab 3
        const content3 = tab3.querySelector('div').cloneNode(true);
        container.appendChild(content3);
        const break3 = document.createElement('div');

        const boardTitleCylinderGear = document.createElement('h5');
        container.appendChild(boardTitleCylinderGear);
        container.appendChild(cylinderGearTable);

        break3.style.pageBreakAfter = 'always';
        container.appendChild(break3);

        // Tab 4
        const content4 = tab4.querySelector('div').cloneNode(true);
        container.appendChild(content4);

        const boardTitleChainDrive = document.createElement('h5');
        container.appendChild(boardTitleChainDrive);
        container.appendChild(chainDriveTable);

        await html2pdf().set(opt).from(container).save();

        container.remove();
    }

    //function support de hien thi linh kien o 3.1.5 va 3.2.4 (3.3.3 wip)
    async function populateNumberBoardTable() {
        var boards = document.getElementsByClassName('board-table');
        
        for (var i = 0; i < boards.length; i++) {
            boards[i].style.display = 'none';
        }
        
        var coneGearTableBody = document.querySelector('#coneGear table tbody');
        coneGearTableBody.innerHTML = "";
        for (var i = 0; i < calculationResultsChap31[0].length; i++) {
            var row = document.createElement('tr');
    
            var nameCell = document.createElement('td');
            nameCell.textContent = calculationResultsChap31[0][i].name;
            row.appendChild(nameCell);
    
            var dataLeadCell = document.createElement('td');
            dataLeadCell.textContent = calculationResultsChap31[0][i].data;
            row.appendChild(dataLeadCell);
    
            var dataDrivenCell = document.createElement('td');
            dataDrivenCell.textContent = calculationResultsChap31[1][i].data;
            row.appendChild(dataDrivenCell);
    
            coneGearTableBody.appendChild(row);
        }
        document.getElementById('coneGear').style.display = 'block';
    
        var cylinderGearTableBody = document.querySelector('#cylinderGear table tbody');
        cylinderGearTableBody.innerHTML = "";
        for (var i = 0; i < calculationResultsChap32[0].length; i++) {
            var row = document.createElement('tr');
    
            var nameCell = document.createElement('td');
            nameCell.textContent = calculationResultsChap32[0][i].name;
            row.appendChild(nameCell);
    
            var dataLeadCell = document.createElement('td');
            dataLeadCell.textContent = calculationResultsChap32[0][i].data;
            row.appendChild(dataLeadCell);
    
            var dataDrivenCell = document.createElement('td');
            dataDrivenCell.textContent = calculationResultsChap32[1][i].data;
            row.appendChild(dataDrivenCell);
    
            cylinderGearTableBody.appendChild(row);
        }
        document.getElementById('cylinderGear').style.display = 'none';
    
        var chainDriveTableBody = document.querySelector('#chainDrive table tbody');
        chainDriveTableBody.innerHTML = "";
        for (var i = 0; i < calculationResultsChap33[0].length; i++) {
            var row = document.createElement('tr');
    
            var nameCell = document.createElement('td');
            nameCell.textContent = calculationResultsChap33[0][i].name;
            row.appendChild(nameCell);
    
            var dataCell = document.createElement('td');
            dataCell.textContent = calculationResultsChap33[0][i].data;
            row.appendChild(dataCell);
    
            chainDriveTableBody.appendChild(row);
        }

        document.getElementById('chainDrive').style.display = 'none';
    }  

    //nut hien bang cho 2.4
    document.getElementById("boardModel").addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("boardModal")).show();
        populateBoardTable();
    });

    //nut hien bang linh kien
    document.getElementById("numberBoardModel").addEventListener("click", () => {
        populateNumberBoardTable()
        new bootstrap.Modal(document.getElementById("numberBoardModal")).show();
    });

    class CalculationStep {
        constructor() {
            this.nextStep = null;
        }

        setNext(step) {
            this.nextStep = step;
            return step;
        }

        async handle(currentStep) {
            if (this.nextStep) {
                await this.nextStep.handle(currentStep);
            }
        }
    }

    // Step Handlers (Mỗi bước trong chuỗi)
    class CalculateSystemEfficiencyStep extends CalculationStep {
        async handle(currentStep) {
            if (currentStep === 1) {
                await calculateSystemEfficiency();
            }
            await super.handle(currentStep);
        }
    }

    class CalculatePreliminaryRPMStep extends CalculationStep {
        async handle(currentStep) {
            if (currentStep === 2) {
                await calculatePreliminaryRPM();
            }
            await super.handle(currentStep);
        }
    }

    class LoadSuitableEnginesStep extends CalculationStep {
        async handle(currentStep) {
            if (currentStep === 3) {
                await loadSuitableEngines();
            }
            await super.handle(currentStep);
        }
    }

    class RedistributeTransmissionRatioStep extends CalculationStep {
        async handle(currentStep) {
            if (currentStep === 4) {
                await redistributeTransmissionRatio();
            }
            await super.handle(currentStep);
        }
    }

    class LoadBevelGearMaterialsStep extends CalculationStep {
        async handle(currentStep) {
            if (currentStep === 5) {
                await loadBevelGearMaterials();
            }
            await super.handle(currentStep);
        }
    }

    class LoadShaftGearMaterialsStep extends CalculationStep {
        async handle(currentStep) {
            if (currentStep === 7) {
                await loadShaftGearMaterials();
            }
            await super.handle(currentStep);
        }
    }

    class LoadChainStep extends CalculationStep {
        async handle(currentStep) {
            if (currentStep === 9) {
                await loadChain();
            }
            await super.handle(currentStep);
        }
    }

    // Calculation Chain Manager
    class CalculationChain {
        constructor() {
            this.setupChain();
        }

        setupChain() {
            const step1 = new CalculateSystemEfficiencyStep();
            const step2 = new CalculatePreliminaryRPMStep();
            const step3 = new LoadSuitableEnginesStep();
            const step4 = new RedistributeTransmissionRatioStep();
            const step5 = new LoadBevelGearMaterialsStep();
            const step7 = new LoadShaftGearMaterialsStep();
            const step9 = new LoadChainStep();

            step1.setNext(step2)
                .setNext(step3)
                .setNext(step4)
                .setNext(step5)
                .setNext(step7)
                .setNext(step9);

            this.chain = step1;
        }

        async nextStep() {
            await this.chain.handle(currentStep + 1); //handle cho load
            if (currentStep != 5 && currentStep != 7)
            {
                await this.chain.handle(currentStep); //handle cho tính toán
            }
            currentStep++;
            showStep(currentStep);
            console.log("Sang bước: ", currentStep)
            localStorage.setItem("lastStep", currentStep);
        }

        async prevStep() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        }
    }

    // Initialize Calculation Chain
    const calculationChain = new CalculationChain();
    
    //function linh tinh support cho chuyen buoc
    $("#nextStep").click(async function () {
        await calculationChain.nextStep();
    });

    $("#prevStep").on("click", async function () {
        await calculationChain.prevStep();
    });


    function showStep(step) {
        $(".calculation-step").addClass("d-none");
        $("#step" + step).removeClass("d-none");
        $("#prevStep").prop("disabled", step === 1);
        $("#nextStep").prop("disabled", step === 10);
    }

    document.getElementById("autoCalculationBtn").addEventListener("click", function() {
        this.classList.toggle("active");
    });
    

    //remaining task: history
});

