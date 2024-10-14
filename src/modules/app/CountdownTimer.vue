<script setup>
import VueCountdown from '@chenfengyuan/vue-countdown';

defineProps({
    time: {
        type: Number,
        required: true,
    },
});
</script>

<template>
    <div class="countdown-timer">
        <vue-countdown :time="time" v-slot="{ days, hours, minutes, seconds }">
            <span class="countdown-timer__slot">{{ days }}</span>
            :
            <span class="countdown-timer__slot">{{ hours }}</span>
            :
            <span class="countdown-timer__slot">{{ minutes }}</span>
            :
            <span class="countdown-timer__slot">{{ seconds }}</span>
        </vue-countdown>
    </div>
</template>

<style lang="scss" scoped>
.countdown-timer {
    @include text-size(22px, 26px, 700);

    text-align: center;
}
</style>
