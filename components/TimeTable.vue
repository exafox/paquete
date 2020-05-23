<template>
  <div
    ref="container"
    class="time-table bg-gray grid overflow-auto relative"
    :class="{
      'no-scroll-bars': !showScrollBars,
    }"
    :style="tableStyles"
  >
    <!-- Timeslot Labels -->
    <div ref="timeSlot" class="time-slot left-0 z-30">
      {{ formatDate(currentTime) }}
    </div>
    <div v-for="date in timeslots" :key="date.toISOString()" class="time-slot">
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
      :show-inline-description="showInlineDescriptions"
      :time-table-start="startTime"
      @click="$emit('eventClick', $event)"
    />

    <!-- Cloned elements for infinite scrolling -->
    <div
      v-for="channel in channels"
      :key="`${channel}-clone`"
      :ref="`${channel}-clone`"
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
      :show-inline-description="showInlineDescriptions"
      :time-table-start="startTime"
      @click="$emit('eventClick', $event)"
    />
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
    showInlineDescriptions: {
      type: Boolean,
      default: false,
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
          '[grid-lines] 0',
          ...this.channels.map(
            (channel) =>
              `[channel-${kebabCase(channel)}] minmax(${100 /
                this.channels.length}%, auto)`
          ),
          ...this.channels.map(
            (channel) =>
              `[channel-${kebabCase(channel)}-clone] minmax(${100 /
                this.channels.length}%, auto)`
          ),
        ].join(' '),
      };
    },
  },
  created() {
    this.interval = setInterval(() => {
      if (!this.$refs.container) return;
      const currentScrollTop = this.$refs.container.scrollTop;
      const clonesHeight = this.getCloneHeight();
      let newScrollTop = 1;
      if (currentScrollTop <= 0) {
        newScrollTop = clonesHeight;
      } else if (currentScrollTop < clonesHeight) {
        newScrollTop = currentScrollTop + (this.autoScroll ? 1 : 0);
      }
      this.$refs.container.scrollTop = newScrollTop;
    }, 80);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    formatDate,
    getCloneHeight() {
      return (
        Object.entries(this.$refs).reduce((acc, [key, el]) => {
          if (key.includes('-clone') && el) {
            acc += el[0].offsetHeight;
          }
          return acc;
        }, 0) + this.$refs.timeSlot.offsetHeight
      );
    },
  },
};
</script>

<style lang="scss" scoped>
$grid-gap: 5px;

.time-table {
  grid-gap: $grid-gap;
}

.time-table.no-scroll-bars {
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.time-slot {
  @apply flex items-center bg-blue font-bold justify-center px-12 py-1 sticky text-sm text-white top-0 whitespace-no-wrap z-30;
  grid-row: times;

  &::after {
    @apply absolute block bg-white inset-y-0;
    content: '';
    right: -$grid-gap;
    width: $grid-gap;
  }
}

.vertical-grid-line {
  height: 0;
  grid-row: grid-lines;

  &::after {
    @apply absolute block bg-white top-0;
    content: '';
    height: 100vh;
    right: -$grid-gap;
    width: $grid-gap;
  }
}

.channel {
  @apply bg-navy flex font-bold items-center justify-center left-0 p-2 sticky text-center text-sm text-yellow uppercase z-20;
  grid-column: channels;

  // Horizontal grid lines
  &::after {
    @apply absolute block bg-white left-0;
    content: '';
    height: $grid-gap;
    top: -$grid-gap;
    width: 100vw;
  }
}
</style>
