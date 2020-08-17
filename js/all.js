Vue.component('loading', VueLoading);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

import zh_TW from './zh_TW.js';

VeeValidate.localize('tw', zh_TW);

VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  }
});
Vue.filter('toCurrency', function (num) {
  //避免有原價與特價造成的錯誤
  if (!num) return;
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
})


new Vue({
  el: '#app',
  data: {
    products: [],
    tempProduct: {
      num: ''
    },
    carts: [],
    cartsTotal: 0,
    status: {
      loadingItem: '',
      loadingcart: '',
    },
    form: {
      name: '',
      email: '',
      tel: '',
      address: '',
      payment: '',
      message: '',
    },
    isLoading: false,
    tempProductTotal: '',
    api: {
      uuid: '8a8058c0-58d2-485b-b7fc-3c9be181cca7',
      path: 'https://course-ec-api.hexschool.io/api/',
    },
    closeModalID: '',
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
          this.getCart();
          this.isLoading = false;
          console.log(res);
        }).catch(error => {
          this.isLoading = false;
          console.log(error.response)
        });
    },
    getCart() {
      const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
      axios.get(url)
        .then(res => {
          this.carts = res.data.data;
          this.updateCartTotal()
        }).catch(error => {
          console.log(error.response)
        });
    },
    updateCartQuantity(id, quantity) {
      this.status.loadingcart = id;
      const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
      const cart = {
        product: id,
        quantity,
      };
      axios.patch(url, cart)
        .then(() => {
          this.getCart();
          this.status.loadingcart = '';
        }).catch(() => {
          this.status.loadingcart = '';
        });
    },
    updateCartTotal() {
      this.cartsTotal = 0;
      this.carts.forEach((item) => {
        this.cartsTotal += item.product.price * item.quantity;
      })
    },
    removeCartItem(id) {
      this.status.loadingcart = id;
      const url = `${this.api.path}${this.api.uuid}/ec/shopping/${id}`;
      axios.delete(url)
        .then(res => {
          this.status.loadingcart = '';
          this.getCart();
        }).catch(() => {
          this.status.loadingcart = '';
        })
    },
    removeCartAllItem() {
      const url = `${this.api.path}${this.api.uuid}/ec/shopping/all/product`
      axios.delete(url)
        .then(res => {
          this.getCart();
          $('#delCartAllModal').modal('hide');
        }).catch(() => {
          $('#delCartAllModal').modal('hide');
        })
    },
    createOrder() {
      const url = `${this.api.path}${this.api.uuid}/ec/orders`;

      axios.post(url, this.form)
        .then(res => {
          if (res.data.data.id) {
            // 跳出提示訊息
            $('#orderModal').modal('show');

            // 重新渲染購物車
            this.getCart();
          }
        }).catch(error => {
          console.log(error.response.data.errors);
        });
    },
    closeModal() {
      switch (this.closeModalID) {
        case 'deleteReturn':
          $('#delCartAllModal').modal('hide');
          break;
        case 'formReturn':
          $('#fromModal').modal('hide');
          break;
        case 'finish':
          $('#orderModal').modal('hide');
          break;
      };
      this.closeModalID = '';
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  },
})