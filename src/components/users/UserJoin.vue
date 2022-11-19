<template>
  <v-row
    class="d-flex justify-center align-center fill-height"
    style="min-height: 100vh"
  >
    <v-col cols="12" md="6">
      <v-card class="py-6">
        <v-card-title class="d-flex justify-center">
          <div class="text-h4">Regist</div>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Id" outlined></v-text-field>
          <v-text-field label="Password" outlined></v-text-field>
          <v-text-field label="Name" outlined></v-text-field>
          <v-text-field label="Email" outlined></v-text-field>
          <div class="text-right">
            <v-btn color="primary" class="mr-2" @click="Regist"> Regist </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({}),
  computed: {},
  methods: {
    Regist() {},
  },
};
</script>
