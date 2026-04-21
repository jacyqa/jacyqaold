<template>
  <h1 class="title"></h1>
  <h1 class="tlt">登分器</h1>
  <el-dialog v-model="showResult">
    <div class="result">
      <el-result title="Please wait" sub-title="We're preparing your result.But you can close this dialog.">
      </el-result>
    </div>
  </el-dialog>
  <main>
    <div class="head">
      <div class="method">
        <div class="nextButton">
          <el-button @click="handleInput">Next</el-button>
          <el-button @click="handleInputToExpert">导出</el-button>
          <el-button @click="test">test</el-button>
          <el-input-number v-model="passGrade" placeholder="及格分数" size="small" />
          <el-checkbox v-model="isFullPerson" label="是否去除未考式人员" />
        </div>
        <div class="info">
          <el-input-number :min="1" :max="63" class="item" v-model="inputNumber" size="large" placeholder="学号" />
          <h2 class="item">当前学生：{{ findStudentByNumber(inputNumber) }}</h2>
          <el-input-number :min="0" class="item" v-model="grade" size="large" placeholder="分数"
            @keyup.enter="handleInput" />
          <h3 class="item">
            男生平均分数：{{ computedSexGrade().maleAverage }}
          </h3>
          <h3 class="item">
            女生平均分数：{{ computedSexGrade().femaleAverage }}
          </h3>
        </div>
      </div>
      <div class="avgChart">
        <el-table :data="group" border>
          <el-table-column prop="id" label="组别"></el-table-column>
          <el-table-column prop="averageGrade" label="平均分"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="chart">
      <el-table :data="data" height="500" border style="width: 100%">
        <el-table-column prop="num" label="学号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="grade" label="成绩"></el-table-column>
      </el-table>
    </div>
  </main>
</template>

<style scoped src="./index.css"></style>

<script setup>
import { groups, members as classData } from "@/components/data";
import exceljs from "exceljs";
import { saveAs } from "file-saver";



const group = reactive(groups);
const showResult = ref(false);
const data = reactive(classData); //原数组
const inputNumber = ref(0); //学号（输入值）
const grade = ref(0); //分数（输入值）
const isFullPerson = ref(false); //是否开启‘去除未考式人员’
const passGrade = ref(0); //通过的分数

function test() {
  exportToExcel();
  console.log(`output-group`, group);
}
/**
 * 获取学号对应的姓名，并显示
 */

function findStudentByNumber(index= 0) {
  return (
    data.find((member) => member.num === index) || {
      name: "（键入正确学号以检索学生）",
    }
  ).name;
}
/**
 * 将输入的分数添加到原分数数组中
 */
function handleInput() {
  if (grade.value && grade.value >= 0) {
    //@ts-ignore
    data.find((member) => member.num === inputNumber.value).grade =
      grade.value;
    grade.value = undefined;
    computedTeamGrade();
  } else {
    alert("成绩或学号输入有误");
  }
}

/**
 * 将输入的分数添加到原分数数组中
 * TODO:
 */
function handleInputToExpert() {
  grade.value = undefined;
  inputNumber.value = undefined;
  showResult.value = true;
  setTimeout(() => {
    exportToExcel();
    showResult.value = false;
  }, 3000);
}
/**
 * 计算每组成绩的平均分，若最后不足七个则按剩余数量计算平均数。
 *TODO:
 * @returns {Array} 返回一个包含每组成绩平均分的数组。
 */
function computedTeamGrade(){
  // 遍历每个组，并计算均分，然后添加到组对象上
  group.forEach((group) => {
    let totalGrade = 0;
    let count = 0; // 用于记录有效成绩（非零）的成员数量

    group.members.forEach((member) => {
      if (isFullPerson.value && member.grade === 0) {
        // 如果isCheck为true且成员成绩为零，则不计算该成员的成绩
        return;
      }
      totalGrade += member.grade;
      count++; // 有效成绩数量加一
    });

    // 在组对象上添加一个新的属性来存储均分，只有当有有效成绩时才计算均分
    group.averageGrade = count > 0 ? totalGrade / count : 0;
  });
}
// 使用watch来监听isCheck的变化
watch(
  isFullPerson,
  (newValue, oldValue) => {
    // 当isCheck的值变化时，调用computedTeamGrade函数
    computedTeamGrade();
  },
  { immediate: true },
);
//TODO:
function computedSexGrade() {
  let maleGrades = 0; // 男生分数总和
  let femaleGrades = 0; // 女生分数总和
  let maleCount = 0; // 男生数量
  let femaleCount = 0; // 女生数量
  data.forEach((member) => {
    if (isFullPerson.value && member.grade === 0) {
      return;
    } else if (member.sex === "男") {
      maleGrades += member.grade; // 累加男生分数
      maleCount++; // 男生数量加1
    } else if (member.sex === "女") {
      femaleGrades += member.grade; // 累加女生分数
      femaleCount++; // 女生数量加1
    }
    // 计算平均分（注意避免除以0的情况）
    // 输出结果
  });
  let maleAverage = maleCount > 0 ? maleGrades / maleCount : 0;
  let femaleAverage = femaleCount > 0 ? femaleGrades / femaleCount : 0;
  return {
    maleAverage,
    femaleAverage,
  };
}

function exportToExcel() {
  // 导出为excel文件
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("成绩单");
  worksheet.columns = [
    {
      header: "名次",
      key: "sort",
      width: 10,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "组",
      key: "name",
      width: 10,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "组员",
      key: "members",
      width: 10,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "分数",
      key: "grade",
      width: 10,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "均分",
      key: "averageGrade",
      width: 10,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "男生平均分数",
      key: "maleAverage",
      width: 20,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "女生平均分数",
      key: "femaleAverage",
      width: 20,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "学生",
      key: "allStudents",
      width: 20,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
    {
      header: "成绩",
      key: "grade",
      width: 10,
      style: { alignment: { vertical: "middle", horizontal: "center" } },
    },
  ];
  //男女平均分计算
  const { maleAverage, femaleAverage } = computedSexGrade();
  worksheet.addRow({
    maleAverage,
    femaleAverage,
  });

  let newAllStudents = data.toSorted((a, b) => b.grade - a.grade);

  // 先对group数组按照averageGrade从高到低进行排序
  //@ts-ignore
  let newGroup = group.toSorted((a, b) => b.averageGrade - a.averageGrade);

  let writeRow = 2; // 当前写入的行号
  newAllStudents.forEach((member, index) => {
    let memberNameCell = worksheet.getCell("H" + writeRow);
    memberNameCell.value = member.name; // 设置组员名字
    let memberGradeCell = worksheet.getCell("I" + writeRow);
    memberGradeCell.value = member.grade; // 设置组员成绩
    if (passGrade.value && member.grade < passGrade.value) {
      memberGradeCell.style = {
        font: { color: { argb: "FF0000" } }, // ARGB颜色代码，FF0000代表红色
        alignment: { vertical: "middle", horizontal: "center" },
      };
    }
    if (isFullPerson.value && member.grade === 0) {
      memberGradeCell.value = "未算入";
      memberGradeCell.style = {
        alignment: { vertical: "middle", horizontal: "center" },
      };
    }
    writeRow++;
  });
  let currentRow = 2; // 当前写入的行号
  newGroup.forEach((groupData, groupIndex) => {
    let startRow = currentRow; // 记录当前组的起始行号
    // 为每个组员添加一行
    groupData.members.forEach((member, memberIndex) => {
      let memberCell = worksheet.getCell("C" + currentRow);
      memberCell.value = member.name; // 设置组员名字
      let memberGradeCell = worksheet.getCell("D" + currentRow);
      memberGradeCell.value = member.grade; // 设置组员成绩
      // 检查分数是否低于60，如果是，则设置字体颜色为红色
      if (passGrade.value && member.grade < passGrade.value) {
        memberGradeCell.style = {
          font: { color: { argb: "FF0000" } }, // ARGB颜色代码，FF0000代表红色
          alignment: { vertical: "middle", horizontal: "center" },
        };
      }
      if (isFullPerson.value && member.grade === 0) {
        memberGradeCell.value = "未算入";
        memberGradeCell.style = {
          alignment: { vertical: "middle", horizontal: "center" },
        };
      }
      // 准备下一行的数据（如果有的话）
      currentRow++;
    });

    // 只在添加完所有组员后，合并名次、组和均分的单元格
    if (groupData.members.length > 1) {
      let endRow = currentRow - 1; // 当前组的结束行号（最后一个组员所在行）
      worksheet.mergeCells(`A${startRow}:A${endRow}`); // 合并名次
      worksheet.mergeCells(`B${startRow}:B${endRow}`); // 合并组名
      worksheet.mergeCells(`E${startRow}:E${endRow}`); // 合并均分
    }

    // 在当前组的第一行设置名次、组和均分
    worksheet.getCell("A" + startRow).value = groupIndex + 1; // 名次从1开始
    worksheet.getCell("B" + startRow).value = groupData.name;
    worksheet.getCell("E" + startRow).value = groupData.averageGrade;
  });
  workbook.xlsx.writeBuffer().then((buffer) => {
    let _file = new Blob([buffer], {
      type: "application/octet-stream",
    });
    saveAs(_file, "ExcelJS.xlsx");
  });
}

// 返回需要暴露给模板的数据和方法
</script>
