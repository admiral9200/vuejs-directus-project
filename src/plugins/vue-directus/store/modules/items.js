/* eslint-disable padding-line-between-statements */
import client from '@/api'

const namespaced = true

const state = {
  status: undefined,
  fetched: {},
  commited: {}
}

const mutations = {
  STATUS: (state, payload) => {
    state.status = payload
  },

  FETCH: (state, payload) => {
    state.fetched = payload
  },

  ADD: (state, { table, payload }) => {
    state.fetched[table].data.push(payload)
  },

  REMOVE: (state, { table, index }) => {
    state.fetched[table].data.splice(index, 1)
  },

  EDIT: (state, { table, column, index, content }) => {
    state.fetched[table].data[index][column] = content
  },

  COMMIT: (state, { table, item }) => {
    state.commited[table] = state.commited[table] || []
    state.commited[table].push(item)
  },

  UNDO: (state, { table, index }) => {
    state.commited[table].splice(index, 1)
    if (state.commited[table].length === 0) {
      delete state.commited[table]
    }
  }
}

const actions = {
  // Fetch all items from a given table
  async fetch({ commit }, table) {
    await client
      .getItems(table)
      .then(resp => {
        const data = {}
        data[table] = resp
        return commit('FETCH', data)
      })
      .catch(() => {
        throw Error('Failed to fetch items from directus backend')
      })
  },

  // Add new item to given table
  async add({ commit }, { table, payload }) {
    await client
      .createItem(table, payload)
      .then(resp => {
        return commit('ADD', { table, payload: resp.data })
      })
      .catch(() => {
        throw Error('Failed to add item to directus backend')
      })
  },

  // Remove item from given table
  async remove({ commit }, { table, id }) {
    const index = state.fetched[table].data.findIndex(el => el.id === id)

    await client
      .deleteItem(table, id)
      .then(resp => {
        return commit('REMOVE', { table, index })
      })
      .catch(() => {
        throw Error('Failed to add delete item from directus backend')
      })
  },

  // Edit item in a given table
  edit({ commit }, { table, id, column, content }) {
    const index = state.fetched[table].data.findIndex(el => el.id === id)
    commit('EDIT', { table, column, index, content })
  },

  // Commit item (ready for pushing)
  commit({ commit }, { table, id }) {
    const item = state.fetched[table].data.filter(el => el.id === id)[0]
    const group = state.commited[table]
    const fresh = !(group && group.includes(item))
    if (fresh) {
      commit('COMMIT', { table, item })
      commit('STATUS', 'COMMITED')
    }
  },

  // Undo previous commit
  undo({ commit }, { table, id }) {
    const index = state.commited[table].findIndex(el => el.id === id)
    commit('UNDO', { table, index })
    if (Object.keys(state.commited).length === 0) {
      commit('STATUS', undefined)
    }
  },

  // Push commited items to server
  async push({ state, commit }) {
    commit('STATUS', 'PUSHING')
    for (let [table, items] of Object.entries(state.commited)) {
      await client
        .updateBulk(table, items)
        .then(resp => {
          setTimeout(() => {
            commit('STATUS', undefined)
          }, 3000)
          return commit('STATUS', 'PUSHED')
        })
        .catch(() => {
          throw Error('Failed to update items in directus backend')
        })
    }
  }
}

const getters = {
  status: state => state.status,
  data(state) {
    return table => (state.fetched[table] ? state.fetched[table].data : [])
  }
}

export default {
  namespaced,
  state,
  mutations,
  getters,
  actions
}
