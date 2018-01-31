<template>
	<article class="grid-item post post-card">
		<template v-if="image">
			<div :class="imageClass" @mouseover="mouseover" @mouseout="mouseout">
				<div class="post-image-filter" :style="imageStyle"></div>
				<div class="post-content">
					<header class="post-header">
						<h2 class="post-title"><a :href="url">{{title}}</a></h2>
					</header>
					<div>
						<time class="post-date" :datetime="datetime">{{datetext}}</time>
					</div>
				</div>
			</div>
		</template>
	</article>
</template>

<script>
	import fitvids from "fitvids";

	import Author from "./Author.vue";
	import Tag from "./Tag.vue";

	import excerpt from "../js/excerpt.js";

	const minlen = (str, len) => (str.length < len) ? minlen('0' + str, len) : str;
	const pad2 = (str) => minlen('' + str, 2);
	const monthString = (num) => [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	][num];

	export default {
		props: {
			title: {
				type: String,
				required: true
			},
			slug: {
				type: String,
				required: true
			},
			url: {
				type: String,
				required: true
			},
			image: {},
			excerpt: {
				type: String,
				required: true
			},
			author: {
				type: Object,
				required: true
			},
			tags: {
				type: Array,
				required: true
			},
			index: {
				type: Number,
				required: true
			},
			date: {
				required: true
			}
		},
		computed: {
			datetime(){
				return `${this.date.getFullYear()}-${pad2(this.date.getMonth() + 1)}-${pad2(this.date.getDate())}`;
			},

			datetext(){
				return `${pad2(this.date.getDate())} ${monthString(this.date.getMonth())} ${this.date.getFullYear()}`;
			},

			/*url(){
				return `/${this.slug}`;
			},*/

			imageStyle(){
				return `background-image: url("${this.image}")`;
			},

			imageClass(){
				return `post-image${this.hover ? ' hover' : ''}`;
			},

			computedExcerpt(){
				return `${this.excerpt}…`;
			}
		},
		mounted() {
			this.$el.style.animationDuration = ".5s";
			this.$el.style.webkitAnimationDuration = ".5s";
			this.$el.style.animationDelay = this.index / 2 + "s";
			this.$el.style.webkitAnimationDelay = this.index / 2 + "s";
			this.$el.style.animationName = "flip";
			this.$el.style.webkitAnimationName = "flip";
			fitvids(".post-content");
		},
		methods: {
			mouseover(){
				this.hover = true;
			},

			mouseout(){
				this.hover = false;
			}
		},
		data(){
			return {
				hover: false
			};
		},
		components: {
			Author,
			Tag
		}
	}
</script>
