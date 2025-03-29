CREATE DATABASE HHTT1;
USE HHTT1;

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE Workspace (
    id INT PRIMARY KEY AUTO_INCREMENT,
    num_of_steps INT,
    code VARCHAR(6) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    P DECIMAL(18,4),
    n INT,             
    L DECIMAL(18,4),
    CONSTRAINT FK_Workspace_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Guest (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    workspace_id INT NOT NULL,
    CONSTRAINT FK_Guest_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_Guest_Workspace FOREIGN KEY (workspace_id) REFERENCES Workspace(id) ON DELETE CASCADE,
    CONSTRAINT UQ_Guest_User_Workspace UNIQUE (user_id, workspace_id)
);

CREATE TABLE CalculationHistory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    workspace_id INT NOT NULL,
    
    CONSTRAINT FK_CalculationHistory_Workspace FOREIGN KEY (workspace_id) REFERENCES Workspace(id) ON DELETE CASCADE
);

CREATE INDEX idx_workspace_code ON Workspace(code);

-- 2.3
CREATE TABLE TriSoHieuSuat(
    TenGoi VARCHAR(100) PRIMARY KEY,
    HieuSuatDuoccheMin DECIMAL(5, 2),
    HieuSuatDuoccheMax DECIMAL(5, 2),
    HieuSuatDeHoMin DECIMAL(5, 2),
    HieuSuatDeHoMax DECIMAL(5, 2)
);

-- 2.4
CREATE TABLE TiSoTruyenTrongHe(
    LoaiTruyen VARCHAR(100) PRIMARY KEY,
    TisoTruyenMin INT,
    TisoTruyenMax INT
);

-- 5.2
CREATE TABLE ThongSoXichConLan (
    BuocXich DECIMAL(5, 2),
    B_0 DECIMAL(5, 2),
    do_x DECIMAL(5, 2),  -- `do` is a reserved keyword; renamed to `do_x`
    d1 DECIMAL(5, 2),
    l DECIMAL(5, 2),
    b DECIMAL(5, 2),
    h DECIMAL(5, 2),    
    Q DECIMAL(5, 2),
    q1 DECIMAL(5, 2),
    LoaiXichConLan VARCHAR(20)
);

-- 5.3
CREATE TABLE ThongSoXichRang (
    BuocXich DECIMAL(5, 2),
    b DECIMAL(5, 2),
    b1 DECIMAL(5, 2),
    S DECIMAL(5, 2),
    B_0 FLOAT,
    l FLOAT,
    Q_0 INT,
    q FLOAT
);

-- 5.4
CREATE TABLE SoRangXich (
    LoaiXich VARCHAR(50),
    z1_u_Min1 INT,
    z1_u_Max2 INT,
    z1_u_Min2 INT,
    z1_u_Max3 INT,
    z1_u_Min3 INT,
    z1_u_Max4 INT,
    z1_u_Min4 INT,
    z1_u_Max5 INT,
    z1_u_Min5 INT,
    z1_u_Max6 INT,
    z1_u_6 INT
);

-- 5.5
CREATE TABLE CongSuatChoPhep (
    BuocXich DECIMAL(5, 2),
    DuongKinhChot DECIMAL(5, 2),
    ChieuDaiOng DECIMAL(5, 2),
    CongSuatChoPhep_50 DECIMAL(5, 2),
    CongSuatChoPhep_200 DECIMAL(5, 2),
    CongSuatChoPhep_400 DECIMAL(5, 2),
    CongSuatChoPhep_600 DECIMAL(5, 2),
    CongSuatChoPhep_800 DECIMAL(5, 2),
    CongSuatChoPhep_1000 DECIMAL(5, 2),
    CongSuatChoPhep_1200 DECIMAL(5, 2),
    CongSuatChoPhep_1600 DECIMAL(5, 2)
);

-- 5.6
CREATE TABLE TriSoHeSok (
    DieuKienLamViec VARCHAR(255),
    MoiTruongLamViec VARCHAR(50),
    BoiTron VARCHAR(50),
    TriSoCacHeSo VARCHAR(50)
);

-- 5.8
CREATE TABLE TriSoBuocXichMax(
    n1_z1_15 INT,
    n1_z1_17 INT,
    BuocXichLonNhat DECIMAL(6, 3)
);

-- 5.9
CREATE TABLE SoLanVaDap (
    LoaiXich VARCHAR(50),
    SoLanVaDap_p_12_7 DECIMAL(5, 2),
    SoLanVaDap_p_15_875 DECIMAL(5, 2),
    SoLanVaDap_p_19_05 DECIMAL(5, 2),
    SoLanVaDap_p_25_4 DECIMAL(5, 2),
    SoLanVaDap_p_31_75 DECIMAL(5, 2),
    SoLanVaDap_p_38_1 DECIMAL(5, 2),
    SoLanVaDap_p_44_45 DECIMAL(5, 2),
    SoLanVaDap_p_50_8 DECIMAL(5, 2)
);

-- 5.10
CREATE TABLE TriSoHeSoAnToan (
    p_Min DECIMAL(6,3), 
    p_Max DECIMAL(6,3), 
    HeSoAnToan_n1_50 DECIMAL(6,2),
    HeSoAnToan_n1_200 DECIMAL(6,2),
    HeSoAnToan_n1_400 DECIMAL(6,2),
    HeSoAnToan_n1_600 DECIMAL(6,2),
    HeSoAnToan_n1_800 DECIMAL(6,2),
    HeSoAnToan_n1_1000 DECIMAL(6,2),
    HeSoAnToan_n1_1200 DECIMAL(6,2),
    HeSoAnToan_n1_1600 DECIMAL(6,2),
    HeSoAnToan_n1_2000 DECIMAL(6,2),
    HeSoAnToan_n1_2400 DECIMAL(6,2),
    HeSoAnToan_n1_2800 DECIMAL(6,2)
);

-- 5.11
CREATE TABLE UngSuatTiepXuc (
    VatLieu NVARCHAR(100), 
    NhietLuyen NVARCHAR(100), 
    DoRanMatRang NVARCHAR(50),  
    UngSuatTiepXucMin  INT, 
	 UngSuatTiepXucMax  INT, 
    DieukienLamViec NVARCHAR(100)
);
-- 5.12
CREATE TABLE DienTichChieuBanLe (
    BuocXich DECIMAL(6,3),
	ConLan_1day DECIMAL(6,1),
	ConLan_2day DECIMAL(6,1),
	ConLan_3day DECIMAL(6,1),
	ConLan_4day DECIMAL(6,1)
	);

-- 6.1
CREATE TABLE CoTinhVatLieuBanhRang (
    NhanHieuThep NVARCHAR(20), 
    NhietLuyen NVARCHAR(50), 
    KichThuocS_Min INT, 
	KichThuocS_Max INT,
    DoRanMin NVARCHAR (50), 
	DoRanMax NVARCHAR (50),
    GioiHanBenMin INT, 
	GioiHanBenMax INT, 
    GioiHanChay INT 
);
-- 6,2
CREATE TABLE TriSoUngVoiChuKyCoSo (
    VatLieu NVARCHAR(100), 
    NhietLuyen NVARCHAR(100), 
    DoRanMatRangMin  NVARCHAR(50), 
	DoRanMatRangMax NVARCHAR(50), 
    DoRanLoiRangMin  NVARCHAR(50),
	DoRanLoiRangMax  NVARCHAR(50), 
    SigmaHlim NVARCHAR(20), 
    SH DECIMAL(5, 2), 
    SigmaFlim NVARCHAR(20), 
    Sp DECIMAL(5, 2) 
);
-- 6,4
CREATE TABLE TriSoDoBen (
    WorkMode NVARCHAR(10),
    NhietLuyen NVARCHAR(50),
    mH_2 FLOAT,
    K_HE FLOAT,
    NhietLuyen_1 NVARCHAR(50),
    mF_1 FLOAT,
    K_FE_1 FLOAT,
    HeatTreatmentSurface NVARCHAR(50),
    mF_2 FLOAT,
    K_FE_2 FLOAT
);
-- 6,5
CREATE TABLE HeSoPhuThuocBanhRang (
    HeSo NVARCHAR(50),
    LoaiRang NVARCHAR(50),
    SteelSteel FLOAT,
    SteelCastIron FLOAT,
    SteelBronze FLOAT,
    CastIronCastIron FLOAT,
    TextoliteSteel FLOAT,
    PolyamideSteel FLOAT
);
-- 6,6
CREATE TABLE TriSoViTriBanhRang (
    ViTri NVARCHAR(50),
    TriSo NVARCHAR(50),
    DoRanMatRang_Min1 NVARCHAR(50),
	DoRanMatRang_Max1 NVARCHAR(50),
    DoRanMatRang_Min2 NVARCHAR(50),
	DoRanMatRang_Max2 NVARCHAR(50),
    DieuKien_1 NVARCHAR(50),
    DieuKien_2 NVARCHAR(50)
);
-- 6.7
CREATE TABLE TriSoPhanBoKhongDeu(
    HeSo_bd DECIMAL(5, 2),
	DoCungBanhRang NVARCHAR(50),
	K_H_Belta_1 DECIMAL(5, 2),
	K_H_Belta_2 DECIMAL(5, 2),
	K_H_Belta_3 DECIMAL(5, 2),
	K_H_Belta_4 DECIMAL(5, 2),
	K_H_Belta_5 DECIMAL(5, 2),
	K_H_Belta_6 DECIMAL(5, 2),
	K_H_Belta_7 DECIMAL(5, 2),
	K_F_Belta_1 DECIMAL(5, 2),
	K_F_Belta_2 DECIMAL(5, 2),
	K_F_Belta_3 DECIMAL(5, 2),
	K_F_Belta_4 DECIMAL(5, 2),
	K_F_Belta_5 DECIMAL(5, 2),
	K_F_Belta_6 DECIMAL(5, 2),
	K_F_Belta_7 DECIMAL(5, 2)
);
-- 6.8??
CREATE TABLE TriSoModun (
    m_Day_1 DECIMAL(5,2),
    m_Day_2 DECIMAL(5,2)
	);
-- 6.9 khong biet luu kieu gi
CREATE TABLE HeSoChinhDichBanhRang (
    x1 DECIMAL(5,2),
	x2 DECIMAL(5,2),
	TruyenDongBanhRangThang NVARCHAR(100),
	TruyenDongBanhRangNghieng_V NVARCHAR(255)
	);
-- 6.10a
CREATE TABLE TriSoDichChinhKhoangCach (
    k_y FLOAT,
    k_x FLOAT
	);
-- 6.10b
CREATE TABLE TriSoDichTrinhChatLuong (
    k_x FLOAT,
    k_y FLOAT
	);
-- 6.15
CREATE TABLE TriSoSaiSoAnKhop(
    DoRanMatBanh NVARCHAR(50),
	DangBanh NVARCHAR(50),
	SaiSo_H DECIMAL(5,3),
	SaiSo_F DECIMAL(5,3)
);
-- 6.21 
CREATE TABLE TriSoPhanBoKhongDeuBanhRangCon(
    HeSo DECIMAL(5, 2),
	LoaiTrucLap NVARCHAR(30),
	DoRanMatRang NVARCHAR(10),
	LoaiRang NVARCHAR(10),
	K_H_Belta DECIMAL(5, 2),
	K_F_Belta DECIMAL(5, 2)
);
-- 6.20
CREATE TABLE HeSoDichChinh (
    SoRang INT,
    TriSoTruyen_1_12 DECIMAL(5,2),
    TriSoTruyen_1_25 DECIMAL(5,2),
    TriSoTruyen_1_4 DECIMAL(5,2),
    TriSoTruyen_1_6 DECIMAL(5,2),
    TriSoTruyen_1_8 DECIMAL(5,2),
    TriSoTruyen_2_0 DECIMAL(5,2),
    TriSoTruyen_2_5 DECIMAL(5,2),
    TriSoTruyen_3_15 DECIMAL(5,2),
    TriSoTruyen_4_0 DECIMAL(5,2),
    TriSoTruyen_5_0 DECIMAL(5,2),
    TriSoTruyen_6_3_and_above DECIMAL(5,2)
);
-- 6.22
CREATE TABLE SoBanhRangNho(
    d_el INT,
	LoaiBanhRangCon VARCHAR (50) ,
	SoRangNhoTaiTySoTruyen_1 INT,
	SoRangNhoTaiTySoTruyen_2 INT,
	SoRangNhoTaiTySoTruyen_3_15 INT,
	SoRangNhoTaiTySoTruyen_4 INT,
	SoRangNhoTaiTySoTruyen_6 INT
);

-- Dong co dien K
CREATE TABLE DongCoDienK (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kieu_dong_co VARCHAR(50),
    cong_suat_kw FLOAT,
    cong_suat_ma_luc FLOAT,
    van_toc_50Hz INT,
    van_toc_60Hz INT,
    hieu_suat FLOAT,
    cos_phi FLOAT,
    I_K_I_dn FLOAT,
    T_K_T_dn FLOAT,
    khoi_luong FLOAT
);

-- 2.3
INSERT INTO TriSoHieuSuat (TenGoi, HieuSuatDuoccheMin, HieuSuatDuoccheMax, HieuSuatDeHoMin, HieuSuatDeHoMax)
VALUES
(N'Bộ truyền bánh răng trụ', 0.96, 0.98, 0.93, 0.95),
(N'Bộ truyền bánh răng côn', 0.95, 0.97, 0.92, 0.94),
(N'Bộ truyền trục vít - Tự hãm', 0.30, 0.40, 0.20, 0.30),
(N'Bộ truyền trục vít - Không tự hãm với z₁ = 1', 0.70, 0.75, NULL, NULL),
(N'Bộ truyền trục vít - Không tự hãm với z₁ = 2', 0.75, 0.82, NULL, NULL),
(N'Bộ truyền trục vít - Không tự hãm với z₁ = 4', 0.87, 0.92, NULL, NULL),
(N'Bộ truyền xích', 0.95, 0.97, 0.90, 0.93),
(N'Bộ truyền bánh ma sát', 0.90, 0.96, 0.70, 0.88),
(N'Bộ truyền đai', NULL, NULL, 0.95, 0.96),
(N'Một cặp ổ lăn', 0.99, 0.995, NULL, NULL),
(N'Một cặp ổ trượt', 0.98, 0.90, NULL, NULL);

-- 2.4
INSERT INTO TiSoTruyenTrongHe (LoaiTruyen,TisoTruyenMin,TisoTruyenMax)
VALUES
(N'Truyền động bánh răng trụ để hở',4,6),
(N'Truyền động bánh răng trụ hộp giảm tốc 1 cấp',3,5),
(N'Truyền động bánh răng trụ hộp giảm tốc 2 cấp',8,40),
(N'Truyền động bánh răng côn để hở',2,3),
(N'Truyền động bánh răng côn Hộp giảm tốc 1 cấp',2,4),
(N'Truyền động bánh răng côn Hộp giảm tốc côn - trụ 2 cấp',10,25),
(N'Truyền động trục vít để hở',15,60),
(N'Truyền động trục vít Hộp giảm tốc 1 cấp',10,40),
(N'Truyền động trục vít Hộp giảm tốc 2 cấp trục vít',300,800),
(N'Truyền động trục vít Hộp giảm tốc 2 cấp trục vít - bánh răng hoặc bánh răng - trục vít',60,90),
(N'Truyền động đai dẹt Thường',2,4),
(N'Truyền động đai dẹt Có bánh căng',4,6),
(N'Truyền động đai thang',3,5),
(N'Truyền động Xích',2,5),
(N'Truyền động bánh ma sát',2,4);
-- 5.2
INSERT INTO ThongSoXichConLan (BuocXich,B_0,do_x,d1,l,b,h,Q,q1,LoaiXichConLan)
VALUES
(8.00, 3.00, 2.31, 5.00, NULL, 12.00, 7.5, 4.6, 0.2,N'Xích con lăn 1 dãy'),
(9.525, 5.72, 3.28, 6.35, NULL, 17.00, 8.5, 9.1, 0.45,N'Xích con lăn 1 dãy'),
(12.70, 2.40, 3.66, 7.75, NULL, 8.7, 10.0, 9.0, 0.3,N'Xích con lăn 1 dãy'),
(12.70, 3.30, 3.66, 7.75, NULL, 12, 10, 9.0, 0.35,N'Xích con lăn 1 dãy'),
(12.70, 5.40, 4.45, 8.51, NULL, 19.00, 11.8, 18.2, 0.65,N'Xích con lăn 1 dãy'),
(12.70, 7.75, 4.45, 8.51, NULL, 21.00, 11.8, 18.2, 0.75,N'Xích con lăn 1 dãy'),
(15.875, 6.48, 5.08, 10.16, NULL, 20.00, 14.8, 22.7, 0.8,N'Xích con lăn 1 dãy');

-- 5.3
INSERT INTO ThongSoXichRang (BuocXich,b,b1,S,B_0,l,Q_0,q)
VALUES
(12.7, 13.4, 7.0, 1.5, 22.5, 28.5, 26, 1.3),
(12.7, 13.4, 7.0, 1.5, 28.5, 34.5, 31, 1.6),
(12.7, 13.4, 7.0, 1.5, 34.5, 40.5, 36, 2.0),
(12.7, 13.4, 7.0, 1.5, 40.5, 46.5, 42, 2.3),
(12.7, 13.4, 7.0, 1.5, 46.5, 52.5, 49, 2.7),
(12.7, 13.4, 7.0, 1.5, 52.5, 58.5, 56, 3.0),
(15.875, 16.7, 8.7, 2.0, 30, 39, 41, 2.2),
(15.875, 16.7, 8.7, 2.0, 38, 46, 50, 2.7),
(15.875, 16.7, 8.7, 2.0, 46, 54, 58, 3.3),
(15.875, 16.7, 8.7, 2.0, 54, 62, 69, 3.9),
(15.875, 16.7, 8.7, 2.0, 62, 70, 86, 4.4),
(15.875, 16.7, 8.7, 2.0, 70, 78, 91, 5.0),
(19.05, 20.1, 10.5, 3.0, 45, 54, 74, 3.9),
(19.05, 20.1, 10.5, 3.0, 57, 66, 89, 4.9),
(19.05, 20.1, 10.5, 3.0, 69, 78, 105, 5.9),
(19.05, 20.1, 10.5, 3.0, 81, 90, 124, 7.0),
(19.05, 20.1, 10.5, 3.0, 93, 102, 143, 8.0),
(25.4, 26.7, 13.35, 3.0, 57, 65, 116, 8.4),
(25.4, 26.7, 13.35, 3.0, 75, 84, 132, 10.8),
(25.4, 26.7, 13.35, 3.0, 93, 102, 164, 13.2),
(25.4, 26.7, 13.35, 3.0, 104, 120, 196, 15.4),
(31.75, 33.4, 16.7, 3.0, 75, 85, 166, 14.35),
(31.75, 33.4, 16.7, 3.0, 93, 103, 206, 16.55),
(31.75, 33.4, 16.7, 3.0, 111, 121, 246, 18.8),
(31.75, 33.4, 16.7, 3.0, 129, 139, 286, 21.0);
-- 5.4
INSERT INTO SoRangXich (LoaiXich, z1_u_Min1, z1_u_Max2, z1_u_Min2, z1_u_Max3, z1_u_Min3, z1_u_Max4, z1_u_Min4, z1_u_Max5, z1_u_Min5, z1_u_Max6, z1_u_6) VALUES
('Xích ống và xích con lăn', 31, 27, 27, 25, 25, 23, 23, 21, 21, 17, 15),
('Xích răng', 35, 32, 32, 30, 30, 27, 27, 23, 23, 19, 17);

-- 5.5
INSERT INTO CongSuatChoPhep (BuocXich, DuongKinhChot, ChieuDaiOng, CongSuatChoPhep_50, CongSuatChoPhep_200, CongSuatChoPhep_400, CongSuatChoPhep_600, CongSuatChoPhep_800, CongSuatChoPhep_1000, CongSuatChoPhep_1200, CongSuatChoPhep_1600) 
VALUES
(12.7, 3.66, 5.80, 0.19, 0.68, 1.23, 1.68, 2.06, 2.42, 2.72, 3.20),
(12.7, 4.45, 8.90, 0.35, 1.27, 2.29, 3.13, 3.86, 4.52, 5.06, 5.95),
(12.7, 4.45, 11.30, 0.45, 1.61, 2.91, 3.98, 4.90, 5.74, 6.43, 7.55),
(15.875, 5.08, 10.11, 0.57, 2.06, 3.72, 5.08, 6.26, 7.34, 8.22, 9.65),
(15.875, 5.08, 13.28, 0.75, 2.70, 4.88, 6.67, 8.22, 9.63, 10.80, 12.70),
(19.05, 5.96, 17.75, 1.41, 4.80, 8.38, 11.4, 13.5, 15.3, 16.9, 19.3),
(25.40, 7.95, 22.61, 3.20, 11.0, 19.0, 25.7, 30.7, 34.7, 38.3, 43.8),
(31.75, 9.65, 27.46, 5.83, 19.3, 32.0, 42.0, 49.3, 54.9, 60.0, NULL),
(38.10, 11.12, 35.46, 10.5, 34.8, 57.7, 75.7, 88.9, 99.2, 108, NULL),
(44.45, 12.72, 37.19, 14.7, 43.7, 70.6, 88.3, 101, NULL, NULL, NULL),
(50.80, 14.29, 45.21, 22.9, 68.1, 110, 138, 157, NULL, NULL, NULL);

-- 5.6
INSERT INTO TriSoHeSok(DieuKienLamViec, MoiTruongLamViec, BoiTron, TriSoCacHeSo) 
VALUES 
('Đường nối hai tâm đĩa xích so với đường nằm ngang đến 60°', NULL, NULL, 'k₀ = 1'),
('Đường nối hai tâm đĩa xích so với đường nằm ngang trên 60°', NULL, NULL, 'k₀ = 1,25'),
('Khoảng cách trục a = (30 ... 50)p', NULL, NULL, 'ka = 1'),
('a >= 25p', NULL, NULL, 'ka = 1,25'),
('a  (60 ... 80)p', NULL, NULL, 'ka = 0,8'),
('Vị trí trục được điều chỉnh bằng một trong các đĩa xích', NULL, NULL, 'k_dc = 1'),
('Vị trí trục được điều chỉnh bằng đĩa căng hoặc con lăn căng xích', NULL, NULL, 'k_dc = 1,1'),
('Vị trí trục được điều chỉnh bằng vị trí trục không điều chỉnh được', NULL, NULL, 'k_dc = 1,25'),
('Tải trọng tĩnh, làm việc êm', NULL, NULL, 'k_d = 1'),
('Tải trọng va đập', NULL, NULL, 'k_d = 1,2 ... 1,5'),
('Tải trọng va đập mạnh', NULL, NULL, 'k_d = 1,8'),
('Làm việc 1 ca', NULL, NULL, 'k_c = 1'),
('Làm việc 2 ca', NULL, NULL, 'k_c = 1,25'),
('Làm việc 3 ca', NULL, NULL, 'k_c = 1,45'),
(NULL, 'Không bụi', 'I', 'k_bt = 0,8'),
(NULL, 'Không bụi', 'II', 'k_bt = 1'),
(NULL, 'Có bụi', 'II', 'k_bt = 1,3'),
(NULL, 'Có bụi', 'III', 'k_bt = 1,8 khi v < 4 m/s'),
(NULL, 'Có bụi', 'III', 'k_bt = 3 khi v < 7 m/s'),
(NULL, 'Bẩn', 'III', 'k_bt = 3 khi v < 4 m/s'),
(NULL, 'Bẩn', 'III', 'k_bt = 6 khi v < 7 m/s'),
(NULL, 'Bẩn', 'IV', 'k_bt = 6 khi v < 4 m/s');
-- 5.8
INSERT INTO TriSoBuocXichMax(n1_z1_15, n1_z1_17, BuocXichLonNhat) 
VALUES 
(1250, 3300, 12.7),
(1000, 2650, 15.875),
(900, 2000, 19.05),
(800, 1650, 25.4),
(630, 1320, 31.75),
(500, NULL, 38.1),
(400, NULL, 44.45),
(300, NULL, 50.8);

-- 5.9
INSERT INTO SoLanVaDap (LoaiXich, SoLanVaDap_p_12_7, SoLanVaDap_p_15_875, SoLanVaDap_p_19_05, SoLanVaDap_p_25_4, SoLanVaDap_p_31_75, SoLanVaDap_p_38_1, SoLanVaDap_p_44_45, SoLanVaDap_p_50_8) 
VALUES
('Xích ống và xích con lăn', 60, 50, 35, 30, 25, 20, 15, 15),
('Xích răng', 80, 65, 50, 30, 25, NULL, NULL, NULL);

-- 5.10
INSERT INTO TriSoHeSoAnToan (p_Min, p_Max, HeSoAnToan_n1_50, HeSoAnToan_n1_200, HeSoAnToan_n1_400, HeSoAnToan_n1_600, HeSoAnToan_n1_800, HeSoAnToan_n1_1000, HeSoAnToan_n1_1200, HeSoAnToan_n1_1600, HeSoAnToan_n1_2000, HeSoAnToan_n1_2400, HeSoAnToan_n1_2800)
VALUES
(12.7, 15.875, 7, 7.8, 8.5, 9.3, 10.2, 11, 11.7, 13.2, 14.8, 16.3, 18),
(19.05, 25.4, 7, 8.2, 9.3, 10.3, 11.7, 12.9, 14, 16.3, NULL, NULL, NULL),
(31.75, 38.1, 7, 8.5, 10.2, 13.2, 14.8, 16.3, 19.5, NULL, NULL, NULL, NULL),
(44.45, 50.8, 7, 9.3, 11.7, 14, 16.3, NULL, NULL, NULL, NULL, NULL, NULL);
-- 5.11
INSERT INTO UngSuatTiepXuc (VatLieu, NhietLuyen, DoRanMatRang, UngSuatTiepXucMin,UngSuatTiepXucMax, DieukienLamViec)
VALUES
('Gang xám CЧ 24-44 CЧ 28-48', 'Tôi, ram', 'HB321...429', 550,650 , 'Đĩa bị động có số răng lớn (z > 50) với vận tốc xích v < 3 m/s.'),
('Thép 45', 'Tôi cải thiện', 'HB170...210', 500,600 , 'Đĩa bị động có z > 30 với vận tốc xích v < 5 m/s.'),
('Thép 45, 45T, 50, 50T', 'Tôi, ram', 'HRC45...50', 800,900, 'Đĩa chủ động và bị động có số răng z < 40 không bị va đập mạnh khi làm việc.'),
('Thép 15, 20, 20X', 'Thấm cacbon, tôi, ram', 'HRC55-60', 930,1030, 'Đĩa chủ động và đĩa bị động có số răng nhỏ (z < 19).');

-- 5.12
INSERT INTO DienTichChieuBanLe (BuocXich, ConLan_1day, ConLan_2day, ConLan_3day, ConLan_4day)
VALUES
(8.00, 11, NULL, NULL, NULL),
(9.525, 28, NULL, NULL, NULL),
(12.7, 39.6, 85.3, 125.5, NULL),
(15.875, 51.5, 115, 169, NULL),
(19.05, 106, 180, 265, 318),
(25.4, 180, 306, 450, 540),
(31.75, 262, 446, 655, 786),
(38.1, 395, 672, 986, 1185),
(44.45, 473, 802, 1180, 1420),
(50.8, 645, 1095, 1610, 1935);

-- 6.1
INSERT INTO CoTinhVatLieuBanhRang (NhanHieuThep, NhietLuyen, KichThuocS_Min, KichThuocS_Max, DoRanMin, DoRanMax, GioiHanBenMin, GioiHanBenMax, GioiHanChay) 
VALUES 
('40', N'Tôi cải thiện', 0, 60, 'HB 192', 'HB 228', 700, NULL, 400),
('45', N'Thường hóa', 0, 80, 'HB 170', 'HB 217', 600, NULL, 340),
('45', N'Tôi cải thiện', 0, 100, 'HB 192', 'HB 240', 750, NULL, 450),
('45', N'Tôi cải thiện', 0, 60, 'HB 241', 'HB 285', 850, NULL, 580),
('50', N'Thường hóa', 0, 80, 'HB 179', 'HB 228', 640, NULL, 380),
('50', N'Thường hóa', 0, 80, 'HB 179', 'HB 228', 640, NULL, 380),
('50', N'Tôi cải thiện', 0, 80, 'HB 228', 'HB 255', 700, 800, 530),
('40X', N'Tôi cải thiện', 0, 100, 'HB 230', 'HB 260', 850, NULL, 550),
('40X', N'Tôi cải thiện', 0, 60, 'HB 260', 'HB 280', 950, NULL, 700),
('40X', N'Thấm nitơ', 0, 60, 'HRC 50', 'HRC 59', 1000, NULL, 800),
('45X', N'Tôi cải thiện', 0 , 100, 'HB 230', 'HB 280', 850, NULL, 650),
('45X', N'Tôi cải thiện', 100, 300, 'HB 163', 'HB 269', 750, NULL, 500),
('45X', N'Tôi cải thiện', 300, 500, 'HB 163', 'HB 269', 700, NULL, 450),
('40XH', N'Tôi cải thiện', 0 , 100, 'HB 230', 'HB 300', 850, NULL, 600),
('40XH', N'Tôi cải thiện', 100, 300, 'HB >= 241', NULL, 800, NULL, 580),
('40XH', N'Tôi', 0 , 40, 'HRC 48', 'HRC 54', 1600, NULL, 1400),
('35XM', N'Tôi cải thiện', 0 , 100, 'HB 241', NULL, 900, NULL, 800),
('35XM', N'Tôi cải thiện',0, 50, 'HB 269', NULL, 900, NULL, 800),
('35XM', N'Tôi cải thiện', 0, 40, 'HRC 45', 'HRC 53', 1600, NULL, 1400),
('20X', N'Thấm cacbon', 0, 60, 'HRC 46', 'HRC 53', 650, NULL, 400),
('12XH3A', N'Thấm cacbon', 0, 60, 'HRC 56', 'HRC 63', 900, NULL, 700),
('25XTT', N'Thấm cacbon', NULL, NULL, 'HRC 58', 'HRC 63', 1150, NULL, 950),
('45Л', N'Thường hóa', NULL, NULL, NULL, NULL, 550, NULL, 320),
('30XHМЛ', N'Thường hóa', NULL, NULL, NULL, NULL, 700, NULL, 550),
('40XЛ', N'Thường hóa', NULL, NULL, NULL, NULL, 650, NULL, 500),
('35XМЛ', N'Thường hóa', NULL, NULL, NULL, NULL, 700, NULL, 550);

-- 6,2
INSERT INTO TriSoUngVoiChuKyCoSo 
(VatLieu, NhietLuyen, DoRanMatRangMin, DoRanMatRangMax, DoRanLoiRangMin, DoRanLoiRangMax, SigmaHlim, SH, SigmaFlim, Sp) 
VALUES 
(N'40', N'Thường hóa', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),
(N'40', N'Tôi cải thiện', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),

(N'45', N'Thường hóa', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),
(N'45', N'Tôi cải thiện', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),

(N'45X', N'Thường hóa', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),
(N'45X', N'Tôi cải thiện', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),

(N'40X', N'Thường hóa', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),
(N'40X', N'Tôi cải thiện', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),

(N'40XH', N'Thường hóa', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),
(N'40XH', N'Tôi cải thiện', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),

(N'35XM', N'Thường hóa', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),
(N'35XM', N'Tôi cải thiện', 'HB180', 'HB350', NULL, NULL, '2HB + 70', 1.1, '1.8HB', 1.75),
(N'40X', N'Tôi thể tích', 'HRC 45', 'HRC 35', NULL, NULL, '18HRC + 150', 1.1, '550', 1.75),
(N'40XH', N'Tôi thể tích', 'HRC 45', 'HRC 35', NULL, NULL, '18HRC + 150', 1.1, '550', 1.75),
(N'35XM', N'Tôi thể tích', 'HRC 45', 'HRC 35', NULL, NULL, '18HRC + 150', 1.1, '550', 1.75),

(N'40X', N'Tôi bề mặt bằng dòng điện tần số cao (môđun mn >= 3mm)', 'HRC56', 'HRC63', 'HRC 25', 'HRC55', '17HRCm + 200', 1.2, '900', 1.75),
(N'40XH', N'Tôi bề mặt bằng dòng điện tần số cao (môđun mn >= 3mm)', 'HRC56', 'HRC63', 'HRC 25', 'HRC55', '17HRCm + 200', 1.2, '900', 1.75),
(N'35XM', N'Tôi bề mặt bằng dòng điện tần số cao (môđun mn >= 3mm)', 'HRC56', 'HRC63', 'HRC 25', 'HRC55', '17HRCm + 200', 1.2, '900', 1.75),

(N'40X', N'Tôi bề mặt bằng dòng điện tần số cao (môđun mn < 3mm)', 'HRC 45', 'HRC55', 'HRC 45', 'HRC55', '17HRCm + 200', 1.2, '550', 1.75),
(N'40XH', N'Tôi bề mặt bằng dòng điện tần số cao (môđun mn < 3mm)', 'HRC 45', 'HRC55', 'HRC 45', 'HRC55', '17HRCm + 200', 1.2, '550', 1.75),
(N'35XM', N'Tôi bề mặt bằng dòng điện tần số cao (môđun mn < 3mm)', 'HRC 45', 'HRC55', 'HRC 45', 'HRC55', '17HRCm + 200', 1.2, '550', 1.75),

(N'40X', N'Thấm nitơ', 'HRC 55', 'HRC 67', 'HRC 24', 'HRC 40', '1050', 1.2, '12HRCI + 30', 1.75),
(N'40XΦA', N'Thấm nitơ', 'HRC 55', 'HRC 67', 'HRC 24', 'HRC 40', '1050', 1.2, '12HRCI + 30', 1.75),
(N'35XOA', N'Thấm nitơ', 'HRC 55', 'HRC 67', 'HRC 24', 'HRC 40', '1050', 1.2, '12HRCI + 30', 1.75),

(N'Thép thấm cacbon các loại', N'Thấm cacbon và tôi', 'HRC 55', 'HRC 63', 'HRC 30', 'HRC 45', '23HRCm', 1.2, '750', 1.55),

(N'Thép molipden 25XTM', N'Thấm cacbon - nitơ và tôi', 'HRC 57', 'HRC 63', 'HRC 30', 'HRC 45', '23HRCm', 1.2, '1000', 1.55),
(N'Thép molipden 25XHM', N'Thấm cacbon - nitơ và tôi', 'HRC 57', 'HRC 63', 'HRC 30', 'HRC 45', '23HRCm', 1.2, '1000', 1.55),

(N'Thép không chứa molipden 25XKT', N'Thấm cacbon - nitơ và tôi', 'HRC 57', 'HRC 63', 'HRC 30', 'HRC 45', '23HRCm', 1.2, '750', 1.55),
(N'Thép không chứa molipden 30XT', N'Thấm cacbon - nitơ và tôi', 'HRC 57', 'HRC 63', 'HRC 30', 'HRC 45', '23HRCm', 1.2, '750', 1.55),
(N'Thép không chứa molipden 35X', N'Thấm cacbon - nitơ và tôi', 'HRC 57', 'HRC 63', 'HRC 30', 'HRC 45', '23HRCm', 1.2, '750', 1.55);
-- 6,4
INSERT INTO TriSoDoBen (WorkMode, NhietLuyen, mH_2, K_HE, NhietLuyen_1, mF_1, K_FE_1, HeatTreatmentSurface, mF_2, K_FE_2) 
VALUES 
(N'O', N'bất kì', 3, 1.00, N'Tôi cải thiện thường hóa, thấm N', 6, 1.00, N'Tôi thể tích, tôi bề mặt, thấm C', 9, 1.00),
(N'II', N'bất kì', 3, 0.50, N'Tôi cải thiện thường hóa, thấm N', 6, 0.30, N'Tôi thể tích, tôi bề mặt, thấm C', 9, 0.20),
(N'III', N'bất kì', 3, 0.25, N'Tôi cải thiện thường hóa, thấm N', 6, 0.14, N'Tôi thể tích, tôi bề mặt, thấm C', 9, 0.10),
(N'IV', N'bất kì', 3, 0.18, N'Tôi cải thiện thường hóa, thấm N', 6, 0.06, N'Tôi thể tích, tôi bề mặt, thấm C', 9, 0.04),
(N'V', N'bất kì', 3, 0.125, N'Tôi cải thiện thường hóa, thấm N', 6, 0.038, N'Tôi thể tích, tôi bề mặt, thấm C', 9, 0.015),
(N'VI', N'bất kì', 3, 0.063, N'Tôi cải thiện thường hóa, thấm N', 6, 0.013, N'Tôi thể tích, tôi bề mặt, thấm C', 9, 0.004);

-- 6,5
INSERT INTO HeSoPhuThuocBanhRang (HeSo, LoaiRang, SteelSteel, SteelCastIron, SteelBronze, CastIronCastIron, TextoliteSteel, PolyamideSteel)
VALUES 
    ('Ka (MPa)^1/3', 'thẳng', 49.5, 44.5, 43, 41.5, 20, 15.5),
    ('Ka (MPa)^1/3', 'nghiêng và chữ V', 43, 39, 37.5, 36, 17, 13.5),
    ('Kd (MPa)^1/3', 'thẳng', 77, 70, 68, 64.5, 31, 24),
    ('Kd (MPa)^1/3', 'nghiêng và chữ V', 67.5, 61, 60, 56.5, 27, 21),
    ('Zm (MPa)^1/3', NULL, 274, 234, 225, 209, 69.5, 47.5);

-- 6,6
INSERT INTO TriSoViTriBanhRang (ViTri, TriSo, DoRanMatRang_Min1, DoRanMatRang_Max1, DoRanMatRang_Min2, DoRanMatRang_Max2, DieuKien_1, DieuKien_2)
VALUES 
    ('Đối xứng', 'ψ_ba', '0.3', '0.5', '0.25', '0.3', 'H₂ <= HB 350 hoặc H₁ và H₂ <= HB 350', 'H₁ và H₂ > HB 350'),
    ('Đối xứng', 'ψ_bdmax', '1.2', '1.6', '0.9', '1.0', 'H₂ <= HB 350 hoặc H₁ và H₂ <= HB 350', 'H₁ và H₂ > HB 350'),
    ('Không đối xứng', 'ψ_ba', '0.25', '0.4', '0.2', '0.25', 'H₂ <= HB 350 hoặc H₁ và H₂ <= HB 350', 'H₁ và H₂ > HB 350'),
    ('Không đối xứng', 'ψ_bdmax', '1.0', '1.25', '0.65', '0.8', 'H₂ <= HB 350 hoặc H₁ và H₂ <= HB 350', 'H₁ và H₂ > HB 350'),
    ('Chia', 'ψ_ba', '0.2', '0.25', '0.15', '0.2', 'H₂ <= HB 350 hoặc H₁ và H₂ <= HB 350', 'H₁ và H₂ > HB 350'),
    ('Chia', 'ψ_bdmax', '0.6', '0.7', '0.45', '0.55', 'H₂ <= HB 350 hoặc H₁ và H₂ <= HB 350', 'H₁ và H₂ > HB 350');

-- 6.7
INSERT INTO TriSoPhanBoKhongDeu (HeSo_bd, DoCungBanhRang, K_H_Belta_1, K_H_Belta_2, K_H_Belta_3, K_H_Belta_4, K_H_Belta_5, K_H_Belta_6, K_H_Belta_7, 
    K_F_Belta_1, K_F_Belta_2, K_F_Belta_3, K_F_Belta_4, K_F_Belta_5, K_F_Belta_6, K_F_Belta_7
) 
VALUES 
    (0.2, 'Khi H₁ <= HB 350 và H₂ <= HB 350', 1.08, 1.05, 1.02, 1.01, 1.01, 1.00, 1.00, 1.18, 1.10, 1.05, 1.03, 1.02, 1.01, 1.00),
    (0.4, 'Khi H₁ <= HB 350 và H₂ <= HB 350', 1.18, 1.12, 1.05, 1.03, 1.02, 1.01, 1.01, 1.38, 1.21, 1.11, 1.06, 1.05, 1.03, 1.01),
    (0.6, 'Khi H₁ <= HB 350 và H₂ <= HB 350', 1.31, 1.19, 1.07, 1.05, 1.03, 1.02, 1.02, 1.61, 1.39, 1.17, 1.12, 1.08, 1.05, 1.02),
    (0.8, 'Khi H₁ <= HB 350 và H₂ <= HB 350', 1.45, 1.27, 1.12, 1.08, 1.05, 1.03, 1.02, 1.95, 1.58, 1.24, 1.17, 1.12, 1.07, 1.03),
    (1.0, 'Khi H₁ <= HB 350 và H₂ <= HB 350', NULL, NULL, 1.15, 1.11, 1.07, 1.05, 1.03, NULL, NULL, 1.32, 1.23, 1.16, 1.10, 1.05),
    (1.2, 'Khi H₁ <= HB 350 và H₂ <= HB 350', NULL, NULL, 1.20, 1.13, 1.10, 1.06, 1.04, NULL,NULL, 1.41, 1.30, 1.22, 1.14, 1.08),
    (1.4, 'Khi H₁ <= HB 350 và H₂ <= HB 350', NULL, NULL, 1.24, 1.17, 1.13, 1.07, 1.05, NULL, NULL, 1.50, 1.38, 1.28, 1.19, 1.12),
    (1.6, 'Khi H₁ <= HB 350 và H₂ <= HB 350', NULL, NULL, 1.28, 1.21, 1.16, 1.11, 1.06, NULL, NULL, 1.60, 1.45, 1.37, 1.26, 1.15),
    (0.2, 'Khi H₁ > HB 350 và H₂ > HB 350', 1.22, 1.10, 1.05, 1.04, 1.02, 1.01, 1.00, 1.31, 1.20,1.08, 1.04, 1.03, 1.02, 1.00),
    (0.4, 'Khi H₁ > HB 350 và H₂ > HB 350', 1.44, 1.25, 1.12, 1.08, 1.05, 1.02, 1.01, 1.69, 1.42, 1.18, 1.06, 1.10, 1.04, 1.01),
    (0.6, 'Khi H₁ > HB 350 và H₂ > HB 350', NULL, 1.45, 1.20, 1.14, 1.08, 1.04, 1.02, NULL, 1.71, 1.30, 1.17, 1.12, 1.18, 1.03),
    (0.8, 'Khi H₁ > HB 350 và H₂ > HB 350', NULL, NULL, 1.28, 1.20, 1.14, 1.07, 1.03, NULL, NULL, 1.43, 1.27, 1.22, 1.14, 1.06),
    (1.0, 'Khi H₁ > HB 350 và H₂ > HB 350', NULL, NULL, 1.37, 1.27, 1.19, 1.12, 1.06, NULL, NULL, 1.57, 1.39, 1.28, 1.20, 1.10),
    (1.2, 'Khi H₁ > HB 350 và H₂ > HB 350', NULL, NULL, 1.47, 1.35, 1.25, 1.16, 1.08, NULL, NULL, 1.72, 1.53, 1.41, 1.30, 1.15),
    (1.4, 'Khi H₁ > HB 350 và H₂ > HB 350', NULL, NULL, NULL, NULL, 1.31, 1.22, 1.12, NULL, NULL, NULL, 1.70, 1.53, 1.40, 1.22),
    (1.6, 'Khi H₁ > HB 350 và H₂ > HB 350', NULL, NULL, NULL, NULL, NULL, 1.26, 1.16, NULL, NULL, NULL, NULL, NULL, NULL, 1.29);

-- 6.8
INSERT INTO TriSoModun (m_Day_1, m_Day_2) 
VALUES 
    (1.25, 1.375),
    (1.50, 1.75),
    (2.00, 2.25),
    (2.50, 2.25),
    (3.00, 3.50),
    (4.00, 4.50),
    (5.00, 5.50),
    (6.00, 7.00),
    (8.00, 9.00),
    (10.00, 11.00),
    (12.00, 14.00);
-- 6.9
INSERT INTO HeSoChinhDichBanhRang (x1, x2, TruyenDongBanhRangThang, TruyenDongBanhRangNghieng_V) 
VALUES 
    (0, 0, 'z1 >= 21', 'z1 >= z_min + 2'),
    (0.3, -0.3, '14 <= z1 <= 20 và u >= 3,5', 'z1 >= z_min + 2 nhưng không nhỏ hơn 10 và u >= 3,5'),
    (0.5, 0.5, '10 <= z1 <= 30', 'Không nên dùng cho bộ truyền có HB2 <= 320 và độ rắn bánh nhỏ không lớn hơn 70 so với HB2');

-- 6.10a
INSERT INTO TriSoDichChinhKhoangCach (k_y, k_x) 
VALUES 
    (1, 0.009), (2, 0.032), (3, 0.064), (4, 0.122), (5, 0.191),
    (6, 0.265), (7, 0.350), (8, 0.445), (9, 0.568), (10, 0.702),
    (11, 0.844), (12, 1.020), (13, 1.180), (14, 1.354), (15, 1.542),
    (16, 1.752), (17, 1.970), (18, 2.240), (19, 2.445), (20, 2.670),
    (21, 2.930), (22, 3.215), (23, 3.475), (24, 3.765), (25, 4.070),
    (26, 4.430), (27, 4.760), (28, 5.070), (29, 5.420), (30, 5.760),
    (31, 6.120), (32, 6.470), (33, 6.840), (34, 7.190), (35, 7.600),
    (36, 8.010), (37, 8.400), (38, 8.810), (39, 9.420), (40, 9.670);

-- 6.10b
INSERT INTO TriSoDichTrinhChatLuong (k_x, k_y) VALUES
(1, 0.008), (2, 0.032), (3, 0.063), (4, 0.114), (5, 0.178),
(6, 0.243), (7, 0.318), (8, 0.410), (9, 0.510), (10, 0.622),
(11, 0.740), (12, 0.870), (13, 1.000), (14, 1.145), (15, 1.295),
(16, 1.450), (17, 1.622), (18, 1.792), (19, 1.985), (20, 2.160),
(21, 2.340), (22, 2.530), (23, 2.742), (24, 2.940), (25, 3.155),
(26, 3.380), (27, 3.605), (28, 3.835), (29, 4.065), (30, 4.290),
(31, 4.540), (32, 4.785), (33, 5.030), (34, 5.280), (35, 5.520),
(36, 5.790), (37, 6.050), (38, 6.315), (39, 6.585), (40, 6.860),
(41, 7.140), (42, 7.420), (43, 7.700), (44, 8.000), (45, 8.290),
(46, 8.590), (47, 8.885), (48, 9.175), (49, 9.460), (50, 9.765);

-- 6.15
INSERT INTO TriSoSaiSoAnKhop (DoRanMatBanh, DangBanh, SaiSo_H, SaiSo_F) VALUES
('HB₂ <= 350HB', 'Thẳng, không vát đầu răng', 0.006, 0.016),
('HB₂ <= 350HB', 'Thẳng, có vát đầu răng', 0.004, 0.011),
('HB₂ <= 350HB', 'Nghiêng', 0.002, 0.006),
('HB₁ > 350HB, HB₂ > 350HB', 'Thẳng, không vát đầu răng', 0.014, 0.016),
('HB₁ > 350HB, HB₂ > 350HB', 'Thẳng, có vát đầu răng', 0.010, 0.011),
('HB₁ > 350HB, HB₂ > 350HB', 'Nghiêng', 0.004, 0.006);

-- 6.21
INSERT INTO TriSoPhanBoKhongDeuBanhRangCon(HeSo, LoaiTrucLap, DoRanMatRang, LoaiRang, K_H_Belta,K_F_Belta) 
VALUES
-- hb>350
-- 1'2
-- 0.2
(0.2 , N'Trục lắp trên ổ bi', 'HB > 350', '1;2', 1.16,1.25),
(0.2 ,N'Trục lắp trên ổ đũa', 'HB > 350', '1;2', 1.08,1.15),
(0.2 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '1;2', 1.03,1.04),

-- 0.4
(0.4 , N'Trục lắp trên ổ bi', 'HB > 350', '1;2', 1.37,1.55),
(0.4 , N'Trục lắp trên ổ đũa', 'HB > 350', '1;2', 1.20,1.30),
(0.4 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '1;2', 1.07,1.10),

-- 0.6
(0.6 , N'Trục lắp trên ổ bi', 'HB > 350', '1;2', 1.58,1.92),
(0.6 , N'Trục lắp trên ổ đũa', 'HB > 350', '1;2', 1.32,1.48),
(0.6 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '1;2', 1.12,1.18),

-- 0.8
(0.8 , N'Trục lắp trên ổ bi', 'HB > 350', '1;2', 1.80,NULL),
(0.8 , N'Trục lắp trên ổ đũa', 'HB > 350', '1;2', 1.44,1.67),
(0.8 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '1;2', 1.18,1.26),

-- 1
 (1.0 , N'Trục lắp trên ổ bi', 'HB > 350', '1;2', NULL,NULL),
(1.0 , N'Trục lắp trên ổ đũa', 'HB > 350', '1;2', NULL,1.90),
(1.0 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '1;2', 1.24,1.35),

-- 3
-- 0.2
(0.2 , N'Trục lắp trên ổ bi', 'HB > 350', '3', 1.08,1.13),
(0.2 , N'Trục lắp trên ổ đũa', 'HB > 350', '3', 1.04,1.07),
(0.2 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '3', 1.02,1.02),

-- 0.4
(0.4 , N'Trục lắp trên ổ bi', 'HB > 350', '3', 1.18,1.27),
(0.4 , N'Trục lắp trên ổ đũa', 'HB > 350', '3', 1.10,1.15),
(0.4 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '3', 1.03,1.05),

-- 0.6
(0.6 , N'Trục lắp trên ổ bi', 'HB > 350', '3', 1.29,1.45),
(0.6 , N'Trục lắp trên ổ đũa', 'HB > 350', '3', 1.15,1.24),
(0.6 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '3', 1.05,1.08),

-- 0.8
(0.8 , N'Trục lắp trên ổ bi', 'HB > 350', '3', 1.40,NULL),
(0.8 , N'Trục lắp trên ổ đũa', 'HB > 350', '3', 1.22,1.34),
(0.8 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '3', 1.08,1.12),
-- 1
(1.0 , N'Trục lắp trên ổ bi', 'HB > 350', '3', NULL,NULL),
(1.0 , N'Trục lắp trên ổ đũa', 'HB > 350', '3', 1.28,1.43),
(1.0 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB > 350', '3', 1.12,1.17),

-- hn<=350
-- 0.2
(0.2 , N'Trục lắp trên ổ bi', 'HB <= 350', '1;2', 1.07,1.13),
(0.2 , N'Trục lắp trên ổ đũa', 'HB <= 350', '1;2', 1.04,1.08),
(0.2 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '1;2', 1.01,1.02),

-- 0.4
(0.4 , N'Trục lắp trên ổ bi', 'HB <= 350', '1;2', 1.14,1.29),
(0.4 , N'Trục lắp trên ổ đũa', 'HB <= 350', '1;2', 1.08,1.15),
(0.4 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '1;2', 1.02,1.06),

-- 0.6
(0.6 , N'Trục lắp trên ổ bi', 'HB <= 350', '1;2', 1.23,1.47),
(0.6 , N'Trục lắp trên ổ đũa', 'HB <= 350', '1;2', 1.13,1.25),
(0.6 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '1;2', 1.05,1.09),

-- 0.8
(0.8 , N'Trục lắp trên ổ bi', 'HB <= 350', '1;2', 1.34,1.70),
(0.8 , N'Trục lắp trên ổ đũa', 'HB <= 350', '1;2', 1.18,1.35),
(0.8 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '1;2', 1.08,1.14),
-- 1
(1.0 , N'Trục lắp trên ổ bi','HB <= 350', '1;2', NULL,NULL),
(1.0 , N'Trục lắp trên ổ đũa', 'HB <= 350', '1;2', NULL,1.45),
(1.0 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '1;2', 1.10,1.18),

-- 3
-- 0.2
(0.2 , N'Trục lắp trên ổ bi','HB <= 350', '3', 1.0,1.06),
(0.2 , N'Trục lắp trên ổ đũa', 'HB <= 350', '3', 1.0,1.04),
(0.2 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '3', 1.0,1.01),

-- 0.4
(0.4 , N'Trục lắp trên ổ bi', 'HB <= 350', '3', 1.0,1.15),
(0.4 , N'Trục lắp trên ổ đũa', 'HB <= 350', '3', 1.0,1.08),
(0.4 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '3', 1.0,1.02),

-- 0.6
(0.6 , N'Trục lắp trên ổ bi','HB <= 350', '3', 1.0,1.23),
(0.6 , N'Trục lắp trên ổ đũa','HB <= 350', '3', 1.0,1.12),
(0.6 , N'Trục lắp trên ổ bi hoặc ổ đũa','HB <= 350', '3', 1.0,1.04),

-- 0.8
(0.8 , N'Trục lắp trên ổ bi', 'HB <= 350', '3', 1.0,1.33),
(0.8 , N'Trục lắp trên ổ đũa', 'HB <= 350', '3', 1.0,1.17),
(0.8 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '3', 1.0,1.07),
-- 1
 (1.0 , N'Trục lắp trên ổ bi', 'HB <= 350', '3', 1.0,NULL),
(1.0 , N'Trục lắp trên ổ đũa', 'HB <= 350', '3', 1.0,1.22),
(1.0 , N'Trục lắp trên ổ bi hoặc ổ đũa', 'HB <= 350', '3', 1.0,1.09);

-- 6.20
INSERT INTO HeSoDichChinh (SoRang,TriSoTruyen_1_12,TriSoTruyen_1_25,TriSoTruyen_1_4,TriSoTruyen_1_6,TriSoTruyen_1_8,TriSoTruyen_2_0,TriSoTruyen_2_5,TriSoTruyen_3_15,TriSoTruyen_4_0,TriSoTruyen_5_0,TriSoTruyen_6_3_and_above)
VALUES 
(12, NULL, NULL, NULL, NULL, NULL, NULL, 0.5, 0.53, 0.56, 0.57, 0.58),
(13, NULL, NULL, NULL, NULL, NULL, 0.44, 0.48, 0.52, 0.54, 0.55, 0.56),
(14, NULL, NULL, 0.27, 0.34, 0.38, 0.42, 0.47, 0.5, 0.52, 0.53, 0.54),
(15, NULL, 0.18, 0.25, 0.31, 0.36, 0.4, 0.45, 0.48, 0.5, 0.51, 0.52),
(16, 0.1, 0.17, 0.24, 0.3, 0.35, 0.38, 0.43, 0.46, 0.48, 0.49, 0.5),
(18, 0.09, 0.15, 0.22, 0.28, 0.33, 0.36, 0.4, 0.43, 0.45, 0.46, 0.47),
(20, 0.08, 0.14, 0.2, 0.26, 0.3, 0.34, 0.37, 0.4, 0.42, 0.43, 0.44),
(25, 0.07, 0.13, 0.18, 0.23, 0.26, 0.29, 0.33, 0.36, 0.38, 0.39, 0.4),
(30, 0.06, 0.11, 0.15, 0.19, 0.22, 0.26, 0.28, 0.31, 0.33, 0.34, 0.35),
(40, 0.05, 0.09, 0.12, 0.15, 0.18, 0.2, 0.22, 0.24, 0.26, 0.27, 0.28);

-- 6.22
INSERT INTO SoBanhRangNho (d_el, LoaiBanhRangCon, SoRangNhoTaiTySoTruyen_1, SoRangNhoTaiTySoTruyen_2, SoRangNhoTaiTySoTruyen_3_15, SoRangNhoTaiTySoTruyen_4, SoRangNhoTaiTySoTruyen_6) 
VALUES 
(40, 'Bánh côn răng thẳng', 24, 20, 18, 16, 15),
(40, 'Bánh côn răng nghiêng hoặc cung tròn', 21, 16, 12, 11, 9),
(60, 'Bánh côn răng thẳng', 24, 20, 18, 16, 15),
(60, 'Bánh côn răng nghiêng hoặc cung tròn', 21, 16, 13, 12, 10),
(80, 'Bánh côn răng thẳng', 25, 21, 19, 17, 16),
(80, 'Bánh côn răng nghiêng hoặc cung tròn', 22, 17, 14, 13, 10),
(100, 'Bánh côn răng thẳng', 25, 21, 19, 17, 16),
(100, 'Bánh côn răng nghiêng hoặc cung tròn', 23, 17, 16, 13, 11),
(125, 'Bánh côn răng thẳng', 26, 22, 20, 18, 17),
(125, 'Bánh côn răng nghiêng hoặc cung tròn', 24, 18, 16, 14, 12),
(160, 'Bánh côn răng thẳng', 27, 24, 22, 21, 18),
(160, 'Bánh côn răng nghiêng hoặc cung tròn', 26, 20, 18, 17, 14),
(200, 'Bánh côn răng thẳng', 30, 28, 27, 24, 22),
(200, 'Bánh côn răng nghiêng hoặc cung tròn', 29, 24, 22, 20, 18);


-- Dong co dien K
INSERT INTO DongCoDienK (kieu_dong_co, cong_suat_kw, cong_suat_ma_luc, van_toc_50Hz, van_toc_60Hz, hieu_suat, cos_phi, I_K_I_dn, T_K_T_dn, khoi_luong)
VALUES
('K90S2', 0.75, 1.0, 2845, 3430, 77.5, 0.87, 5, 1.9, 17),
('K90 L2', 1.1, 1.5, 2850, 3432, 78.5, 0.87, 6.7, 2.4, 20),
('K100L2', 1.5, 2.0, 2860, 3435, 79.5, 0.87, 6.9, 2.5, 24),
('K112S2', 2.2, 3.0, 2880, 3460, 82.0, 0.88, 7.3, 2.7, 36),
('K112M2', 3.0, 4.0, 2890, 3462, 83.5, 0.90, 7.0, 2.5, 42),
('K132S2', 4.0, 5.5, 2890, 3462, 84.5, 0.90, 6.8, 2.5, 60),
('K132M2', 5.5, 7.5, 2900, 3480, 85.0, 0.93, 7.0, 2.2, 73),
('K160S2', 7.5, 10.0, 2935, 3519, 86.0, 0.93, 7.3, 2.2, 94),
('K160M2', 11.0, 13.0, 2935, 3519, 87.0, 0.90, 6.3, 2.1, 110),
('K160L2', 15.0, 19.5, 2950, 3538, 87.0, 0.90, 7.0, 2.1, 158),
('K180L2', 18.5, 25.0, 2950, 3538, 87.0, 0.90, 6.7, 2.2, 202),
('K200M2', 22.0, 30.0, 2950, 3538, 87.0, 0.90, 7.0, 2.1, 233),
('K200L2', 30.0, 40.0, 2950, 3538, 88.0, 0.91, 7.0, 2.1, 312),
('K90S4', 0.75, 1.0, 1420, 1704, 73.5, 0.76, 4.6, 2.1, 17),
('K90L4', 1.1, 1.5, 1420, 1704, 77.0, 0.78, 5.6, 2.3, 20),
('K100L4', 1.5, 2.0, 1425, 1710, 79.0, 0.80, 5.9, 2.3, 24),
('K112S4', 2.2, 3.0, 1440, 1730, 81.5, 0.82, 5.4, 2.2, 35),
('K112M4', 3.0, 4.0, 1445, 1732, 82.0, 0.83, 5.9, 2.0, 41),
('K132S4', 4.0, 5.5, 1445, 1732, 85.0, 0.83, 6.0, 2.0, 58),
('K132M4', 5.5, 7.5, 1445, 1732, 86.0, 0.86, 5.9, 2.0, 72),
('K160S4', 7.5, 10.0, 1450, 1740, 87.5, 0.86, 5.8, 2.2, 94),
('K160M4', 11.0, 13.5, 1450, 1740, 87.5, 0.87, 6.1, 1.6, 110),
('K180M4', 15.0, 19.5, 1450, 1740, 87.5, 0.87, 5.5, 1.6, 159),
('K180L4', 18.5, 25.0, 1455, 1745, 88.0, 0.88, 5.9, 2.0, 211),
('K200M4', 22.0, 30.0, 1475, 1774, 89.0, 0.89, 5.5, 2.0, 251),
('K200L4', 30.0, 40.0, 1475, 1774, 89.0, 0.89, 5.5, 2.0, 320);
