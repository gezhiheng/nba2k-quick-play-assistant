<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import TeamLogo from '@/components/TeamLogo.vue'
import { teams, allocation, allocationFns } from './constants'

const draftResult = reactive([])

const cardVisible = reactive({
  preSet: true,
  nameSet: false,
  draft: false,
  result: false,
})
const preSetForm = reactive({
  playersNum: 2,
  draftRounds: 0,
  allocation: 'snake'
})
let playersName = reactive({
  player1: '',
  player2: '',
  player3: '',
  player4: '',
  player5: '',
})

function preSetBtn() {
  preSetForm.draftRounds = Math.floor(30 / preSetForm.playersNum)
  toggleCardVisible('nameSet')
}

const requiredRule = [
  { required: true, message: '玩家名称不能为空', trigger: 'change' },
]
const nameSetRuleFormRef = ref()
const nameSetRules = reactive({
  player1: requiredRule,
  player2: requiredRule,
  player3: requiredRule,
  player4: requiredRule,
  player5: requiredRule,
})

async function nameSetBtn(formEl) {
  if (!formEl) {
    return
  }
  await formEl.validate((valid) => {
    if (valid) {
      for (let key in playersName) {
        if (playersName[key]) {
          draftResult.push({
            name: playersName[key],
            teams: []
          })
        }
      }
      toggleCardVisible('draft')
    }
  })
}

const selectedTeam = ref({})
function logoOnClick(team) {
  selectedTeam.value = team
}

let currentDraft = reactive({
  index: 0,
  round: 1,
  times: 0,
})
function draftBtn() {
  // 判断是否选择了球队
  if (Object.keys(selectedTeam.value).length > 0) {
    // 更新轮次
    currentDraft.times++
    currentDraft.round = currentDraft.times > preSetForm.playersNum ? Math.ceil(currentDraft.times / preSetForm.playersNum) : 1;
  
    draftResult[currentDraft.index].teams.push(selectedTeam.value.en)
    delete teams[selectedTeam.value.en]

    const nextDraftIndex = 
      allocationFns[preSetForm.allocation](currentDraft.index, currentDraft.round, preSetForm.playersNum);
    currentDraft.index = nextDraftIndex

    let resultVisible = true
    draftResult.forEach(item => {
      if (item.teams.length !== preSetForm.draftRounds) {
        resultVisible = false
        return
      }
    })
    if (resultVisible) {
      console.log(draftResult)
      toggleCardVisible('result')
    }
    selectedTeam.value = {}
  } else {
    ElMessage({
      message: '请选择一个球队',
      type: 'warning',
    })
  }
      
}

function toggleCardVisible(key) {
  for (let prop in cardVisible) {
    cardVisible[prop] = false
  }
  setTimeout(() => {
    cardVisible[key] = true
  }, 300)
}
</script>

<template>
  <div class="container">
    
    <Transition>
      <el-card v-show="cardVisible.preSet" style="width: 280px" shadow="hover">
        <template #header>
          <text>前置设置</text>
        </template>
        <el-form :model="preSetForm" label-width="auto">
          <el-form-item label="玩家数量">
            <el-input-number v-model="preSetForm.playersNum" :min="2" :max="5" style="width: 172px;"/>
          </el-form-item>
          <el-form-item label="球队分配">
            <el-select v-model="preSetForm.allocation" placeholder="选择球队分配方式">
              <el-option v-for="item in allocation"  :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" plain @click="preSetBtn">确定</el-button>
      </el-card>
    </Transition>

    <Transition>
      <el-card v-show="cardVisible.nameSet" style="width: 280px" shadow="hover">
        <template #header>
          <text>名称设置</text>
        </template>
        <el-form ref="nameSetRuleFormRef" label-width="auto" :model="playersName" :rules="nameSetRules">
          <el-form-item v-for="i in preSetForm.playersNum" :label="`玩家 ${i} 名称`" :prop="`player${i}`">
            <el-input v-model="playersName[`player${i}`]" style="width: 172px;"/>
          </el-form-item>
          <el-button style="width: 240px;" type="primary" plain @click="nameSetBtn(nameSetRuleFormRef)">确定</el-button>
        </el-form>
      </el-card>
    </Transition>

    <Transition>
      <el-card v-show="cardVisible.draft" style="width: 1000px" shadow="hover">
        <template #header>
          <text>球队选秀</text>
        </template>
        <div class="selection">
          <text>
            {{ draftResult[currentDraft.index]?.name }} 选择了 
            <text class="underline">
              {{ selectedTeam?.short?.toUpperCase() }}
              {{ selectedTeam?.cn }}
            </text>
          </text>
          <div>
            <!-- TODO 添加drawer来展示选秀时的信息 -->
            <el-button type="primary" circle>
              <el-icon><MoreFilled /></el-icon>
            </el-button>
            <el-button type="primary" plain @click="draftBtn">确定</el-button>
          </div>
        </div>
          <TransitionGroup class="team-grid" name="list" tag="ul">
            <li v-for="teamName in Object.keys(teams)" :key="teamName">
              <TeamLogo 
                :name="teamName"
                :is-selected="selectedTeam.en === teamName"
                width="150"
                @logoClick="logoOnClick"
              />
            </li>
          </TransitionGroup>
      </el-card>
    </Transition>

    <Transition>
      <el-card v-show="cardVisible.result" style="width: 80%;" shadow="never">
        <template #header>
          <text>选秀结果</text>
        </template>
        <el-card v-for="item in draftResult" style="margin-bottom: 16px;" shadow="hover">
          <template #header>
            <text>{{ item.name }}</text>
          </template>
          <TransitionGroup class="team-grid" name="list" tag="ul">
            <li v-for="teamName in item.teams" :key="teamName">
              <TeamLogo
                :name="teamName"
                width="80"
                :is-selected="true"
              />
            </li>
          </TransitionGroup>
        </el-card>
      </el-card>
    </Transition>

    <!-- TODO 实现玩家对决的组件or页面 -->
  </div>
</template>

<style>
.container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.el-card__body {
  display: flex;
  flex-direction: column;
}

text {
  font-size: 2.2rem;
  font-weight: bolder;
}

.underline {
  border-bottom: 2px solid black;
}

h2 {
  font-size: 3rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* 自适应列数 */
  gap: 18px;
  padding: 20px;
}

.selection {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
