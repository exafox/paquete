<template>
  <div
    class="event-description flex flex-col overflow-x-hidden overflow-y-auto"
  >
    <template v-if="event">
      <div class="flex flex-col flex-grow items-start justify-center  p-12">
        <div class="font-bold leading-none mb-4 text-3xl md:text-5xl font-bold">
          {{ event.title }}
        </div>
        <div class="flex">
          <div v-if="event.startTime" class="font-medium items-center mr-8">
            {{ formatDate(event.startTime) }} - {{ formatDate(event.endTime) }}
          </div>
          <EventBadges :event="event" />
        </div>
        <span
          v-if="description"
          class="block mt-4 text-lg whitespace-pre-line"
          >{{ description }}</span
        >
      </div>
      <EventLinks
        class="bg-white sticky bottom-0 mt-4 px-12 pb-12"
        :event="event"
        size="lg"
      />
    </template>
  </div>
</template>

<script>
import { format } from 'date-fns-tz';
import EventBadges from '~/components/EventBadges';
import EventLinks from '~/components/EventLinks';

export default {
  components: { EventBadges, EventLinks },
  props: {
    event: {
      type: Object,
      default: null,
    },
  },
  computed: {
    description() {
      return this.event.description ? this.event.description.trim() : null;
    },
  },
  methods: {
    formatDate(date) {
      return format(date, 'h:mm a', { timeZone: 'America/New_York' });
    },
  },
};
</script>

<style lang="scss" scoped>
.event-links::before {
  @apply absolute block h-0 inset-x-0 pb-8;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  content: '';
  top: -2em;
}
</style>
