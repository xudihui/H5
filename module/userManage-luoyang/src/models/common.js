import modelExtend from 'dva-model-extend'

const model = {
  reducers: {
    updateState (state, { payload }) {
      console.log('updateState:',state,{ payload })
      return {
        ...state,
        ...payload,
      }
    },
  },
}

const pageModel = modelExtend(model, {

  state: {
    selectedRows: [],//所有选中行
    lists:[], //列表数据
    current:{},//当前选中行
    expandedKeys:[''],//初始化展开节点
    v:{
      add:false,
      edit:false,
      view:false
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      //size:'small',
      showTotal: total => `一共 ${total} 条信息`,
      current: 1,
      total: 0,
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },

})


module.exports = {
  model,
  pageModel,
}
