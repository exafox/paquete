<template>
  <div v-if="!isLoading">
    <TimeTable
      :channels="channels"
      :events="upcomingEvents"
      :current-time="currentTime"
      :start-time="startTime"
      :hours-to-display="hoursToDisplay"
      class="w-full"
    />
  </div>
  <LoadingScreen v-else />
</template>

<script>
import addHours from 'date-fns/addHours';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import uniq from 'lodash/uniq';
import LoadingScreen from '~/components/LoadingScreen';
import TimeTable from '~/components/TimeTable';
import getNearestStartTime from '~/util/getNearestStartTime';
import { fetchData } from '~/services/api';

export default {
  name: 'Homepage',
  components: { LoadingScreen, TimeTable },
  data() {
    return {
      currentTime: new Date(),
      events: [],
      hoursToDisplay: 6,
      isLoading: true,
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

<style></style>
