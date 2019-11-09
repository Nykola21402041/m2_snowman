<script>
    export default {
        name: "AbstractPage",
        methods: {
            setTitle: function () {
                this.$store.state.pageTitle = this.title;
            }
        },
        mounted() {
            this.setTitle();
        }
    }
</script>