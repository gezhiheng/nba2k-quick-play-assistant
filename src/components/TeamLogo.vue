<template>
  <div class="team-logo-container" :class="{ selected: isSelected }">
    <img
      :src="logoUrl"
      :alt="altText"
      :width="width"
      :height="height"
      class="team-logo"
      @click="() => {
        emit('logoClick', teams[props.name])
      }"
    />
  </div>
</template>

<script setup>
import { teams } from '@/constants'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  width: {
    type: [String, Number],
    default: '100'
  },
  height: {
    type: [String, Number],
    default: '100'
  },
  altText: {
    type: String,
    default: 'Team Logo'
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['logoClick'])

const logoUrl = `/assets/team_logos/${props.name}.svg`
</script>

<style scoped>
.team-logo-container {
  padding: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 
    transform 0.2s ease-in-out,
    background-color 0.2s ease-in-out,
    border-radius 0.2s ease-in-out;
}

.team-logo-container.selected {
  transform: scale(1.1);
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

.team-logo {
  display: block;
  max-width: 100%;
  height: auto;
  transition: transform 0.1s ease-in-out;
}

.team-logo:hover {
  transform: scale(1.1);
}

.team-logo:active {
  transform: scale(0.95);
}
</style>
