<template>
  <div class="discussion">
      <div class="content"
           v-for="(file, i) in files"
           :key="i"
           :file="file">
      <div class="column">
        <div class="column__icon" >
        <img
          src = "~/assets/img/ui/pdf.svg"
          alt=""
          >
        </div>
        <div class="column__name"> {{ file.name }} </div>
        <div class="column__size"> {{ file.size }} </div>
          <span class="column__close">
            <img
                src = "~/assets/img/ui/close.svg"
                alt=""
            >
          </span>
      </div>
        <div class="column">
          <div class="column__icon" >
            <img
                src = "~/assets/img/ui/pdf.svg"
                alt=""
            >
          </div>
          <div class="column__name"> {{ file.name }} </div>
          <div class="column__size"> {{ file.size }} </div>
            <span class="column__close">
              <img
                  src = "~/assets/img/ui/close.svg"
                  alt=""
              >
            </span>
        </div>
      </div>
  </div>
</template>
<script>

export default {
  data() {
    return {

      files: [
        {
          size: '1.2 MB',
          name: 'Some_document.pdf',
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.discussion {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 8px;
}
.content {
  display: flex;
  align-items: center;
}
.column{
  display: flex;
  align-items: center;
  &__name{
    font-size: 16px;
    line-height: 145%;
    color: #282F39;
    margin: 0px 8px 0px 16px;
  }
  &__icon{
    margin: 0px 0px 0px 0px;
  }
  &__size{
    font-size: 13px;
    line-height: 130%;
    color: #A7AEB9;
    margin-right: 10px;
  }
  &__close{
    width: 33px;
    height: 33px;
    margin-right: 13px;
    cursor: pointer;
    align-items: center;
  }
}

</style>
