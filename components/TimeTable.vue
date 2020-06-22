<template>
  <div class="time-table relative bg-gray">
    <div
      ref="container"
      class="time-table-body absolute inset-0 grid overflow-auto"
      :class="{
        'no-scroll-bars': !showScrollBars,
        'infinite-scroll': infiniteScroll,
      }"
      :style="tableStyles"
    >
      <!-- Timeslot Labels -->
      <div ref="timeSlot" class="time-slot left-0 px-2 md:px-12 z-30">
        {{ formatDate(currentTime) }}
      </div>
      <div
        v-for="date in timeslots"
        :key="date.toISOString()"
        class="time-slot"
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
      <ChannelHeader v-for="channel in channels" :key="channel" class="channel">
        {{ channel }}
      </ChannelHeader>

      <!-- Events -->
      <TimeTableEvent
        v-for="item in events"
        :key="item.id"
        :event="item"
        :is-selected="selectedEvent === item"
        :time-table-start="startTime"
        @click="$emit('eventClick', $event)"
      />

      <!-- Cloned elements for infinite scrolling -->
      <template v-if="infiniteScroll">
        <ChannelHeader
          v-for="channel in channels"
          :key="`${channel}-clone`"
          :ref="`${channel}-clone`"
          class="channel"
          aria-hidden="true"
        >
          {{ channel }}
        </ChannelHeader>
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
  </div>
</template>

<script>
import addMinutes from 'date-fns/addMinutes';
import kebabCase from 'lodash/kebabCase';
import { format } from 'date-fns-tz';
import ChannelHeader from '~/components/ChannelHeader';
import TimeTableEvent from '~/components/TimeTableEvent';
import formatDate from '~/util/formatDate';

export default {
  components: { ChannelHeader, TimeTableEvent },
  props: {
    autoScroll: {
      type: Boolean,
      default: false,
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
    infiniteScroll: {
      type: Boolean,
      default: false,
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
  data() {
    return {
      cloneHeight: 0,
      lastScroll: null,
    };
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
            (channel) => `[channel-${kebabCase(channel)}] auto`
          ),
          ...(this.infiniteScroll
            ? this.channels.map(
                (channel) => `[channel-${kebabCase(channel)}-clone] auto`
              )
            : []),
        ].join(' '),
      };
    },
  },
  watch: {
    autoScroll: {
      handler(newVal) {
        if (newVal) {
          window.requestAnimationFrame(this.autoScrollPage);
        } else {
          this.lastScroll = null;
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  updated() {
    this.cloneHeight = this.getCloneHeight();
  },
  methods: {
    formatDate,
    getCloneHeight() {
      return (
        Object.entries(this.$refs).reduce((acc, [key, value]) => {
          const el = value[0] && value[0].$el;
          if (key.includes('-clone') && el) {
            acc += el.offsetHeight;
          }
          return acc;
        }, 0) + this.$refs.timeSlot.offsetHeight
      );
    },
    autoScrollPage(timestamp) {
      if (!this.infiniteScroll) return;
      if (this.$refs.container) {
        const currentScrollTop = this.$refs.container.scrollTop;
        const clonesHeight = this.cloneHeight;
        if (!this.lastScroll) {
          this.lastScroll = timestamp;
        }
        const elapsed = timestamp - this.lastScroll;

        let newScrollTop = 1;
        if (currentScrollTop <= 0) {
          newScrollTop = clonesHeight;
        } else if (currentScrollTop < clonesHeight) {
          const increment = Math.round(0.01 * elapsed);
          if (increment) {
            this.lastScroll = timestamp;
          }
          newScrollTop = currentScrollTop + (this.autoScroll ? increment : 0);
        }

        this.$refs.container.scrollTop = newScrollTop;
      }
      if (this.autoScroll) {
        window.requestAnimationFrame(this.autoScrollPage);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$grid-gap: 5px;

.time-table-body {
  grid-gap: $grid-gap;
}

.time-table-body.no-scroll-bars {
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.time-slot {
  @apply flex items-center bg-blue font-bold justify-center px-12 py-1 sticky text-sm text-white top-0 whitespace-no-wrap z-30;
  grid-row: times;
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

    @media screen and (min-width: 768px) {
      height: 40vh;

      .infinite-scroll & {
        height: 80vh;
      }
    }
  }
}

.channel {
  @apply box-content
    left-0
    sticky
    z-20;
  grid-column: channels;
  min-height: 3em;

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
