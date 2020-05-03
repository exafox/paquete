<template>
  <button
    :style="styles"
    class="text-white p-2 relative text-xs text-left z-10"
    :class="{
      'bg-blue-600': !isSelected,
      'bg-orange-600': isSelected,
    }"
    type="button"
    tabindex="-1"
    aria-hidden="true"
    @click="handleClick"
  >
    <div class="font-bold text-sm">{{ event.title }}</div>
    <div>{{ startTime }} - {{ endTime }}</div>
  </button>
</template>

<script>
import kebabCase from 'lodash/kebabCase';
import { format } from 'date-fns-tz';
import TrackingEvents from '~/constants/TrackingEvents';
import formatDate from '~/util/formatDate';
import getNearestStartTime from '~/util/getNearestStartTime';
import getNearestEndTime from '~/util/getNearestEndTime';

export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
    isClone: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    timeTableStart: {
      type: Date,
      required: true,
    },
  },
  computed: {
    endTime() {
      return formatDate(this.event.endTime);
    },
    startTime() {
      return formatDate(this.event.startTime);
    },
    styles() {
      const { category, endTime, startTime } = this.event;
      const displayedStartTime =
        startTime < this.timeTableStart ? this.timeTableStart : startTime;
      const startStr = format(getNearestStartTime(displayedStartTime), 'HHmm', {
        timeZone: 'America/New_York',
      });
      const endStr = format(getNearestEndTime(endTime), 'HHmm');
      return {
        'grid-row': `channel-${kebabCase(category) +
          (this.isClone ? '-clone' : '')}`,
        'grid-column': `time-${startStr} / time-${endStr}`,
      };
    },
  },
  methods: {
    handleClick() {
      const trackingPayload = {
        event: TrackingEvents.CLICKED_TIMETABLE_EVENT,
        title: this.event.title,
        date: this.event.startTime,
      };
      this.$gtm.push(trackingPayload);
      this.$emit('click', this.event);
    },
  },
};
</script>
