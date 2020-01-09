<template>
  <div>
    <!--搜索卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!--匿名插槽，内容主体-->
      <div class="text item">
        <!--el-form搜索表单区域-->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>

      <el-table :data="articleList" style="width:100%;" border>
        <el-table-column label="图标" prop="cover.images[0]">
          <!-- 体现img图片效果 -->
          <!-- 想方设法把当前的数据记录获得到，进而获得对应的cover.images[0] 以用于img标签显示使用-->
          <!-- 数据通过“作用域插槽”体现的，名称为“row” -->
          <img
            slot-scope="stData"
            :src="stData.row.cover.images[0]"
            alt="没有图标"
            width="150"
            height="100"
          />
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态" prop="status">
          <!-- 获得当前文章对象的status状态数据，做判断进而显示对应的内容效果-->
          <!-- 作用域插槽要被使用，与获取图标原理一致 -->
          <!-- 如果许多标签都需要接收插槽数据，处于代码优雅考虑，可以通过template雷锋标签统一接收 -->
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status===0">草稿</el-tag>
            <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
            <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
            <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <!-- 修改，删除不属于数据部分，只是普通按钮，可以不用设置prop，对应的内容可以通过el-table-column设置内容区域 -->
        <el-table-column label="操作">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="searchForm.per_page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tot">
    </el-pagination>
    </el-card>

  </div>
  <!--  label:表头信息   -->
</template>

<script>
export default {
  name: 'ArticleList',

  // 监听器设置
  watch: {
    // 被检测的成员: function (newV, oldV) {
    //   // newV:数据变化后样子
    //   // oldV:数据变化前样子
    // 对searchForm做深度监听
    searchForm: {
      handler: function (newV, oldV) {
        this.getArticleList()
      },
      deep: true
    },
    // }
    // 被检测成员一般就是data成员,它们的名称保持一致
    timetotime: function (newV) {
      // 把接收到的时间信息一分为二给到 begin_pubdate 和 end_pubdate
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  data () {
    return {
      articleList: [], // 文章列表
      tot: 0, // 文章总条数
      channelList: [], // 频道列表
      timetotime: '',
      // 搜索表单数据对象
      searchForm: {
        status: '', // 文章状态
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '',
        channel_id: '',
        page: 1, // 默认获取第1页数据
        per_page: 10 // 每页返回10条记录// 文章发布结束时
      }
    }
  },
  created () {
    // 获得频道
    this.getChannelList()
    // 获得文章
    this.getArticleList()
  },

  methods: {
    // 分页相关
    // 每条条数变化的回调处理
    handleSizeChange (val) {
      // val: 变化后的每页条数
      // 更新每页条数
      this.searchForm.per_page = val
      this.getArticleList()
    },
    handleCurrentChange (val) {
      // val 变化后的页码

      // 更新页码
      this.searchForm.page = val
      // 根据变化后页码重新获得文章列表
      this.getArticleList()
    },

    getArticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }

      let p = this.$http({
        url: '/mp/v1_0/articles',
        method: 'GET',
        params: searchData

      })
      p.then(rst => {
        if (rst.data.message === 'OK') {
          // data接收文章数据
          this.articleList = rst.data.data.results
          // 总记录条数
          this.tot = rst.data.data.total_count
        }
      }).catch(err => {
        return this.$message.error('获得频道失败：' + err)
      })
    },
    getChannelList () {
      let p = this.$http({
        url: '/mp/v1_0/channels',
        method: 'GET'
      })
      p.then(rst => {
        this.channelList = rst.data.data.channels
      }).catch(err => {
        return this.$message.error('获得频道失败：' + err)
      })
    }
  }
}
</script>
<style lang="less">
.box-card {
  margin-bottom: 20px;
}
</style>
