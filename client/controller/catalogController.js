document.addEventListener("DOMContentLoaded", async () => {
    if (document.getElementById("engineTable")) {
        await loadEngineData();
    }
    if (document.getElementById("gearMaterialTable")) {
        await loadGearMaterialData();
    }
});

async function loadEngineData(searchQuery = "") {
    try {
        const response = await fetch(`api.php?action=getEngineData&search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (!data.success) {
            console.error("Không thể lấy dữ liệu động cơ:", data.message);
            return;
        }

        const engineTable = document.getElementById("engineTable");
        engineTable.innerHTML = "";

        data.engines
            .filter(engine => Object.values(engine).some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase())))
            .forEach(engine => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${engine.kieu_dong_co}</td>
                    <td>${engine.cong_suat_kw} kW</td>
                    <td>${engine.cong_suat_ma_luc} HP</td>
                    <td>${engine.van_toc_50Hz} RPM (50Hz)</td>
                    <td>${engine.van_toc_60Hz} RPM (60Hz)</td>
                    <td>${engine.hieu_suat} %</td>
                    <td>${engine.cos_phi}</td>
                    <td>${engine.I_K_I_dn}</td>
                    <td>${engine.T_K_T_dn}</td>
                    <td>${engine.khoi_luong} kg</td>
                `;
                engineTable.appendChild(row);
            });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu động cơ:", error);
    }
}

async function loadGearMaterialData(searchQuery = "") {
    try {
        const response = await fetch(`api.php?action=getGearMaterialData&search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (!data.success || !Array.isArray(data.materials)) {
            console.error("Lỗi dữ liệu vật liệu:", data.message || "Dữ liệu không hợp lệ.");
            return;
        }

        const gearMaterialTable = document.getElementById("gearMaterialTable");
        gearMaterialTable.innerHTML = "";

        data.materials
            .filter(material => Object.values(material).some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase())))
            .forEach(material => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${material.NhanHieuThep}</td>
                    <td>${material.NhietLuyen}</td>
                    <td>${material.KichThuocS_Min} - ${material.KichThuocS_Max}</td>
                    <td>${material.DoRanMin} - ${material.DoRanMax}</td>
                    <td>${material.GioiHanBenMin} - ${material.GioiHanBenMax}</td>
                    <td>${material.GioiHanChay}</td>
                `;
                gearMaterialTable.appendChild(row);
            });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu vật liệu bánh răng:", error);
    }
}

// Search functionality
const searchForm = document.querySelector("form[method='GET']");
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchQuery = searchForm.querySelector("input[name='search']").value.trim();

    if (document.getElementById("engineTable")) {
        await loadEngineData(searchQuery);
    }

    if (document.getElementById("gearMaterialTable")) {
        await loadGearMaterialData(searchQuery);
    }
});
