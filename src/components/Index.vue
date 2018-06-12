<template>
	<div>
    <div class="container">
      <p>
        以下に条件を入力すると、該当するアイテムの一覧が表示されます。
      </p>
      <div class="row">
        <div class="input-field col s12 m7">
          <select name="type" v-model="type">
            <option value="" disabled selected>[未選択]</option>
            <option value="草">草</option>
            <option value="巻物">巻物</option>
            <option value="腕輪">腕輪</option>
            <option value="杖">杖</option>
            <option value="壺">壺</option>
          </select>
          <label>種類</label>
        </div>
        <div class="input-field col s6 m6">
          <input type="number" name="buy" id="form_buy" min="0" v-model.number="buy">
          <label for="form_buy">買値</label>
        </div>
         <div class="input-field col s6 m6">
          <input type="number" name="sell" id="form_sell" min="0" v-model.number="sell">
          <label for="form_sell">売値</label>
        </div>
        <div class="input-field col s12 m7">
          <select name="spawn" v-model.number="spawn">
            <option value="" selected>全て</option>
            <option value="0">通常</option>
            <option value="1">店売りのみ</option>
            <option value="2">床落ちのみ</option>
            <option value="3">モンスターのみ</option>
          </select>
          <label>入手手段</label>
        </div>
      </div>
      <ul class="collection">
        <li v-for="item in filteredItems" class="collection-item">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        type: '',
        buy: '',
        sell: '',
        spawn: '',
        items: [],
        prices: [],
      }
    },
    mounted() {
      let elems = document.querySelectorAll('select')
      let instances = M.FormSelect.init(elems, {})
      axios.get('/static/json/items.json')
        .then(res => (this.items = res.data))
      axios.get('/static/json/prices.json')
        .then(res => (this.prices = res.data))
    },
    computed: {
      filteredItems: function() {
        let items = this.items
        let prices = this.prices
        if (this.type === '' && this.buy === '' && this.sell === '' && this.spawn === '') {
          return []
        }
        if (this.type) {
          items = items.filter(item => item.type === this.type)
        }
        if (this.spawn !== '') {
          items = items.filter(item => item.spawn === this.spawn)
        }
        if (this.buy) {
          let items_ids = []
          let new_items = []
          for (let item of items) {
            items_ids.push(item.id)
          }
          prices = prices.filter(record => {
            return record.buy === this.buy && items_ids.includes(record.id)
          })
          for (let record of prices) {
            if (record.buy === this.buy && items_ids.includes(record.id)) {
              for (let item of items) {
                if (item.id === record.id) {
                  let name = item.name
                  if (record.size !== null) {
                    name += '[' + record.size + ']'
                  }
                  new_items.push({
                    id: item.id,
                    name: name,
                    spawn: item.spawn,
                    type: item.type,
                  })
                  break
                }
              }
            }
          }
          items = new_items
        }
        if (this.sell) {
          let items_ids = []
          let new_items = []
          for (let item of items) {
            items_ids.push(item.id)
          }
          prices = prices.filter(record => {
            return record.sell === this.sell && items_ids.includes(record.id)
          })
          for (let record of prices) {
            if (record.sell === this.sell && items_ids.includes(record.id)) {
              for (let item of items) {
                if (item.id === record.id) {
                  let name = item.name
                  if (record.size !== null && this.buy === '') {
                    name += '[' + record.size + ']'
                  }
                  new_items.push({
                    id: item.id,
                    name: name,
                    spawn: item.spawn,
                    type: item.type,
                  })
                  break
                }
              }
            }
          }
          items = new_items
        }
        return items
      }
    },
  }
</script>