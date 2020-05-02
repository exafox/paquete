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
      <div class="flex flex-wrap -mx-2 mt-8">
        <BaseButton
          v-if="event.link"
          tag="a"
          :href="event.link"
          target="_blank"
          rel="noopener noreferrer"
          class="mx-2 mb-2"
        >
          Watch
        </BaseButton>
        <BaseButton
          v-if="event.descriptionLink"
          tag="a"
          variant="secondary"
          :href="event.descriptionLink"
          target="_blank"
          rel="noopener noreferrer"
          class="mx-2 mb-2"
        >
          Learn more
        </BaseButton>
        <BaseButton
          v-if="event.donationLink"
          tag="a"
          variant="secondary"
          :href="event.donationLink"
          target="_blank"
          rel="noopener noreferrer"
          class="mx-2 mb-2"
        >
          Donate
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<script>
import { format } from 'date-fns-tz';
import BaseButton from '~/components/BaseButton';

export default {
  components: { BaseButton },
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
