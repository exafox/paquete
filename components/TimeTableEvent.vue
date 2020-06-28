<template>
  <EventListing
    :event="event"
    :is-selected="isSelected"
    :style="styles"
    class="time-table-event z-10"
    v-bind="accessibilityProps"
    @click="handleClick"
  />
</template>

<script>
import kebabCase from 'lodash/kebabCase';
import { format } from 'date-fns-tz';
import EventListing from '~/components/EventListing';
import formatDate from '~/util/formatDate';
import getNearestStartTime from '~/util/getNearestStartTime';
import getNearestEndTime from '~/util/getNearestEndTime';

export default {
  components: { EventListing },
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
    accessibilityProps() {
      return this.isClone ? { 'aria-hidden': 'true', tabindex: -1 } : {};
    },
    endTime() {
      return formatDate(this.event.endTime);
    },
    startTime() {
      return formatDate(this.event.startTime);
    },
    styles() {
      const { channel, endTime, startTime } = this.event;
      const displayedStartTime =
        startTime < this.timeTableStart ? this.timeTableStart : startTime;
      const startStr = format(getNearestStartTime(displayedStartTime), 'HHmm', {
        timeZone: 'America/New_York',
      });
      const endStr = format(getNearestEndTime(endTime), 'HHmm');
      return {
        'grid-row': `channel-${kebabCase(channel) +
          (this.isClone ? '-clone' : '')}`,
        'grid-column': `time-${startStr} / time-${endStr}`,
      };
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.event);
    },
  },
};
</script>
