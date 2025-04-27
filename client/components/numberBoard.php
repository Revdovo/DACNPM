<div class="modal fade" id="numberBoardModal" tabindex="-1" aria-labelledby="numberBoardModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="numberBoardModalLabel">Bảng Thông Số</h5>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label for="boardSelector" class="form-label">Chọn bảng:</label>
          <select class="form-select" id="boardSelector" onchange="changeBoard()">
            <option value="coneGear">Thông số bánh răng côn</option>
            <option value="cylinderGear">Thông số bánh răng trụ</option>
            <option value="chainDrive">Thông số bộ truyền xích</option>
          </select>
        </div>

        <!-- Bảng bánh răng côn -->
        <div id="coneGear" class="board-table">
          <h5>Thông số bánh răng côn</h5>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Thông số</th>
                <th>Bánh dẫn</th>
                <th>Bánh bị dẫn</th>
              </tr>
            </thead>
            <tbody>
              <!-- Dữ liệu sẽ được thêm ở đây -->
            </tbody>
          </table>
        </div>

        <!-- Bảng bánh răng trụ -->
        <div id="cylinderGear" class="board-table" style="display: none;">
          <h5>Thông số bánh răng trụ</h5>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Thông số</th>
                <th>Bánh dẫn</th>
                <th>Bánh bị dẫn</th>
              </tr>
            </thead>
            <tbody>
              <!-- Dữ liệu sẽ được thêm ở đây -->
            </tbody>
          </table>
        </div>

        <!-- Bảng bộ truyền xích -->
        <div id="chainDrive" class="board-table" style="display: none;">
          <h5>Thông số bộ truyền xích</h5>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Đại lượng</th>
                <th>Giá trị</th>
              </tr>
            </thead>
            <tbody>
              <!-- Dữ liệu sẽ được thêm ở đây -->
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</div>

<script>

function changeBoard() {
        var selectedBoard = document.getElementById('boardSelector').value;
        var boards = document.getElementsByClassName('board-table');
        for (var i = 0; i < boards.length; i++) {
          boards[i].style.display = 'none';
        }
        document.getElementById(selectedBoard).style.display = 'block';
    }

</script>