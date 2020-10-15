<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<button @click="GetFun">GET请求</button>
		<button style="margin-left: 40px" @click="PostFun">POST请求</button>
		<h1 v-if="getData">{{ getData }}</h1>
		<h1 v-if="postData">{{ postData }}</h1>
		<h1></h1>
	</div>
</template>

<script>
export default {
	name: "HelloWorld",
	props: {
		msg: String,
	},
	data() {
		return {
			getData: null,
			postData: null,
		};
	},
	methods: {
		GetFun() {
			this.$services
				.swiperdata({
					// isLoading: false, //是否开启loading层
					// ifHandleError: true, //是否全局统一处理错误
				})
				.then((res) => {
					this.getData = res.message;
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		PostFun() {
			this.$services
				.wxlogin({
					// isLoading: false, //是否开启loading层
					// ifHandleError: true, //是否全局统一处理错误
					encryptedData: "11111",
					rawData: "2222",
					iv: "3333",
					signature: "4444",
				})
				.then((res) => {
					this.postData = res.meta;
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
