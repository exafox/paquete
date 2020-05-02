<template>
  <div
    ref="container"
    class="time-table bg-blue-400 grid overflow-auto relative"
    :class="{
      'no-scroll-bars': !showScrollBars,
    }"
    :style="tableStyles"
  >
    <!-- Timeslot Labels -->
    <div class="time-slot bg-gray-700 sticky left-0 pl-2 top-0 z-40">
      {{ formatDate(currentTime) }}
    </div>
    <div
      v-for="date in timeslots"
      :key="date.toISOString()"
      class="time-slot sticky justify-center top-0"
    >
      {{ formatDate(date) }}
    </div>

    <!-- Vertical grid lines -->
    <div
      v-for="date in timeslots"
      :key="`grid-${date.toISOString()}`"
      class="vertical-grid-line sticky top-0"
    />

    <!-- Channel Labels -->
    <div v-for="channel in channels" :key="channel" class="channel">
      {{ channel }}
    </div>

    <!-- Events -->
    <button
      v-for="item in events"
      :key="item.id"
      :style="getEventStyles(item)"
      class="bg-blue-600 text-white p-2 relative text-xs text-left z-10"
      type="button"
      @click="$emit('eventClick', item)"
    >
      <div class="font-bold text-sm">{{ item.title }}</div>
      <div>
        {{ formatDate(item.startTime) }} - {{ formatDate(item.endTime) }}
      </div>
    </button>

    <!-- Cloned elements for autoscrolling -->
    <template v-if="autoScroll">
      <div
        v-for="channel in channels"
        :key="`${channel}-clone`"
        class="channel"
      >
        {{ channel }}
      </div>

      <button
        v-for="item in events"
        :key="`${item.id}-clone`"
        :style="getEventStyles(item, true)"
        class="bg-blue-600 text-white p-2 relative text-xs text-left z-10"
        type="button"
        @click="$emit('eventClick', item)"
      >
        <div class="font-bold text-sm">{{ item.title }}</div>
        <div>
          {{ formatDate(item.startTime) }} - {{ formatDate(item.endTime) }}
        </div>
      </button>
    </template>
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
    autoScroll: {
      type: Boolean,
      default: true,
    },
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
    showScrollBars: {
      type: Boolean,
      default: false,
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
          ...this.channels.map(
            (channel) => `[channel-${kebabCase(channel)}-clone] auto`
          ),
        ].join(' '),
      };
    },
  },
  watch: {
    autoScroll: {
      handler(newVal) {
        clearInterval(this.interval);
        if (newVal) {
          this.interval = setInterval(() => {
            if (!this.$refs.container) return;
            const currentScrollTop = this.$refs.container.scrollTop;
            const containerHeight = this.$refs.container.offsetHeight;
            const newScrollTop =
              currentScrollTop >= 2 * containerHeight
                ? 0
                : currentScrollTop + 1;
            this.$refs.container.scrollTop = newScrollTop;
          }, 80);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.interval = null;
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    formatDate(date) {
      return format(date, 'h:mm a', { timeZone: 'America/New_York' });
    },
    getEventStyles(event, isClone = false) {
      const { category, endTime, startTime } = event;
      const displayedStartTime =
        startTime < this.startTime ? this.startTime : startTime;
      const startStr = format(getNearestStartTime(displayedStartTime), 'HHmm', {
        timeZone: 'America/New_York',
      });
      const endStr = format(getNearestEndTime(endTime), 'HHmm');
      return {
        'grid-row': `channel-${kebabCase(category) +
          (isClone ? '-clone' : '')}`,
        'grid-column': `time-${startStr} / time-${endStr}`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.time-table.no-scroll-bars {
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.time-slot {
  @apply flex items-center bg-gray-600 font-bold px-6 py-1 text-sm text-white whitespace-no-wrap z-30;
  grid-row: times;
}

.vertical-grid-line {
  height: 0;

  &::after {
    @apply absolute block bg-white opacity-25 top-0;
    // bottom: calc(-50vh + 32px);
    content: '';
    height: 50vh;
    right: -1px;
    width: 1px;
  }
}

.channel {
  @apply flex items-center bg-gray-300 font-bold left-0 p-2 sticky z-20;
  grid-column: channels;

  // Horizontal grid lines
  &::after {
    @apply absolute block bg-white left-0 opacity-25;
    top: -1px;
    content: '';
    height: 1px;
    width: 100vw;
  }
}
</style>
