<template>
	<div>
		<div class="post-list">
			<div class="post-column full-column">
				<template v-for="post in posts">
						<post
							v-if="post"
							:title="post.title"
							:slug="post.slug"
							:excerpt="post.excerpt"
							:author="post.author"
							:image="post.image"
							:tags="post.tags"
							:url="post.url"
							:date="new Date(post.published_at)"
							:index="post.index">
						</post>
				</template>
			</div>
		</div>

		<pagination
			:pagination="pagination"
			:pages="pages"
			:context="context"
			:context-data="contextData"
			:load-next="nextPage">
		</pagination>

		<div id="clip-notifier">Copied to clipboard!</div>
	</div>
</template>

<script>
	import excerpt from "../js/excerpt.js";
	import resolveUrl from "../js/resolve-url.js";

	import Pagination from "./Pagination.vue";
	import Post from "./Post.vue";

	export default {
		components: {
			Pagination,
			Post
		},

		data(){
			return {
				posts: [],
				pagination: 0,
				pages: 1,
				previousLeft: [],
				previousRight: [],
				tablet: false
			};
		},

		props: {
			context: {
				type: String,
				required: true
			},
			contextData: {
				type: String
			},
			limit: {
				type: Number,
				required: true
			}
		},

		/*computed: {
			tablet(){
				return window.innerWidth <= 900;
			}
		},*/

		mounted(){
			this.nextPage();
		},

		methods: {
			nextPage(){
				const query = {
					limit: this.limit,
					page: this.pagination + 1,
					include: "author,tags"
				};

				if(this.context === 'tag' || this.context === 'author')
					query.filter = `${this.context}:${this.contextData}`;

				fetch(ghost.url.api('posts', query))
				.then((v) => v.json())
				.then((v) => {
					this.pagination = v.meta.pagination.page;
					this.pages = v.meta.pagination.pages;
					this.posts.push(...v.posts.map((v, k) => {
						v.index = k;
						v.excerpt = excerpt(v.html, {words: 26});
						v.url = resolveUrl(v.url);
						if(v.image) v.image = resolveUrl(v.image);
						if(v.feature_image) v.image = resolveUrl(v.feature_image);

						return v;
					}));
				});
			}
		}
	}
</script>
