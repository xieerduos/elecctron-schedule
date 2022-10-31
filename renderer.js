/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

new Vue({
  el: "#app",
  data: function () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      caches: [],
    };
  },
  computed: {
    total() {
      return this.caches.length;
    },
  },
  mounted() {
    window.mainWindow.on("local-log", (caches) => {
      this.setTableData(caches);
    });
    // window.mainWindow.onLoaded('Vue on loaded!');
  },
  beforeDestroy() {},
  methods: {
    setTableData(caches) {
      const { currentPage, pageSize } = this;
      this.tableData = caches.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize
      );
      this.caches = caches;
    },
    onSizeChange(pageSize) {
      this.pageSize = pageSize;

      this.setTableData(this.caches);
    },
    onCurrentChange(currentPage) {
      this.currentPage = currentPage;

      this.setTableData(this.caches);
    },
  },
});
