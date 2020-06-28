<template>
  <ModalWindow @close="$emit('close')">
    <h1 class="font-bold mb-4 text-xl">Share with:</h1>
    <!-- Note: grid-flow-col will overflow container if number
    of shareLinks gets long -->
    <ul class="grid gap-2 md:grid-flow-col">
      <li v-for="item in shareLinks" :key="item.name">
        <BaseButton
          tag="a"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          block
          @click.prevent="trackClick"
        >
          {{ item.name }}
        </BaseButton>
      </li>
    </ul>
  </ModalWindow>
</template>

<script>
import BaseButton from '~/components/BaseButton';
import ModalWindow from '~/components/ModalWindow';
import TrackingEvents from '~/constants/TrackingEvents';
import createPopupWindow from '~/util/createPopupWindow';
import serializeObject from '~/util/serializeObject';

export default {
  components: { BaseButton, ModalWindow },
  props: {
    description: {
      type: String,
      default: process.env.SHARE_DESCRIPTION,
    },
    title: {
      type: String,
      default: process.env.SHARE_TITLE,
    },
    tweet: {
      type: String,
      default: process.env.SHARE_DESCRIPTION,
    },
    url: {
      type: String,
      default: process.env.SHARE_URL,
    },
  },
  computed: {
    shareLinks() {
      return [
        {
          name: 'Facebook',
          link: `https://www.facebook.com/sharer/sharer.php?${serializeObject({
            u: this.url,
          })}`,
        },
        {
          name: 'Twitter',
          link: `https://twitter.com/intent/tweet?${serializeObject({
            text: this.tweet,
            url: this.url,
          })}`,
        },
        {
          name: 'Email',
          link: `mailto:?${serializeObject({
            body: `${this.description} ${this.url}`,
            subject: this.title,
          })}`,
        },
        {
          name: 'WhatsApp',
          link: `https://api.whatsapp.com/send?${serializeObject({
            text: `${this.title}: ${this.url}`,
          })}`,
        },
      ];
    },
  },
  methods: {
    trackClick(e) {
      const link = e.currentTarget.href;
      const trackingPayload = {
        event: TrackingEvents.CLICKED_EXTERNAL_LINK,
        link,
      };
      this.$gtm.push(trackingPayload);
      if (link.startsWith('https://www.facebook.com')) {
        createPopupWindow(link);
      } else {
        window.open(link, '_blank');
      }
    },
  },
};
</script>
