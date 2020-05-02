<template>
  <div class="flex flex-wrap flex-row-reverse">
    <div class="video bg-black w-1/2"></div>
    <div
      class="bg-blue-500 description flex flex-col overflow-auto p-4 md:p-8 text-white w-1/2"
    >
      <EventDescription :event="selectedEvent" />
    </div>
    <TimeTable
      :channels="channels"
      :events="upcomingEvents"
      :current-time="currentTime"
      :start-time="startTime"
      :hours-to-display="hoursToDisplay"
      class="w-full"
      @eventClick="selectedEvent = $event"
    />
    <transition name="slow-fade">
      <LoadingScreen v-if="isLoading" />
    </transition>
  </div>
</template>

<script>
import addHours from 'date-fns/addHours';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import uniq from 'lodash/uniq';
import EventDescription from '~/components/EventDescription';
import LoadingScreen from '~/components/LoadingScreen';
import TimeTable from '~/components/TimeTable';
import getNearestStartTime from '~/util/getNearestStartTime';
import { fetchData } from '~/services/api';

export default {
  name: 'Homepage',
  components: { EventDescription, LoadingScreen, TimeTable },
  data() {
    return {
      currentTime: new Date(),
      events: [],
      hoursToDisplay: 6,
      isLoading: true,
      selectedEvent: null,
    };
  },
  computed: {
    channels() {
      return uniq(this.events.map((item) => item.category)).sort();
    },
    startTime() {
      return getNearestStartTime(this.currentTime);
    },
    upcomingEvents() {
      const tableEndTime = addHours(
        this.startTime,
        this.hoursToDisplay - 0.0167
      );
      return this.events.filter(
        (event) =>
          isAfter(event.endTime, this.startTime) &&
          isBefore(event.startTime, tableEndTime)
      );
    },
  },
  watch: {
    upcomingEvents(newVal) {
      if (newVal.length && !this.selectedEvent) {
        this.selectedEvent = newVal[0];
      }
    },
  },
  async created() {
    this.interval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
    this.events = await fetchData();
    this.isLoading = false;
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style lang="scss">
.slow-fade-leave {
  opacity: 1;

  &-active {
    transition: opacity 0.5s ease;
  }

  &-to {
    opacity: 0;
  }
}
</style>

<style lang="scss" scoped>
.video,
.description,
.time-table {
  height: 50vh;
}
</style>
