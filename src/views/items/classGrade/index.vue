<template>
  <div>
    <el-upload
      action="#"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :auto-upload="false"
    >
      <el-button type="primary">选择 Excel 文件</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import * as ExcelJS from "exceljs";
const handleBeforeUpload = async (file, fileList) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = e.target.result;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);
    const worksheet = workbook.getWorksheet(1); // 获取第一个工作表
    const rows = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        // 跳过标题行
        const rowData = [];
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          rowData.push(cell.value);
        });
        rows.push(rowData);
      }
    });
    // 在这里处理 rows 数据，例如通过一些逻辑返回一些值
    console.log(rows); // 打印处理后的数据，你可以根据需要进一步处理这些数据
  };
  reader.readAsArrayBuffer(file);
  return false; // 阻止自动上传，因为我们已经处理了文件内容
};

const handleSuccess = (response, file, fileList) => {
  // 文件上传成功的回调，但在这里我们实际上没有上传到服务器，所以可以根据需要调整这部分逻辑
};
</script>

<style></style>
