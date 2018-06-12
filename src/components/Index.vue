<template>
	<div>
    <div class="container">
      <h1 class="blue-text">フェイの最終問題</h1>
      <div class="row">
        <div class="input-field col s6">
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
        <div class="input-field col s6">
          <select name="spawn" v-model.number="spawn">
            <option value="" selected>全て</option>
            <option value="1">店売り</option>
            <option value="2">床落ち</option>
            <option value="3">モンスター</option>
          </select>
          <label>入手手段</label>
        </div>
        <div class="input-field col s6">
          <input type="number" name="buy" id="form_buy" min="0" v-model.number="buy">
          <label for="form_buy">買値</label>
        </div>
        <div class="input-field col s6">
          <input type="number" name="sell" id="form_sell" min="0" v-model.number="sell">
          <label for="form_sell">売値</label>
        </div>
        <div class="input-field col s6">
          チェック済みのItemを除外
        </div>
        <div class="input-field col s6">
          <div class="switch">
            <label>
              OFF
              <input type="checkbox" v-model="checkedFilter">
              <span class="lever"></span>
              ON
            </label>
          </div>
        </div>
        <div class="input-field col s12">
          <button class="btn waves-effect waves-light" @click="saveChecked">チェック状況を保存<i class="material-icons right">save</i></button>
          <a class="waves-effect waves-light btn red modal-trigger" href="#confirmModal">削除<i class="material-icons right">delete</i></a>
        </div>
      </div>
      <form name="itemList">
      <ul class="collection">
        <li v-for="item in filteredItems" class="collection-item" v-bind:id="'list'+item.id">
          <label v-bind:for="'item'+item.id"><input type="checkbox" v-bind:id="'item'+item.id" v-model="checked[item.id]"><span>{{ item.name }}</span></label>
        </li>
      </ul>
      </form>
    </div>
    <div id="confirmModal" class="modal">
      <div class="modal-content">
        <h3 class="red-text">確認</h3>
        <p>削除したデータは復元できません！本当に削除する場合は、下の「削除する」を押してください。</p>
      </div>
      <div class="modal-footer">
        <button class="modal-close waves-effect waves-grey btn-flat">戻る</button>
        <button href="#!" class="modal-close waves-effect waves-red btn-flat red-text" @click="deleteChecked">削除する</button>
      </div>
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
        checked: [],
        checkedFilter: false,
      }
    },
    mounted() {
      let selectEls = document.querySelectorAll('select')
      M.FormSelect.init(selectEls, {})
      let modalEls = document.querySelectorAll('.modal')
      M.Modal.init(modalEls, {})
      axios.get('/static/json/items.json')
        .then(res => (this.items = res.data))
      axios.get('/static/json/prices.json')
        .then(res => (this.prices = res.data))
      this.checked = JSON.parse(localStorage.getItem('checked'))
      if (this.checked === null) {
        this.checked = []
        for (let i = 1; i <= 82; i++) {
          this.checked[i] = null
        }
      }
    },
    computed: {
      filteredItems: function() {
        let items = this.items
        let prices = this.prices
        if (this.checkedFilter) {
          items = items.filter(item => this.checked[item.id] !== true)
        }
        if (this.type === '' && this.buy === '' && this.sell === '' && this.spawn === '') {
          return []
        }
        if (this.type) {
          items = items.filter(item => item.type === this.type)
        }
        if (this.spawn !== '') {
          items = items.filter(item => item.spawn === this.spawn || item.spawn === 0)
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
    methods: {
      saveChecked() {
        localStorage.setItem('checked', JSON.stringify(this.checked))
        M.toast({html: 'チェック状況を保存しました', classes: 'teal white-text'})
      },
      deleteChecked() {
        localStorage.removeItem('checked')
        for (let i = 1; i <= 82; i++) {
          this.checked[i] = null
        }
        document.itemList.reset();
        M.toast({html: 'チェック状況をクリアしました', classes: 'red white-text'})
      },
    },
  }
</script>
<style scoped>
h1 {
  font-size: 1.5rem;
}
</style>