<template>
  <div class="choose-container">
    <el-select
      v-model="selectedCount"
      placeholder="选择抽取人数"
      style="width: 200px"
    >
      <el-option
        v-for="count in maxSelectableCount"
        :key="count"
        :label="count"
        :value="count"
      />
    </el-select>

    <el-button
      type="primary"
      size="large"
      @click="startChoose"
      :disabled="isChoosing || !selectedCount"
    >
      开始抽取
    </el-button>

    <div class="names-display">
      <div v-for="(name, index) in displayNames" :key="index" class="name-item">
        {{ name }}
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="抽取结果" width="30%" center>
      <template #default>
        <div class="result-content">
          <p>被抽中的同学是：</p>
          <ul>
            <li v-for="student in selectedStudents" :key="student.num">
              {{ student.name }}
            </li>
          </ul>
        </div>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { membersfake as members } from "@/components/data";

const displayNames = ref([]);
const isChoosing = ref(false);
const dialogVisible = ref(false);
const selectedStudents = ref([]);
const selectedCount = ref(null);
const maxSelectableCount = 5; // 最大可选择人数

const startChoose = () => {
  if (!selectedCount.value) return;

  isChoosing.value = true;
  let duration = 2; // 动画持续时间
  let interval;
  const count = selectedCount.value; // 缓存值以避免重复访问

  // 初始化显示名字数组
  displayNames.value = Array(count).fill("");

  // 快速切换名字的动画效果
  interval = setInterval(() => {
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * members.length);
      displayNames.value[i] = members[randomIndex].name;
    }
  }, 50);

  // 结束选择
  setTimeout(() => {
    clearInterval(interval);
    const selectedIndices = new Set();
    while (selectedIndices.size < count) {
      selectedIndices.add(Math.floor(Math.random() * members.length));
    }
    selectedStudents.value = Array.from(selectedIndices).map(
      (index) => members[index],
    );
    displayNames.value = selectedStudents.value.map((student) => student.name);

    isChoosing.value = false;
    dialogVisible.value = true;
  }, duration * 1000);
};
</script>

<style scoped>
.choose-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.names-display {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.name-item {
  font-size: 1.5rem;
  font-weight: bold;
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  text-align: center;
}

.result-content ul {
  list-style: none;
  padding: 0;
}

.result-content li {
  margin: 0.5rem 0;
}
</style>
