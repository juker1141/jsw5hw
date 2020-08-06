
new Vue({
  el: '#app',
  data: {
    products: [],
    api: {
      uuid: '8a8058c0-58d2-485b-b7fc-3c9be181cca7',
      path: 'https://course-ec-api.hexschool.io/api/',
    },
    shoppingCartList: [],
  },
  methods: {
    getProducts() {
      const url = `${this.api.path}${this.api.uuid}/ec/products`;
      axios.get(url)
        .then(res => {
          console.log(res);
          this.products = res.data.data;
        })
    },
    addToCart(item) {
      console.log(item);
      this.shoppingCartList.push(item);
    }
  },
  created() {
    this.getProducts()
  },
})