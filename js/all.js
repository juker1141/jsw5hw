new Vue({
  el: '#app',
  data: {
    products: [],
    tempProduct: {
      imageUrl: [],
    },
    api: {
      uuid: '8a8058c0-58d2-485b-b7fc-3c9be181cca7',
      path: 'https://course-ec-api.hexschool.io/api/',
    },
  },
  methods: {
    getProducts() {
      console.log(111)
    },
  },
  created() {
    this.getProducts()
  },
})