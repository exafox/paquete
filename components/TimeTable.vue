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
    <TimeTableEvent
      v-for="item in events"
      :key="item.id"
      :event="item"
      :is-selected="selectedEvent === item"
      :time-table-start="startTime"
      @click="$emit('eventClick', $event)"
    />

    <!-- Cloned elements for autoscrolling -->
    <template v-if="autoScroll">
      <div
        v-for="channel in channels"
        :key="`${channel}-clone`"
        class="channel"
        aria-hidden="true"
      >
        {{ channel }}
      </div>
      <TimeTableEvent
        v-for="item in events"
        :key="`${item.id}-clone`"
        :event="item"
        :is-clone="true"
        :is-selected="selectedEvent === item"
        :time-table-start="startTime"
        @click="$emit('eventClick', $event)"
      />
    </template>
  </div>
</template>

<script>
import addMinutes from 'date-fns/addMinutes';
import kebabCase from 'lodash/kebabCase';
import { format } from 'date-fns-tz';
import TimeTableEvent from '~/components/TimeTableEvent';
import formatDate from '~/util/formatDate';

export default {
  components: { TimeTableEvent },
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
    selectedEvent: {
      type: Object,
      default: null,
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
    formatDate,
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
