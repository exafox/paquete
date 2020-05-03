<template>
  <div
    class="event-description flex flex-col flex-grow items-start justify-center"
  >
    <template v-if="event">
      <div class="font-bold leading-none mb-4 text-3xl md:text-5xl font-bold">
        {{ event.title }}
      </div>
      <div>
        {{ formatDate(event.startTime) }} - {{ formatDate(event.endTime) }}
      </div>
      <div v-if="event.description" class="mt-2 text-lg">
        {{ event.description }}
      </div>
      <EventLinks class="mt-8" :event="event" size="lg" />
    </template>
  </div>
</template>

<script>
import { format } from 'date-fns-tz';
import EventLinks from '~/components/EventLinks';

export default {
  components: { EventLinks },
  props: {
    event: {
      type: Object,
      default: null,
    },
  },
  methods: {
    formatDate(date) {
      return format(date, 'h:mm a', { timeZone: 'America/New_York' });
    },
  },
};
</script>

<style lang="scss" scoped></style>
