<template>
  <button
    :style="styles"
    class="p-2 relative text-xs text-left z-10"
    :class="{
      'bg-blue text-white': !isSelected,
      'bg-white': isSelected,
    }"
    type="button"
    tabindex="-1"
    aria-hidden="true"
    @click="handleClick"
  >
    <div class="font-bold text-sm">{{ event.title }}</div>
    <div>{{ startTime }} - {{ endTime }}</div>
    <template v-if="event.description">
      <VClamp :max-lines="showInlineDescription && isSelected ? 0 : 2">{{
        event.description
      }}</VClamp>
    </template>
    <EventLinks
      v-if="showInlineDescription && isSelected"
      class="mt-4"
      :event="event"
    />
  </button>
</template>

<script>
import VClamp from 'vue-clamp';
import kebabCase from 'lodash/kebabCase';
import { format } from 'date-fns-tz';
import EventLinks from '~/components/EventLinks';
import TrackingEvents from '~/constants/TrackingEvents';
import formatDate from '~/util/formatDate';
import getNearestStartTime from '~/util/getNearestStartTime';
import getNearestEndTime from '~/util/getNearestEndTime';

export default {
  components: { EventLinks, VClamp },
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
    showInlineDescription: {
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
