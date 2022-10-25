/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

new Vue({
    el: '#app',
    data: function () {
        return {visible: false};
    },
    mounted() {
        window.mainWindow.on('show-dialog', () => {
            this.visible = true;
        });
        // window.mainWindow.onLoaded('Vue on loaded!');
    },
    beforeDestroy() {},
    methods: {}
});
