Vue.component('loading', VueLoading);

new Vue({
  el: '#app',
  data: {
    products: [],
    tempProduct: {
      num: ''
    },
    api: {
      uuid: '8a8058c0-58d2-485b-b7fc-3c9be181cca7',
      path: 'https://course-ec-api.hexschool.io/api/',
    },
    status: {
      loadingItem: '',
    },
    shoppingCartList: [],
    isLoading: false,
    tempProductTotal: '',
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const url = `${this.api.path}${this.api.uuid}/ec/products?page=${page}`;
      axios.get(url)
        .then(res => {
          console.log(res);
          this.isLoading = false;
          this.products = res.data.data;
        }).catch(error => {
          this.isLoading = false;
        });
    },
    getProduct(id) {
      this.status.loadingItem = id;
      this.isLoading = true;
      const url = `${this.api.path}${this.api.uuid}/ec/product/${id}`;
      axios.get(url)
        .then(res => {
          this.isLoading = false;
          console.log(res);
          this.tempProduct = res.data.data;
          this.$set(this.tempProduct, 'num', 1);
          this.status.loadingItem = '';
          $('#productModal').modal('show');
        }).catch(error => {
          this.isLoading = false;
          this.status.loadingItem = '';
        });
    },
    addToCart(id, quantity = 1) {
      this.isLoading = true;
      const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
      const cart = {
        product: id,
        quantity,
      };

      axios.post(url, cart)
        .then(res => {
          this.isLoading = false;
          console.log(res)
        }).catch(error => {
          this.isLoading = false;
          console.log(error.response)
        });

    }
  },
  created() {
    this.getProducts()
  },
})