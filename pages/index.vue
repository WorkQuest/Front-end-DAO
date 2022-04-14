<template>
  <div />
</template>
<script>
import { Path } from '~/utils/enums';

export default {
  name: 'Index',
  created() {
    if (this.$cookies.get('access')) this.$router.push(Path.PROPOSALS);
    else this.$router.push('/sign-in');
  },
};
</script>
