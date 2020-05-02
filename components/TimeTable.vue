<template>
  <div
    class="time-table bg-blue-400 grid h-screen max-w-full overflow-auto"
    :style="tableStyles"
  >
    <!-- Timeslot Labels -->
    <div class="time-slot bg-gray-700 sticky left-0 pl-2 top-0 z-10">
      {{ formatDate(currentTime) }}
    </div>
    <div
      v-for="date in timeslots"
      :key="date.toISOString()"
      class="time-slot sticky justify-center top-0"
    >
      {{ formatDate(date) }}
    </div>

    <!-- Channel Labels -->
    <div v-for="channel in channels" :key="channel" class="channel">
      {{ channel }}
    </div>

    <!-- Events -->
    <a
      v-for="item in events"
      :key="item.link"
      :href="item.link"
      target="_blank"
      rel="noopener noreferrer"
      :style="getEventStyles(item)"
      class="bg-blue-600 text-white p-2 text-xs"
    >
      <div class="font-bold text-sm">{{ item.title }}</div>
      <div>
        {{ formatDate(item.startTime) }} - {{ formatDate(item.endTime) }}
      </div>
      <div v-if="item.description" class="mt-1">{{ item.description }}</div>
    </a>
  </div>
</template>

<script>
import addMinutes from 'date-fns/addMinutes';
import kebabCase from 'lodash/kebabCase';
import { format } from 'date-fns-tz';
import getNearestStartTime from '~/util/getNearestStartTime';
import getNearestEndTime from '~/util/getNearestEndTime';

export default {
  props: {
    channels: {
      type: Array,
      default: () => [],
    },
    currentTime: {
      type: Date,
      required: true,
    },
    events: {
      type: Array,
      default: () => [],
    },
    hoursToDisplay: {
      type: Number,
      default: 6,
    },
    startTime: {
      type: Date,
      required: true,
    },
  },
  computed: {
    timeslots() {
      const results = [];
      let lastTime = this.startTime;
      while (results.length < this.hoursToDisplay * 2) {
        results.push(lastTime);
        lastTime = addMinutes(lastTime, 30);
      }
      return results;
    },
    tableStyles() {
      return {
        'grid-gap': '1px',
        'grid-template-columns': [
          '[channels] auto',
          ...this.timeslots.map(
            (time) =>
              `[time-${format(time, 'HHmm', {
                timeZone: 'America/New_York',
              })}] 1fr`
          ),
        ].join(' '),
        'grid-template-rows': [
          '[times] auto',
          ...this.channels.map(
            (channel) => `[channel-${kebabCase(channel)}] auto`
          ),
        ].join(' '),
      };
    },
  },
  methods: {
    formatDate(date) {
      return format(date, 'h:mm a', { timeZone: 'America/New_York' });
    },
    getEventStyles(event) {
      const { category, endTime, startTime } = event;
      const displayedStartTime =
        startTime < this.startTime ? this.startTime : startTime;
      const startStr = format(getNearestStartTime(displayedStartTime), 'HHmm', {
        timeZone: 'America/New_York',
      });
      const endStr = format(getNearestEndTime(endTime), 'HHmm');
      return {
        'grid-row': `channel-${kebabCase(category)}`,
        'grid-column': `time-${startStr} / time-${endStr}`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
// TODO(jjandoc): Add scroll snapping?

.time-slot {
  @apply flex items-center bg-gray-600 font-bold px-6 py-1 text-sm text-white whitespace-no-wrap;
  grid-row: times;
}

.channel {
  @apply flex items-center bg-gray-300 font-bold left-0 p-2 sticky;
  grid-column: channels;
}
</style>
